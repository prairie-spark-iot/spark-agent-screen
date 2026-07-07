import React from 'react';
import { useTranslation } from '../../i18n/context';

interface TopNavbarProps {
  logoSrc: string;
  activeTab: string;
  activeNodeLabel: string;
  pendingAlertsCount: number;
  onNavigate: (tab: string) => void;
  onOpenNodeModal: () => void;
  onOpenInfoModal: () => void;
  onLogout?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  logoSrc,
  activeTab,
  activeNodeLabel,
  pendingAlertsCount,
  onNavigate,
  onOpenNodeModal,
  onOpenInfoModal,
  onLogout
}) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="h-14 bg-[#12151C] border-b border-[#2d3240] flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-6">
        {/* Branding - only visible on mobile/tablet because sidebar is hidden on mobile */}
        <div className="flex lg:hidden items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[#00cfbf]/60 flex items-center justify-center bg-[#00cfbf]/15 shadow-[0_0_10px_rgba(0,207,191,0.35)]">
            <img 
              src={logoSrc} 
              alt="Spark IoT Logo" 
              className="w-full h-full object-cover filter brightness-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-sans text-sm sm:text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-[#00cfbf] to-[#7ffdf3] bg-clip-text text-transparent uppercase hidden xs:block">
            {t('appName')}
          </h1>
        </div>

        {/* Breadcrumb Path - visible on desktop to show active page path instead of duplicating logo */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00cfbf] animate-pulse shadow-[0_0_6px_#00cfbf]"></div>
          <span className="text-[#00cfbf] font-bold tracking-wider">{t('systemGateway')}</span>
          <span className="text-[#3a494b] font-semibold">/</span>
          <span className="text-white uppercase tracking-widest font-bold">
            {activeTab === 'dashboard' ? t('overview') :
             activeTab === 'devices' ? t('devices') :
             activeTab === 'alerts' ? t('alerts') :
             activeTab === 'diagnosis-detail' ? t('diagnosticsDetailTab') :
             activeTab === 'knowledge' ? t('knowledge') : ''}
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Global Active Node Switcher Pill */}
        <button
          onClick={onOpenNodeModal}
          title={t('switchSystemNode')}
          className="h-8 px-2.5 sm:px-3 rounded-md bg-[#181d28] border border-[#2d3240] hover:border-[#00cfbf]/60 flex items-center gap-1.5 font-mono text-xs text-white hover:bg-[#00cfbf]/10 transition-all cursor-pointer shadow-sm group"
        >
          <span className="material-symbols-outlined text-[15px] text-[#00cfbf] group-hover:rotate-45 transition-transform">radar</span>
          <span className="truncate max-w-[90px] sm:max-w-[150px] font-bold text-[#e0e2ec] group-hover:text-white">
            {activeNodeLabel.startsWith('sysNode') ? t(activeNodeLabel) : activeNodeLabel}
          </span>
          <span className="material-symbols-outlined text-xs text-[#849495] group-hover:text-[#00cfbf]">unfold_more</span>
        </button>

        {/* Language Selector */}
        <button 
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          title={t('switchToLang')}
          className="px-2.5 py-1.5 h-8 rounded border border-[#3a494b] flex items-center justify-center text-[10px] font-mono font-bold text-[#e0e2ec] hover:text-white hover:bg-[#00cfbf]/15 hover:border-[#00cfbf]/50 transition-colors cursor-pointer uppercase gap-1 shadow-sm"
        >
          <span className="material-symbols-outlined text-[14px] text-[#00cfbf]">language</span>
          {t('langBadge')}
        </button>

        {/* Direct support overlay guide toggler */}
        <button 
          onClick={onOpenInfoModal}
          title="System Information"
          className="w-8 h-8 rounded border border-[#3a494b] flex items-center justify-center text-[#e0e2ec] hover:text-[#00cfbf] hover:border-[#00cfbf]/50 hover:bg-[#00cfbf]/10 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
        </button>

        {/* Notifications icon with dynamic alert counters */}
        <button 
          onClick={() => onNavigate('alerts')}
          className="w-8 h-8 rounded border border-[#3a494b] flex items-center justify-center text-[#e0e2ec] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/50 hover:bg-[#ffb4ab]/10 transition-all relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          {pendingAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ffb4ab] rounded-full animate-pulse shadow-[0_0_6px_#ffb4ab]"></span>
          )}
        </button>

        <div className="w-px h-6 bg-[#2d3240] mx-1"></div>

        {/* Operator Avatar and status bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#00cfbf]/40 overflow-hidden bg-[#1C202B] flex items-center justify-center font-mono text-xs font-bold text-[#00cfbf] shadow-[0_0_8px_rgba(0,207,191,0.2)]">
              AD
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-sans text-xs font-bold text-white">Admin_Operator</span>
              <span className="font-mono text-[9px] text-[#00cfbf] font-semibold">GRID AUTHENTICATED</span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title={t('logoutBtn')}
              className="w-8 h-8 rounded border border-[#3a494b] flex items-center justify-center text-[#849495] hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10 transition-all cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
