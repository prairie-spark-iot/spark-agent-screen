import React from 'react';
import { useTranslation } from '../../i18n/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SystemInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161a25] border border-[#2e3444] max-w-[95vw] sm:max-w-lg text-[#d1d5db] p-6 shadow-2xl rounded-xl">
        <DialogHeader className="border-b border-[#2e3444] pb-4">
          <DialogTitle className="flex items-center gap-2 text-white font-bold font-sans text-base">
            <span className="material-symbols-outlined text-[#00cfbf]">info</span>
            {t('controlArchitecture')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-xs leading-relaxed mt-2 text-[#e2e8f0]">
          <p>
            <strong className="text-white">{t('appName')}</strong> {t('appDescription')}
          </p>
          
          <div className="bg-[#0f121a] border border-[#2e3444] rounded-lg p-3 space-y-2">
            <div className="flex justify-between border-b border-[#2e3444] pb-1.5 font-mono text-[10px] text-[#b9cacb] font-bold">
              <span>{t('component')}</span>
              <span>{t('specification')}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#d1d5db]">{t('serverInterface')}</span>
              <span className="text-white font-bold">Express + Node.js (Port 3000)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#d1d5db]">{t('viteProxyPipeline')}</span>
              <span className="text-white font-bold">Active (Asset Compilation)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#d1d5db]">{t('diagnosticCore')}</span>
              <span className="text-[#00cfbf] font-extrabold">Gemini 3.5 Flash Model</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#d1d5db]">{t('knowledgeParsing')}</span>
              <span className="text-[#ffba43] font-bold">{t('manualRefIngestion')}</span>
            </div>
          </div>

          <p className="text-[#d1d5db]">
            {t('controlArchDetails')}
          </p>
        </div>

        <DialogFooter className="pt-4 border-t border-[#2e3444] flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-[#00cfbf] text-[#00363a] font-extrabold text-xs hover:bg-[#00cfbf]/90 transition-colors rounded-md h-9 shadow-sm cursor-pointer"
          >
            {t('acknowledgeProtocol')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
