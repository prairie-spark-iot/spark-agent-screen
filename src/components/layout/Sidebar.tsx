import React from 'react';
import { useTranslation } from '../../i18n/context';

interface SidebarProps {
  logoSrc: string;
  activeTab: string;
  activeNodeLabel: string;
  onNavigate: (tab: string) => void;
  onOpenNodeModal: () => void;
  onOpenInfoModal: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  logoSrc,
  activeTab,
  activeNodeLabel,
  onNavigate,
  onOpenNodeModal,
  onOpenInfoModal,
  onLogout
}) => {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#10131B] border-r border-[#2d3240] flex-shrink-0">
      {/* Brand Header with Logo */}
      <div className="p-5 pb-2 flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#00cfbf]/70 flex items-center justify-center bg-[#00cfbf]/15 shadow-[0_0_12px_rgba(0,207,191,0.35)]">
          <img 
            src={logoSrc} 
            alt="Spark Logo" 
            className="w-full h-full object-cover filter brightness-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-sm font-extrabold tracking-wider text-[#00cfbf] uppercase">{t('appName')}</span>
          <span className="font-mono text-[9px] text-[#e0e2ec] uppercase tracking-widest">{t('aiAnalyticalCore')}</span>
        </div>
      </div>

      {/* System Node Identifier */}
      <div className="p-4 border-b border-[#2d3240]">
        <div 
          onClick={onOpenNodeModal}
          title={t('switchSystemNode')}
          className="bg-[#1b202c] border border-[#313747] hover:border-[#00cfbf] rounded-lg p-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#00cfbf]/15 border border-[#00cfbf]/35 group-hover:bg-[#00cfbf]/25 flex items-center justify-center text-[#00cfbf] shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] font-bold">radar</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="font-mono text-xs font-bold text-white truncate">
                {activeNodeLabel.startsWith('sysNode') ? t(activeNodeLabel) : activeNodeLabel}
              </span>
              <span className="font-sans text-[10px] text-[#00cfbf] flex items-center gap-1 mt-0.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00cfbf] animate-pulse shadow-[0_0_6px_#00cfbf]"></span>
                {t('vigilantActive')}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-sm text-[#849495] group-hover:text-[#00cfbf] transition-colors">unfold_more</span>
        </div>
      </div>

      {/* Navigation links block */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        <button 
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-sans text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'bg-[#00cfbf]/15 text-[#00cfbf] border-l-2 border-[#00cfbf] shadow-[inset_0_0_12px_rgba(0,207,191,0.15)]' 
              : 'text-[#d1d5db] hover:text-white hover:bg-[#1a1f2c] hover:border-l-2 hover:border-[#00cfbf]/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          {t('overview')}
        </button>

        <button 
          onClick={() => onNavigate('devices')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-sans text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'devices' 
              ? 'bg-[#00cfbf]/15 text-[#00cfbf] border-l-2 border-[#00cfbf] shadow-[inset_0_0_12px_rgba(0,207,191,0.15)]' 
              : 'text-[#d1d5db] hover:text-white hover:bg-[#1a1f2c] hover:border-l-2 hover:border-[#00cfbf]/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">router</span>
          {t('devices')}
        </button>

        <button 
          onClick={() => onNavigate('alerts')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-sans text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'alerts' || activeTab === 'diagnosis-detail'
              ? 'bg-[#00cfbf]/15 text-[#00cfbf] border-l-2 border-[#00cfbf] shadow-[inset_0_0_12px_rgba(0,207,191,0.15)]' 
              : 'text-[#d1d5db] hover:text-white hover:bg-[#1a1f2c] hover:border-l-2 hover:border-[#00cfbf]/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          {t('alerts')}
        </button>

        <button 
          onClick={() => onNavigate('knowledge')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-sans text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'knowledge' 
              ? 'bg-[#00cfbf]/15 text-[#00cfbf] border-l-2 border-[#00cfbf] shadow-[inset_0_0_12px_rgba(0,207,191,0.15)]' 
              : 'text-[#d1d5db] hover:text-white hover:bg-[#1a1f2c] hover:border-l-2 hover:border-[#00cfbf]/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          {t('knowledge')}
        </button>
      </nav>

      {/* Bottom utility info */}
      <div className="p-4 border-t border-[#2d3240] space-y-1">
        <button 
          onClick={onOpenInfoModal}
          className="w-full flex items-center gap-3 px-3 py-2 rounded font-sans text-[11px] font-bold text-[#d1d5db] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#00cfbf]">help_outline</span>
          {t('controlManual')}
        </button>

        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded font-sans text-[11px] font-bold text-red-400/90 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            {t('logoutBtn')}
          </button>
        )}
      </div>
    </aside>
  );
};
