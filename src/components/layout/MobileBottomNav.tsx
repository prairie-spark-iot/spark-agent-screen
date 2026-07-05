import React from 'react';
import { useTranslation } from '../../i18n/context';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="lg:hidden flex bg-[#0E1118] border-t border-[#222630] items-center justify-around py-2 pb-safe text-xs text-[#b9cacb] font-semibold flex-shrink-0">
      <button 
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'text-[#00cfbf] font-bold bg-[#00cfbf]/15 shadow-[inset_0_0_8px_rgba(0,207,191,0.15)]' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px]">dashboard</span>
        <span>{t('overview')}</span>
      </button>
      <button 
        onClick={() => onNavigate('devices')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${activeTab === 'devices' ? 'text-[#00cfbf] font-bold bg-[#00cfbf]/15 shadow-[inset_0_0_8px_rgba(0,207,191,0.15)]' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px]">router</span>
        <span>{t('devices')}</span>
      </button>
      <button 
        onClick={() => onNavigate('alerts')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${activeTab === 'alerts' || activeTab === 'diagnosis-detail' ? 'text-[#00cfbf] font-bold bg-[#00cfbf]/15 shadow-[inset_0_0_8px_rgba(0,207,191,0.15)]' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px]">warning</span>
        <span>{t('alerts')}</span>
      </button>
      <button 
        onClick={() => onNavigate('knowledge')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${activeTab === 'knowledge' ? 'text-[#00cfbf] font-bold bg-[#00cfbf]/15 shadow-[inset_0_0_8px_rgba(0,207,191,0.15)]' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px]">menu_book</span>
        <span>{t('knowledge')}</span>
      </button>
    </div>
  );
};
