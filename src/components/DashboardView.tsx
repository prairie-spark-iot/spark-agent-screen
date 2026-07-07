import React from 'react';
import { Alert, Device } from '../types';
import { useTranslation } from '../i18n/context';
import { KpiCard } from './dashboard/KpiCard';
import { TelemetryChart, type TelemetryPoint, METRICS_CONFIG } from './dashboard/TelemetryChart';
import { RecentAlertsFeed } from './dashboard/RecentAlertsFeed';
import { TELEMETRY_LABELS } from '@/lib/adapters/deviceAdapter';

interface DashboardViewProps {
  alerts: Alert[];
  devices: Device[];
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
}

export default function DashboardView({ alerts, devices, onNavigate, onDiagnose }: DashboardViewProps) {
  const { t, language } = useTranslation();

  // Compute dashboard metrics with useMemo for performance
  const { totalDevices, onlineDevices, activeAlertsCount, diagnosedToday, diagnosedLastHour, avgConfidence } = React.useMemo(() => {
    const diagnosedAlerts = alerts.filter(a => a.diagnosis?.confidence != null);
    const avg = diagnosedAlerts.length > 0
      ? Math.round(diagnosedAlerts.reduce((sum, a) => sum + a.diagnosis!.confidence, 0) / diagnosedAlerts.length)
      : null;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
      activeAlertsCount: alerts.filter(a => a.status === 'Pending' || a.status === 'Diagnosing').length,
      diagnosedToday: alerts.filter(a => a.status === 'Diagnosed' && Date.parse(a.timestamp) >= startOfToday.getTime()).length,
      diagnosedLastHour: alerts.filter(a => a.status === 'Diagnosed' && Date.parse(a.timestamp) >= oneHourAgo).length,
      avgConfidence: avg,
    };
  }, [devices, alerts]);

  // Compile real-time telemetry points for chart from device sparkline data for ALL metrics
  const telemetryData = React.useMemo<TelemetryPoint[]>(() => {
    const averageSparkline = (devs: Device[]): number[] => {
      if (devs.length === 0) return [];
      const maxLen = Math.max(...devs.map(d => d.sparkline.length));
      return Array.from({ length: maxLen }, (_, i) => {
        const vals = devs.map(d => d.sparkline[i]).filter((v): v is number => v !== undefined);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      });
    };

    const series = Object.entries(METRICS_CONFIG).map(([key, config]) => ({
      key,
      values: averageSparkline(devices.filter(d => d.metricName === TELEMETRY_LABELS[config.labelKey])),
    }));

    const len = Math.max(...series.map(s => s.values.length), 1);

    const now = new Date();
    return Array.from({ length: len }, (_, i) => {
      const t = new Date(now.getTime() - (len - 1 - i) * 2 * 60000);
      const point: TelemetryPoint = {
        time: `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`,
        temp: 0,
        press: 0,
        current: 0,
        speed: 0,
        humidity: 0,
      };
      for (const s of series) {
        const val = s.values[i];
        if (val !== undefined) {
          const p = point as unknown as Record<string, number | string>;
          p[s.key] = s.key === 'press'
            ? Math.round(val * 100) / 100
            : Math.round(val * 10) / 10;
        }
      }
      return point;
    });
  }, [devices]);

  // Get most recent 3 alerts for the feed
  const recentAlerts = React.useMemo(() => alerts.slice(0, 3), [alerts]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Devices Online */}
        <KpiCard
          title={t('devicesOnline')}
          value={onlineDevices}
          subValue={`/${totalDevices}`}
          iconName="router"
          iconColorClass="text-[#00cfbf]"
          progressPercentage={totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0}
          progressColorClass="bg-[#00cfbf]"
        />

        {/* Card 2: Active Alerts */}
        <KpiCard
          title={t('activeAlerts')}
          value={activeAlertsCount}
          iconName="warning"
          iconColorClass="text-[#ffb4ab]"
          iconFill={true}
          indicatorText={activeAlertsCount > 0 ? t('requiresAttention') : t('systemNominal')}
          indicatorColor={activeAlertsCount > 0 ? '#ffb4ab' : '#00cfbf'}
        />

        {/* Card 3: AI Diagnoses Today */}
        <KpiCard
          title={t('aiDiagnosesToday')}
          value={diagnosedToday}
          iconName="psychology"
          iconColorClass="text-[#00cfbf]"
          indicatorText={t('diagnosesLastHourDelta', { count: diagnosedLastHour })}
          indicatorColor="#00cfbf"
        />

        {/* Card 4: Avg Confidence */}
        <KpiCard
          title={t('avgConfidence')}
          value={avgConfidence !== null ? `${avgConfidence}%` : '--'}
          iconName="verified"
          iconColorClass="text-[#00cfbf]"
          progressPercentage={avgConfidence ?? 0}
          progressColorClass="bg-[#00cfbf]"
        />
      </div>

      {/* Main Chart Area */}
      <TelemetryChart data={telemetryData} />

      {/* Recent Alerts Feed */}
      <RecentAlertsFeed 
        alerts={recentAlerts} 
        onNavigate={onNavigate} 
        onDiagnose={onDiagnose} 
      />
    </div>
  );
}
