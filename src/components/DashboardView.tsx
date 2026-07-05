import React from 'react';
import { Alert, Device } from '../types';
import { useTranslation } from '../i18n/context';
import { KpiCard } from './dashboard/KpiCard';
import { TelemetryChart } from './dashboard/TelemetryChart';
import { RecentAlertsFeed } from './dashboard/RecentAlertsFeed';

interface DashboardViewProps {
  alerts: Alert[];
  devices: Device[];
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
}

export default function DashboardView({ alerts, devices, onNavigate, onDiagnose }: DashboardViewProps) {
  const { t, language } = useTranslation();

  // Compute dashboard metrics with useMemo for performance
  const { totalDevices, onlineDevices, activeAlertsCount, diagnosedToday } = React.useMemo(() => {
    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
      activeAlertsCount: alerts.filter(a => a.status === 'Pending' || a.status === 'Diagnosing').length,
      diagnosedToday: alerts.filter(a => a.status === 'Diagnosed').length
    };
  }, [devices, alerts]);

  // Compile real-time or historical telemetry points for chart from devices
  // Let's make an elegant series of 11 points that represents temperature and pressure trends
  const telemetryData = React.useMemo(() => [
    { time: '10:00', temp: 22, press: 41 },
    { time: '10:15', temp: 24, press: 40 },
    { time: '10:30', temp: 18, press: 43 },
    { time: '10:45', temp: 15, press: 40 },
    { time: '11:00', temp: 28, press: 45 },
    { time: '11:15', temp: 48, press: 38 },
    { time: '11:30', temp: 64, press: 32 },
    { time: '11:45', temp: 58, press: 60 },
    { time: '12:00', temp: 72, press: 86 },
    { time: '12:15', temp: 88, press: 71 },
    { time: '12:30', temp: 92, press: 60 }
  ], []);

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
          progressPercentage={(onlineDevices / totalDevices) * 100}
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
          indicatorText={t('plus3LastHour')}
          indicatorColor="#00cfbf"
        />

        {/* Card 4: Avg Confidence */}
        <KpiCard
          title={t('avgConfidence')}
          value="87%"
          iconName="verified"
          iconColorClass="text-[#00cfbf]"
          progressPercentage={87}
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
