import React from 'react';
import { useTranslation } from '../../i18n/context';
import { Button } from '@/components/ui/button';

export const FeaturedDocBanner = React.memo(function FeaturedDocBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-[#ffba43]/40 shadow-md">
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#ffba43]/10 rounded-bl-full blur-2xl pointer-events-none"></div>
      <div className="space-y-2 z-10">
        <div className="flex items-center gap-1.5 bg-[#ffba43]/20 text-[#ffba43] px-2.5 py-0.5 rounded border border-[#ffba43]/40 w-fit shadow-sm">
          <span className="material-symbols-outlined text-[14px] icon-fill">star</span>
          <span className="font-mono text-[10px] font-extrabold tracking-wide uppercase">{t('featuredDocument')}</span>
        </div>
        <h3 className="font-sans text-base font-bold text-white tracking-wide">{t('systemWideOptimization')}</h3>
        <p className="text-[#e2e8f0] text-xs max-w-xl font-medium leading-relaxed">
          {t('systemWideOptimizationDesc')}
        </p>
      </div>
      <div className="flex items-center gap-3 z-10">
        <span className="font-mono text-xs font-semibold text-[#d1d5db]">
          {t('updated2HrsAgo')}
        </span>
        <Button variant="outline" className="h-8 bg-[#1e2433] hover:bg-[#272f44] border-[#2d3240] text-white font-sans text-xs font-bold px-3.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <span className="material-symbols-outlined text-[16px]">download</span>
          {t('downloadPdf')}
        </Button>
      </div>
    </div>
  );
});
