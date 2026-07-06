import React, { useState, useEffect } from 'react';
import { Alert, Severity } from '../types';
import { useTranslation } from '../i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeverityFilter } from './alerts/SeverityFilter';
import { AlertsTable } from './alerts/AlertsTable';

interface AlertsViewProps {
  alerts: Alert[];
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
  onAutoDiagnoseAll: () => void;
  diagnosingAll: boolean;
}

export default function AlertsView({ 
  alerts, 
  onNavigate, 
  onDiagnose, 
  onAutoDiagnoseAll, 
  diagnosingAll 
}: AlertsViewProps) {
  const { t, language } = useTranslation();
  const [activeSeverityTab, setActiveSeverityTab] = useState<'All' | Severity>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'24h' | '1h' | '7d' | 'all'>('24h');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => { setPage(1); }, [activeSeverityTab, localSearch, timeRange]);

  const cycleTimeRange = () => {
    const order: Array<'24h' | '1h' | '7d' | 'all'> = ['24h', '1h', '7d', 'all'];
    const nextIdx = (order.indexOf(timeRange) + 1) % order.length;
    setTimeRange(order[nextIdx]);
  };

  const getTimeRangeLabel = () => {
    if (timeRange === '1h') return t('timeLast1h');
    if (timeRange === '7d') return t('timeLast7d');
    if (timeRange === 'all') return t('timeAll');
    return t('last24Hours');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Device', 'Metric', 'Severity', 'Trigger Value', 'Threshold', 'Status', 'Time UTC'];
    const rows = filteredAlerts.map(a => [
      a.id,
      `"${a.device}"`,
      `"${a.metric}"`,
      a.severity,
      `"${a.triggerValue}"`,
      `"${a.threshold}"`,
      a.status,
      `"${a.time}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spark_iot_alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counts for tabs
  const countAll = alerts.length;
  const countCritical = alerts.filter(a => a.severity === 'Critical').length;
  const countWarning = alerts.filter(a => a.severity === 'Warning').length;
  const countInfo = alerts.filter(a => a.severity === 'Info').length;

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    return alerts.filter(a => {
      // Severity tab filter
      if (activeSeverityTab !== 'All' && a.severity !== activeSeverityTab) {
        return false;
      }
      // Search query filter
      if (localSearch) {
        const q = localSearch.toLowerCase();
        return (
          a.device.toLowerCase().includes(q) ||
          a.metric.toLowerCase().includes(q) ||
          a.severity.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, activeSeverityTab, localSearch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));

  return (
    <div className="space-y-6">
      {/* Header section with counts */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-[#e0e2ec]">{t('alerts')}</h2>
          <p className="text-[#b9cacb] text-xs">
            {t('alertsSubtitle')}
          </p>
        </div>

        {/* Filters and macro tabs */}
        <SeverityFilter
          activeSeverityTab={activeSeverityTab}
          setActiveSeverityTab={setActiveSeverityTab}
          countAll={countAll}
          countCritical={countCritical}
          countWarning={countWarning}
          countInfo={countInfo}
        />
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#e2e8f0] text-[18px]">filter_list</span>
          <Input 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-[#141822] border-[#2d3240] rounded-md py-1.5 pl-10 pr-4 text-xs text-white focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf] focus:outline-none placeholder:text-[#d1d5db]/30 h-8 font-sans" 
            placeholder={t('filterAlertsPlaceholder')}
            type="text"
          />
        </div>

        <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={cycleTimeRange}
            className="h-8 border-[#2d3240] text-[#e2e8f0] hover:bg-[#1a1f2c] hover:text-[#00cfbf] hover:border-[#00cfbf]/50 transition-colors text-xs flex items-center gap-1.5 cursor-pointer rounded-md"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {getTimeRangeLabel()}
          </Button>

          <Button 
            variant="outline"
            onClick={handleExportCSV}
            className="h-8 border-[#2d3240] text-[#e2e8f0] hover:bg-[#1a1f2c] hover:text-[#00cfbf] hover:border-[#00cfbf]/50 transition-colors text-xs flex items-center gap-1.5 cursor-pointer rounded-md"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            {t('exportReport')}
          </Button>

          <Button 
            disabled={diagnosingAll}
            onClick={onAutoDiagnoseAll}
            className="h-8 bg-[#00cfbf]/15 text-[#00cfbf] border border-[#00cfbf]/40 hover:bg-[#00cfbf]/25 transition-all text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer rounded-md shadow-[0_0_12px_rgba(0,207,191,0.2)]"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">auto_awesome</span>
            {diagnosingAll ? t('diagnosingAll') : t('autoDiagnoseAll')}
          </Button>
        </div>
      </div>

      {/* Alerts Data Table */}
      <AlertsTable
        alerts={alerts}
        filteredAlerts={filteredAlerts}
        totalFilteredCount={filteredAlerts.length}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onNavigate={onNavigate}
        onDiagnose={onDiagnose}
      />
    </div>
  );
}
