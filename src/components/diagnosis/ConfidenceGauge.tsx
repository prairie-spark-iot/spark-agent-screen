import React from 'react';
import { useTranslation } from '../../i18n/context';

interface ConfidenceGaugeProps {
  confidence: number;
  rootCause: string;
}

export const ConfidenceGauge = React.memo(function ConfidenceGauge({
  confidence,
  rootCause
}: ConfidenceGaugeProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:border-[#00cfbf]/40 shadow-md">
      <h3 className="font-sans text-xs font-bold text-[#e2e8f0] uppercase tracking-wider">{t('aiDiagnosticConfidence')}</h3>
      
      {/* Circular layout */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#1e2433" 
            strokeWidth="8" 
            fill="transparent" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#00cfbf" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * confidence) / 100}
            className="glow-cyan transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-2xl font-extrabold text-white">{confidence}%</span>
          <span className="text-[10px] uppercase tracking-wider text-[#d1d5db] font-bold">{t('confidenceLabel')}</span>
        </div>
      </div>

      <div className="border-t border-[#2d3240] pt-4 w-full text-center">
        <span className="font-mono text-[10px] font-bold tracking-wider text-[#d1d5db] uppercase block">{t('identifiedRootCause')}</span>
        <span className="font-sans text-sm font-bold text-white mt-1.5 block">{rootCause}</span>
      </div>
    </div>
  );
});
