import React from 'react';
import { useTranslation } from '../../i18n/context';

export const CategoryCards = React.memo(function CategoryCards() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col gap-2.5 hover:bg-[#1a1f2c] hover:border-[#00cfbf]/50 transition-all cursor-pointer group shadow-md">
        <div className="w-10 h-10 rounded-lg bg-[#00cfbf]/15 border border-[#00cfbf]/30 flex items-center justify-center text-[#00cfbf]">
          <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">menu_book</span>
        </div>
        <h4 className="font-sans text-sm font-bold text-white mt-1">{t('equipmentManuals')}</h4>
        <p className="font-sans text-xs text-[#d1d5db] font-medium leading-relaxed">
          {t('equipmentManualsDesc')}
        </p>
      </div>

      <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col gap-2.5 hover:bg-[#1a1f2c] hover:border-[#ffb4ab]/50 transition-all cursor-pointer group shadow-md">
        <div className="w-10 h-10 rounded-lg bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab]">
          <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">gavel</span>
        </div>
        <h4 className="font-sans text-sm font-bold text-white mt-1">{t('safetyProtocols')}</h4>
        <p className="font-sans text-xs text-[#d1d5db] font-medium leading-relaxed">
          {t('safetyProtocolsDesc')}
        </p>
      </div>

      <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col gap-2.5 hover:bg-[#1a1f2c] hover:border-[#ffba43]/50 transition-all cursor-pointer group shadow-md">
        <div className="w-10 h-10 rounded-lg bg-[#ffba43]/15 border border-[#ffba43]/30 flex items-center justify-center text-[#ffba43]">
          <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">history</span>
        </div>
        <h4 className="font-sans text-sm font-bold text-white mt-1">{t('maintenanceLogs')}</h4>
        <p className="font-sans text-xs text-[#d1d5db] font-medium leading-relaxed">
          {t('maintenanceLogsDesc')}
        </p>
      </div>

      <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col gap-2.5 hover:bg-[#1a1f2c] hover:border-[#00cfbf]/50 transition-all cursor-pointer group shadow-md">
        <div className="w-10 h-10 rounded-lg bg-[#00cfbf]/15 border border-[#00cfbf]/30 flex items-center justify-center text-[#00cfbf]">
          <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">build</span>
        </div>
        <h4 className="font-sans text-sm font-bold text-white mt-1">{t('troubleshootingGuides')}</h4>
        <p className="font-sans text-xs text-[#d1d5db] font-medium leading-relaxed">
          {t('troubleshootingGuidesDesc')}
        </p>
      </div>
    </div>
  );
});
