import React from 'react';
import { Alert } from '../../types';
import { useTranslation } from '../../i18n/context';
import { localizeAlert } from '@/lib/alertI18n';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AlertsTableProps {
  alerts: Alert[];
  filteredAlerts: Alert[];
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
}

export const AlertsTable = React.memo(function AlertsTable({
  alerts,
  filteredAlerts,
  onNavigate,
  onDiagnose
}: AlertsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl overflow-hidden shadow-md flex flex-col">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse whitespace-nowrap text-xs border-0">
          <TableHeader className="bg-[#1a1f2c] border-b border-[#2d3240] hover:bg-transparent">
            <TableRow className="font-mono text-[9px] font-bold tracking-wider text-white/90 uppercase border-b-0 hover:bg-transparent">
              <TableHead className="px-5 py-3 w-28 h-auto border-b-0 text-[#e2e8f0]">{t('timeUtc')}</TableHead>
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('deviceEntity')}</TableHead>
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('metric')}</TableHead>
              <TableHead className="px-5 py-3 text-right w-32 h-auto border-b-0 text-[#e2e8f0]">{t('triggerValue')}</TableHead>
              <TableHead className="px-5 py-3 w-28 h-auto border-b-0 text-[#e2e8f0]">{t('severity')}</TableHead>
              <TableHead className="px-5 py-3 w-40 h-auto border-b-0 text-[#e2e8f0]">{t('diagnosisStatus')}</TableHead>
              <TableHead className="px-5 py-3 w-12 h-auto border-b-0"></TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-[#2d3240] border-0">
            {filteredAlerts.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="px-5 py-8 text-center text-[#d1d5db]/50 font-sans border-0">
                  {t('noAlertsFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alertRaw) => {
                const alert = localizeAlert(alertRaw, language);
                return (
                <TableRow 
                  key={alert.id}
                  onClick={() => onNavigate('diagnosis-detail', alert.id)}
                  className="hover:bg-[#1d2334] transition-colors group cursor-pointer border-[#2d3240]"
                >
                  <TableCell className="px-5 py-4 font-mono text-[#d1d5db] border-0">{alert.time}</TableCell>
                  
                  <TableCell className="px-5 py-4 font-mono text-white border-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#b9cacb] text-[18px]">
                        {alert.icon === 'router' ? 'router' : 
                         alert.icon === 'dns' ? 'dns' : 
                         alert.icon === 'security' ? 'security' : 
                         alert.icon === 'water_damage' ? 'water_damage' : 
                         'precision_manufacturing'}
                      </span>
                      <span>{alert.device}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 font-sans text-white font-medium border-0">{alert.metric}</TableCell>
                  
                  <TableCell className={`px-5 py-4 font-mono text-right font-semibold border-0 ${
                    alert.severity === 'Critical' ? 'text-[#ffb4ab]' :
                    alert.severity === 'Warning' ? 'text-[#ffba43]' : 'text-secondary'
                  }`}>
                    {alert.triggerValue}
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 border-0">
                    <Badge 
                      variant="outline"
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium font-sans h-5 ${
                        alert.severity === 'Critical' ? 'bg-[#ffb4ab]/15 border-[#ffb4ab]/40 text-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.3)] hover:bg-[#ffb4ab]/25' :
                        alert.severity === 'Warning' ? 'bg-[#ffba43]/10 border-[#ffba43]/30 text-[#ffba43] hover:bg-[#ffba43]/15' :
                        'bg-[#00cfbf]/15 border-[#00cfbf]/40 text-[#00cfbf] hover:bg-[#00cfbf]/25'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-[#ffb4ab]' :
                        alert.severity === 'Warning' ? 'bg-[#ffba43]' : 'bg-[#00cfbf]'
                      }`}></span>
                      {alert.severity === 'Critical' ? t('Critical') :
                       alert.severity === 'Warning' ? t('Warning') : t('Info')}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 border-0">
                    {alert.status === 'Diagnosed' && (
                      <Badge variant="outline" className="inline-flex items-center gap-1.5 text-[#00cfbf] bg-[#00cfbf]/15 px-2.5 py-1 rounded border border-[#00cfbf]/40 font-sans font-semibold text-[10px] h-6 shadow-[0_0_8px_rgba(0,207,191,0.2)]">
                        <span className="material-symbols-outlined text-[#00cfbf] text-[14px]">check_circle</span>
                        <span>{t('aiDiagnosed')}</span>
                      </Badge>
                    )}
                    {alert.status === 'Diagnosing' && (
                      <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-[#ffba43] bg-[#ffba43]/10 px-2.5 py-1 rounded border border-[#ffba43]/20 font-sans font-semibold text-[10px] h-6">
                        <span className="material-symbols-outlined text-[14px] spin-slow">progress_activity</span>
                        <span>{t('diagnosing')}</span>
                      </Badge>
                    )}
                    {alert.status === 'Pending' && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDiagnose(alert.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-[#b9cacb] hover:text-white bg-[#32353c]/30 hover:bg-[#32353c]/60 px-2 h-6 border border-[#849495]/20 font-sans font-semibold transition-colors cursor-pointer rounded-md text-[10px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        <span>{t('diagnoseAnomaly')}</span>
                      </Button>
                    )}
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 text-right border-0">
                    <Button variant="ghost" size="icon-sm" className="text-[#b9cacb] hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined">more_vert</span>
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#222630] flex items-center justify-between bg-[#191c23] text-xs">
        <p className="text-[#b9cacb]">
          {t('showing')}{' '}
          <span className="text-white font-mono">{filteredAlerts.length}</span>{' '}
          {t('ofTotal')}{' '}
          <span className="text-white font-mono">{alerts.length}</span>{' '}
          {t('alertsCount')}
        </p>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded text-[#b9cacb] hover:bg-[#32353c] hover:text-white transition-colors disabled:opacity-50" disabled>
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-1 font-mono">
            <button className="w-6 h-6 rounded bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded text-[#b9cacb] hover:bg-[#32353c] flex items-center justify-center transition-colors">2</button>
            <button className="w-6 h-6 rounded text-[#b9cacb] hover:bg-[#32353c] flex items-center justify-center transition-colors">3</button>
          </div>
          <button className="p-1 rounded text-[#b9cacb] hover:bg-[#32353c] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
});
