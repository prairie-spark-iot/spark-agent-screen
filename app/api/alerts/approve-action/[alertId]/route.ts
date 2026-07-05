import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const currentAlerts = db.getAlerts();
  const alertIndex = currentAlerts.findIndex(a => a.id === alertId);

  if (alertIndex === -1) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  const alert = currentAlerts[alertIndex];
  if (!alert.diagnosis) {
    return NextResponse.json({ error: 'Alert is not diagnosed yet' }, { status: 400 });
  }

  alert.diagnosis.approved = true;
  alert.diagnosis.approvedAt = new Date().toISOString();
  alert.diagnosis.suggestedActionPlan = alert.diagnosis.suggestedActionPlan.map(act => ({
    ...act,
    completed: true
  }));

  db.setAlerts(currentAlerts);

  // Closed-loop physical remediation: Reset corresponding device status & metric back to nominal values
  const devices = db.getDevices();
  const updatedDevices = devices.map(dev => {
    if (alert.device && (dev.name.toLowerCase() === alert.device.toLowerCase() || alert.device.toLowerCase().includes(dev.name.toLowerCase()) || dev.name.toLowerCase().includes(alert.device.toLowerCase()))) {
      const nominalVal = dev.metricName === 'VIBRATION' ? '2.1' : dev.metricName === 'PRESSURE' ? '12.0' : dev.metricName === 'SPEED' ? '1.5' : dev.value;
      const nextSpark = [...dev.sparkline.slice(1), parseFloat(nominalVal)];
      return {
        ...dev,
        status: 'ONLINE' as const,
        value: nominalVal,
        sparkline: nextSpark
      };
    }
    return dev;
  });
  db.setDevices(updatedDevices);

  return NextResponse.json(alert);
}
