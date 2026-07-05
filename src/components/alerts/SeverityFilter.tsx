import React from 'react';
import { Severity } from '../../types';
import { useTranslation } from '../../i18n/context';

interface SeverityFilterProps {
  activeSeverityTab: 'All' | Severity;
  setActiveSeverityTab: (tab: 'All' | Severity) => void;
  countAll: number;
  countCritical: number;
  countWarning: number;
  countInfo: number;
}

export const SeverityFilter = React.memo(function SeverityFilter({
  activeSeverityTab,
  setActiveSeverityTab,
  countAll,
  countCritical,
  countWarning,
  countInfo
}: SeverityFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center bg-[#141822] border border-[#2d3240] rounded-lg p-1 text-xs shadow-md">
      <button 
        onClick={() => setActiveSeverityTab('All')}
        className={`px-3 py-1.5 rounded-md font-sans transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
          activeSeverityTab === 'All' ? 'bg-[#2e3445] text-white shadow-sm' : 'text-[#d1d5db] hover:text-white'
        }`}
      >
        {t('all')}
        <span className="font-mono bg-[#0f121a] px-1.5 py-0.5 rounded text-[10px] text-[#e2e8f0] font-bold">{countAll}</span>
      </button>
      <button 
        onClick={() => setActiveSeverityTab('Critical')}
        className={`px-3 py-1.5 rounded-md font-sans transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
          activeSeverityTab === 'Critical' ? 'bg-[#3d2124] text-[#ffb4ab] border border-[#ffb4ab]/30 shadow-sm' : 'text-[#d1d5db] hover:text-[#ffb4ab]'
        }`}
      >
        {t('Critical')}
        <span className="font-mono bg-[#ffb4ab]/20 text-[#ffb4ab] px-1.5 py-0.5 rounded text-[10px] font-extrabold">{countCritical}</span>
      </button>
      <button 
        onClick={() => setActiveSeverityTab('Warning')}
        className={`px-3 py-1.5 rounded-md font-sans transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
          activeSeverityTab === 'Warning' ? 'bg-[#3b2d18] text-[#ffba43] border border-[#ffba43]/30 shadow-sm' : 'text-[#d1d5db] hover:text-[#ffba43]'
        }`}
      >
        {t('Warning')}
        <span className="font-mono bg-[#ffba43]/20 text-[#ffba43] px-1.5 py-0.5 rounded text-[10px] font-extrabold">{countWarning}</span>
      </button>
      <button 
        onClick={() => setActiveSeverityTab('Info')}
        className={`px-3 py-1.5 rounded-md font-sans transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
          activeSeverityTab === 'Info' ? 'bg-[#00cfbf]/15 text-[#00cfbf] border border-[#00cfbf]/30 shadow-sm' : 'text-[#d1d5db] hover:text-[#00cfbf]'
        }`}
      >
        {t('Info')}
        <span className="font-mono bg-[#00cfbf]/20 text-[#00cfbf] px-1.5 py-0.5 rounded text-[10px] font-extrabold">{countInfo}</span>
      </button>
    </div>
  );
});
