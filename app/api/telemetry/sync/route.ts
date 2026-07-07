import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Alert, Device, Doc } from '@/src/types';
import { EngineAlert, mapEngineAlertToUiAlert } from '@/lib/adapters/alertAdapter';
import { EngineDevice, mapEngineDeviceToUiDevice, withRealSparkline } from '@/lib/adapters/deviceAdapter';

export async function GET() {
  const baseUrl = process.env.BACKEND_ENGINE_URL;
  let alertsData: Alert[];
  let devicesData: Device[];
  let docsData: Doc[];

  if (process.env.BACKEND_SOURCE_ALERT === 'engine') {
    try {
      const res = await fetch(`${baseUrl}/api/alert/recent?limit=500`, { cache: 'no-store' });
      const body: { code: number; msg: string; data: EngineAlert[] } = await res.json();
      alertsData = body.data.map(mapEngineAlertToUiAlert);
    } catch (err) {
      console.error('[BFF][sync] engine alert fetch failed:', err);
      return NextResponse.json({ error: 'Engine alerts unreachable' }, { status: 502 });
    }
  } else {
    alertsData = db.getAlerts();
  }

  if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
    try {
      const res = await fetch(`${baseUrl}/api/devices`, { cache: 'no-store' });
      const body: { code: number; msg: string; data: EngineDevice[] } = await res.json();
      const mapped = body.data.map(mapEngineDeviceToUiDevice);
      devicesData = await Promise.all(mapped.map(d => withRealSparkline(baseUrl!, d)));
    } catch (err) {
      console.error('[BFF][sync] engine device fetch failed:', err);
      return NextResponse.json({ error: 'Engine devices unreachable' }, { status: 502 });
    }
  } else {
    devicesData = db.getDevices();
  }

  if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
    // Engine doesn't have a documents endpoint yet — return empty array
    docsData = [];
  } else {
    docsData = db.getDocuments();
  }

  return NextResponse.json({ alerts: alertsData, devices: devicesData, documents: docsData });
}
