import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Alert, Device, Doc } from '@/src/types';
import { fetchAlertsFromEngine } from '@/lib/adapters/alertAdapter';
import { fetchDevicesFromEngine } from '@/lib/adapters/deviceAdapter';

export async function GET() {
  let alertsData: Alert[];
  let devicesData: Device[];
  let docsData: Doc[];

  if (process.env.BACKEND_SOURCE_ALERT === 'engine') {
    try {
      alertsData = await fetchAlertsFromEngine();
    } catch (err) {
      console.error('[BFF][sync] engine alert fetch failed:', err);
      return NextResponse.json({ error: 'Engine alerts unreachable' }, { status: 502 });
    }
  } else {
    alertsData = db.getAlerts();
  }

  if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
    try {
      devicesData = await fetchDevicesFromEngine();
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
