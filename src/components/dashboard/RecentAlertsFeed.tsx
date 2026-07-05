import React from 'react';
import { Alert } from '../../types';
import { useTranslation } from '../../i18n/context';
import { localizeAlert } from '@/lib/alertI18n';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RecentAlertsFeedProps {
  alerts: Alert[];
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
}

export const RecentAlertsFeed = React.memo(function RecentAlertsFeed({
  alerts,
  onNavigate,
  onDiagnose
}: RecentAlertsFeedProps) {
  const { t, language } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col transition-all shadow-md">
      <div className="flex justify-between items-center pb-4 border-b border-[#2d3240] mb-4">
        <div>
          <h3 className="font-sans text-base font-bold text-white tracking-wide">{t('recentAlertsFeed')}</h3>
        </div>
        <button 
          onClick={() => onNavigate('alerts')}
          className="font-mono text-xs font-bold text-[#00cfbf] hover:text-white px-2.5 py-1 rounded border border-[#00cfbf]/30 hover:bg-[#00cfbf]/15 transition-all cursor-pointer flex items-center gap-1"
        >
          <span>{t('viewAll')}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {alerts.map((alertRaw) => {
          const alert = localizeAlert(alertRaw, language);
          return (
          <div 
            key={alert.id}
            onClick={() => onNavigate('diagnosis-detail', alert.id)}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-[#1a1f2c] hover:bg-[#23293a] transition-all border border-[#2d3240] hover:border-[#00cfbf]/50 cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                alert.severity === 'Critical' ? 'bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab]' : 
                alert.severity === 'Warning' ? 'bg-[#ffba43]' : 'bg-[#00cfbf] shadow-[0_0_8px_#00cfbf]'
              }`}></span>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold text-white group-hover:text-[#00cfbf] transition-colors">{alert.device}</span>
                <span className="font-sans text-xs text-[#d1d5db] font-medium mt-0.5">{alert.metric} <strong className="text-white font-mono">{alert.triggerValue}</strong></span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-6 sm:ml-0">
              {alert.status === 'Diagnosed' && (
                <Badge variant="outline" className="flex items-center gap-1.5 bg-[#00cfbf]/15 text-[#00cfbf] border border-[#00cfbf]/40 px-2.5 py-1 text-[10px] font-extrabold tracking-wide uppercase h-auto rounded-md shadow-[0_0_8px_rgba(0,207,191,0.2)]">
                  <span className="material-symbols-outlined text-[#00cfbf] text-[14px] icon-fill">check_circle</span>
                  <span>{t('aiDiagnosed')}</span>
                </Badge>
              )}
              {alert.status === 'Diagnosing' && (
                <Badge variant="destructive" className="flex items-center gap-1.5 bg-[#ffba43]/20 text-[#ffba43] border border-[#ffba43]/40 px-2.5 py-1 text-[10px] font-extrabold tracking-wide uppercase h-auto rounded-md shadow-sm">
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
                  className="flex items-center gap-1.5 bg-[#00cfbf]/15 hover:bg-[#00cfbf]/25 text-[#00cfbf] border border-[#00cfbf]/40 px-2.5 h-7 text-xs font-extrabold transition-all rounded-md shadow-[0_0_8px_rgba(0,207,191,0.2)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">psychology</span>
                  <span>{t('runAi')}</span>
                </Button>
              )}
              <span className="font-mono text-xs font-semibold text-[#e2e8f0] w-24 text-right">{alert.time}</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
});
