import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Device } from '@/src/types';

export async function GET() {
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
