import React, { useState } from 'react';
import { Alert } from '../types';
import { useTranslation } from '../i18n/context';
import { localizeAlert } from '@/lib/alertI18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfidenceGauge } from './diagnosis/ConfidenceGauge';
import { DiagnosisTimeline } from './diagnosis/DiagnosisTimeline';
import { SuggestedActionPlan } from './diagnosis/SuggestedActionPlan';

interface DiagnosisDetailViewProps {
  alert: Alert | null;
  onDiagnose: (alertId: string) => void;
  onApproveAction: (alertId: string) => void;
  onBack: () => void;
}

export default function DiagnosisDetailView({ 
  alert, 
  onDiagnose, 
  onApproveAction, 
  onBack 
}: DiagnosisDetailViewProps) {
  const { t, language } = useTranslation();
  const [localCompletedActions, setLocalCompletedActions] = useState<Record<string, boolean>>({});

  const localizedAlert = React.useMemo(() => {
    return alert ? localizeAlert(alert, language) : null;
  }, [alert, language]);

  if (!localizedAlert) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 bg-[#12151C] border-[#222630] text-center rounded-xl">
        <span className="material-symbols-outlined text-4xl text-[#b9cacb]/30 mb-3 font-light">psychology</span>
        <h3 className="font-sans text-base font-semibold text-[#e0e2ec]">{t('noAlertSelected')}</h3>
        <p className="text-[#b9cacb] text-xs mt-1 max-w-xs px-4">{t('noAlertSelectedDesc')}</p>
        <Button 
          onClick={onBack}
          variant="outline"
          className="mt-4 border-[#222630] text-[#e0e2ec] hover:bg-[#222630] h-9"
        >
          {t('viewAll')}
        </Button>
      </Card>
    );
  }

  const isDiagnosed = localizedAlert.status === 'Diagnosed' && localizedAlert.diagnosis;
  const isDiagnosing = localizedAlert.status === 'Diagnosing';

  // Toggle checklist item
  const toggleActionItem = (itemId: string) => {
    setLocalCompletedActions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Navigation Header */}
      <div className="flex items-center gap-2 text-xs text-[#d1d5db] pb-2 border-b border-[#2d3240]">
        <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold">
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          {t('alerts')}
        </button>
        <span>/</span>
        <span className="text-white font-mono font-bold">{localizedAlert.id}</span>
      </div>

      {/* Main Alert Header Panel */}
      <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-md">
        {/* Decorative corner glow */}
        <div className={`absolute top-0 right-0 w-36 h-36 rounded-bl-full blur-3xl pointer-events-none opacity-20 ${
          localizedAlert.severity === 'Critical' ? 'bg-[#ffb4ab]' :
          localizedAlert.severity === 'Warning' ? 'bg-[#ffba43]' : 'bg-secondary'
        }`}></div>

        <div className="space-y-2.5 z-10">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold font-sans shadow-sm ${
              localizedAlert.severity === 'Critical' ? 'bg-[#ffb4ab]/20 border-[#ffb4ab]/40 text-[#ffb4ab] shadow-[0_0_10px_rgba(255,180,171,0.3)]' :
              localizedAlert.severity === 'Warning' ? 'bg-[#ffba43]/20 border-[#ffba43]/40 text-[#ffba43]' :
              'bg-secondary/20 border-secondary/40 text-secondary'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                localizedAlert.severity === 'Critical' ? 'bg-[#ffb4ab]' :
                localizedAlert.severity === 'Warning' ? 'bg-[#ffba43]' : 'bg-secondary'
              }`}></span>
              {localizedAlert.severity === 'Critical' ? t('Critical') :
               localizedAlert.severity === 'Warning' ? t('Warning') : t('Info')}
            </span>
            <span className="font-mono text-xs font-semibold text-[#d1d5db]">{localizedAlert.time} UTC</span>
          </div>
          <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00cfbf]">
              {localizedAlert.icon === 'router' ? 'router' : 
               localizedAlert.icon === 'dns' ? 'dns' : 
               localizedAlert.icon === 'security' ? 'security' : 
               localizedAlert.icon === 'water_damage' ? 'water_damage' : 
               'precision_manufacturing'}
            </span>
            {localizedAlert.device} {t('alertSuffix')}
          </h2>
          <p className="font-sans text-xs text-[#e2e8f0] max-w-lg leading-relaxed font-medium">{localizedAlert.details}</p>
        </div>

        {/* Trigger vs Threshold Card */}
        <div className="bg-[#0f121a] border border-[#2d3240] rounded-lg p-4 flex gap-6 w-full md:w-auto z-10 shadow-inner">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#d1d5db] uppercase">{t('triggeredValue')}</span>
            <span className={`font-mono text-2xl font-extrabold mt-1 ${
              localizedAlert.severity === 'Critical' ? 'text-[#ffb4ab]' :
              localizedAlert.severity === 'Warning' ? 'text-[#ffba43]' : 'text-secondary'
            }`}>{localizedAlert.triggerValue}</span>
          </div>
          <div className="w-px bg-[#2d3240] self-stretch"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#d1d5db] uppercase">{t('thresholdLimit')}</span>
            <span className="font-mono text-2xl font-bold mt-1 text-white">{localizedAlert.threshold}</span>
          </div>
        </div>
      </div>

      {/* Conditional Rendering based on state */}
      {!isDiagnosed && !isDiagnosing && (
        <Card className="bg-[#141822] border-[#2d3240] p-8 flex flex-col items-center justify-center text-center rounded-xl shadow-md">
          <span className="material-symbols-outlined text-4xl text-[#d1d5db]/50 mb-3 font-bold">psychology</span>
          <h3 className="font-sans text-base font-bold text-white">{t('aiDiagnosisPending')}</h3>
          <p className="text-[#d1d5db] text-xs mt-1.5 max-w-sm px-4 leading-relaxed font-medium">{t('aiDiagnosisPendingDesc')}</p>
          <Button 
            onClick={() => onDiagnose(localizedAlert.id)}
            className="mt-4 bg-secondary text-[#00363a] font-bold font-sans rounded text-xs hover:bg-secondary/90 transition-all cursor-pointer flex items-center gap-1.5 glow-cyan h-9 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">auto_awesome</span>
            {t('runAiDiagnosticModel')}
          </Button>
        </Card>
      )}

      {isDiagnosing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 bg-[#141822] border border-[#2d3240] rounded-xl p-6 space-y-6 shadow-md">
            <div className="border-b border-[#2d3240] pb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary spin-slow">auto_awesome</span>
                <span className="font-sans text-base font-bold text-white">{t('generatingReasoning')}</span>
              </div>
              <span className="font-mono text-[10px] text-secondary border border-secondary/40 px-2 py-0.5 rounded bg-secondary/10">
                INFERENCE IN PROGRESS...
              </span>
            </div>
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#222630] border border-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#222630] rounded w-3/4"></div>
                    <div className="h-3 bg-[#1e222d] rounded w-full"></div>
                    <div className="h-3 bg-[#1e222d] rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 flex flex-col items-center justify-center h-48 space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-[#222630] border-t-secondary animate-spin"></div>
              <div className="h-3 bg-[#222630] rounded w-1/2"></div>
            </div>
            <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 space-y-3">
              <div className="h-4 bg-[#222630] rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-[#1e222d] rounded w-full"></div>
              <div className="h-8 bg-[#1e222d] rounded w-full"></div>
            </div>
          </div>
        </div>
      )}

      {isDiagnosed && localizedAlert.diagnosis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: AI Diagnostic Reasoning timeline */}
          <div className="lg:col-span-2 bg-[#141822] border border-[#2d3240] rounded-xl p-6 space-y-6 shadow-md">
            <div className="border-b border-[#2d3240] pb-4 flex justify-between items-center">
              <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">psychology</span>
                {t('aiDiagnosticReasoning')}
              </h3>
              <span className="font-mono text-[10px] font-bold tracking-wider text-secondary border border-secondary/40 px-2 py-0.5 rounded uppercase bg-secondary/10">
                {t('aiModelLabel')}
              </span>
            </div>

            {/* Timelines list */}
            <DiagnosisTimeline timeline={localizedAlert.diagnosis.timeline} />
          </div>

          {/* Right Column: Confidence and suggested actions plan */}
          <div className="space-y-6">
            {/* KPI Card: Confidence Circle */}
            <ConfidenceGauge 
              confidence={localizedAlert.diagnosis.confidence} 
              rootCause={localizedAlert.diagnosis.rootCause} 
            />

            {/* Action Plan Checklist Card */}
            <SuggestedActionPlan
              actionPlan={localizedAlert.diagnosis.suggestedActionPlan}
              approved={localizedAlert.diagnosis.approved}
              approvedAt={localizedAlert.diagnosis.approvedAt}
              localCompletedActions={localCompletedActions}
              toggleActionItem={toggleActionItem}
              onApproveAction={() => onApproveAction(localizedAlert.id)}
            />
          </div>

        </div>
      )}
    </div>
  );
}
