import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Device } from '@/src/types';
import { fetchDevicesFromEngine } from '@/lib/adapters/deviceAdapter';

// BACKEND_SOURCE_DEVICE=engine|mock — strangler-fig flag, see
// spark-agent-docs/frontend-backend-integration-strategy.md §1. This route's own contract
// (a plain Device[] array) stays stable for src/App.tsx regardless of which source backs it.
export async function GET() {
  console.log('[BFF][devices] BACKEND_SOURCE_DEVICE =', JSON.stringify(process.env.BACKEND_SOURCE_DEVICE),
    '| BACKEND_ENGINE_URL =', JSON.stringify(process.env.BACKEND_ENGINE_URL));

  if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
    try {
      return NextResponse.json(await fetchDevicesFromEngine());
    } catch (err) {
      console.error('🚨 BFF RETRIEVAL FAILED:', err);
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Engine unreachable' }, { status: 502 });
    }
  }
  return NextResponse.json(db.getDevices());
}

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }
    let bodyData: any;
    try {
      bodyData = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }
    const { name, location, metricName, initialValue, unit, status } = bodyData;
    if (!name || !metricName) {
      return NextResponse.json({ error: 'Name and metric name are required' }, { status: 400 });
    }

    // When integrated with the live engine, forward the create request to the real backend.
    if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
      const baseUrl = process.env.BACKEND_ENGINE_URL;
      const res = await fetch(`${baseUrl}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const engineBody = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: engineBody.msg || `engine POST /api/devices returned ${res.status}` }, { status: 502 });
      }
      return NextResponse.json(engineBody, { status: res.status });
    }

    const newDevice: Device = {
      id: `dev-${Date.now()}`,
      name,
      location: location || 'General Area',
      metricName,
      value: initialValue || '0',
      unit: unit || '',
      status: status || 'ONLINE',
      sparkline: Array(9).fill(parseFloat(initialValue) || 0),
      icon: 'router'
    };

    const currentDevices = db.getDevices();
    currentDevices.push(newDevice);
    db.setDevices(currentDevices);

    return NextResponse.json(newDevice, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
