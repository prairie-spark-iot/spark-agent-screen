import React from 'react';
import { useTranslation } from '../../i18n/context';

interface SuggestedAction {
  id: string;
  text: string;
  completed: boolean;
}

interface SuggestedActionPlanProps {
  actionPlan: SuggestedAction[];
  approved: boolean;
  approvedAt?: string;
  localCompletedActions: Record<string, boolean>;
  toggleActionItem: (id: string) => void;
  onApproveAction: () => void;
}

export const SuggestedActionPlan = React.memo(function SuggestedActionPlan({
  actionPlan,
  approved,
  approvedAt,
  localCompletedActions,
  toggleActionItem,
  onApproveAction
}: SuggestedActionPlanProps) {
  const { t, language } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 flex flex-col space-y-4 transition-all hover:border-[#00cfbf]/40 shadow-md">
      <h3 className="font-sans text-xs font-bold text-[#e2e8f0] uppercase tracking-wider">{t('suggestedActionPlan')}</h3>
      
      <div className="flex flex-col gap-2.5">
        {actionPlan.map((act) => {
          const isChecked = approved || localCompletedActions[act.id] || act.completed;
          return (
            <div 
              key={act.id}
              onClick={() => !approved && toggleActionItem(act.id)}
              className={`flex items-start gap-3 p-3 rounded-lg bg-[#1a1f2c] border cursor-pointer select-none transition-all shadow-sm ${
                isChecked 
                  ? 'border-[#00cfbf]/40 text-[#d1d5db] bg-[#00cfbf]/10' 
                  : 'border-[#2d3240] text-white hover:bg-[#23293a] hover:border-[#00cfbf]/50'
              }`}
            >
              <button className="mt-0.5 text-[#00cfbf] flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {isChecked ? 'check_box' : 'check_box_outline_blank'}
                </span>
              </button>
              <span className={`font-sans text-xs font-medium ${isChecked ? 'line-through text-[#d1d5db]' : 'text-white'}`}>
                {act.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Approval Buttons */}
      <div className="border-t border-[#2d3240] pt-4 flex flex-col gap-3">
        <p className="font-sans text-xs font-medium text-[#d1d5db] leading-tight text-center">
          {t('humanConfirmationRequired')}
        </p>

        {approved ? (
          <div className="bg-[#00cfbf]/20 border border-[#00cfbf]/50 text-[#00cfbf] p-3 rounded-lg flex items-center justify-center gap-2.5 shadow-sm">
            <span className="material-symbols-outlined text-[20px] font-bold">task_alt</span>
            <div className="flex flex-col items-center">
              <span className="font-sans text-xs font-extrabold">{t('actionPlanDispatched')}</span>
              <span className="font-mono text-[10px] text-[#e2e8f0] font-medium">{new Date(approvedAt || '').toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onApproveAction}
            className="w-full bg-[#00cfbf] text-[#0B0E14] font-sans text-xs font-extrabold py-2.5 rounded-md hover:bg-[#00cfbf]/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,207,191,0.3)] h-9"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">done_all</span>
            {t('approveActionPlan')}
          </button>
        )}
      </div>
    </div>
  );
});
