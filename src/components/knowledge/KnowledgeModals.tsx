import React, { useState } from 'react';
import { Doc } from '../../types';
import { useTranslation } from '../../i18n/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UploadDocDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDoc: (doc: Doc) => void;
}

export const UploadDocDialog: React.FC<UploadDocDialogProps> = ({ open, onOpenChange, onAddDoc }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<'Manual' | 'Log File' | 'Safety'>('Manual');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const newDoc: Doc = {
      id: `doc-${Date.now()}`,
      name: name.trim(),
      type,
      dateAdded: today,
      status: 'Indexed'
    };
    onAddDoc(newDoc);
    setName('');
    setContent('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141822] border border-[#2d3240] rounded-2xl max-w-lg text-[#e0e2ec] p-6 shadow-2xl">
        <DialogHeader className="border-b border-[#222630] pb-4">
          <DialogTitle className="font-sans text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00cfbf]">upload_file</span>
            {t('uploadDocTitle')}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#849495]">
            {t('uploadDocDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-mono text-[#b9cacb] mb-1.5">{t('docTitleLabel')}</label>
            <Input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. CNC Spindle High-Speed Bearing Spec v4.2"
              className="bg-[#0f121a] border-[#2e3444] text-xs text-white h-9"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#b9cacb] mb-1.5">{t('docTypeLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Manual', 'Log File', 'Safety'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setType(cat)}
                  className={`py-2 px-3 rounded-lg border text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === cat
                      ? 'bg-[#00cfbf]/20 border-[#00cfbf] text-[#00cfbf] shadow-[0_0_10px_rgba(0,207,191,0.2)]'
                      : 'bg-[#1a1f2c] border-[#2d3240] text-[#849495] hover:border-[#00cfbf]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {cat === 'Manual' ? 'auto_stories' : cat === 'Log File' ? 'article' : 'verified_user'}
                  </span>
                  {cat === 'Manual' ? t('docTypeManual') : cat === 'Log File' ? t('docTypeLogFile') : t('docTypeSafety')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#b9cacb] mb-1.5">{t('docContentLabel')}</label>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste equipment operating thresholds, error codes, or safety bounds..."
              className="w-full bg-[#0f121a] border border-[#2e3444] rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00cfbf] transition-colors"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-[#849495] hover:text-white"
            >
              {t('cancelBtn')}
            </Button>
            <Button
              type="submit"
              className="bg-[#00cfbf] text-[#0B0E14] font-bold text-xs h-9 px-5 hover:bg-[#00cfbf]/90 shadow-[0_0_12px_rgba(0,207,191,0.3)] cursor-pointer"
            >
              {t('startIngestionBtn')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DocPreviewModalProps {
  doc: Doc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocPreviewModal: React.FC<DocPreviewModalProps> = ({ doc, open, onOpenChange }) => {
  const { t } = useTranslation();

  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141822] border border-[#2d3240] rounded-2xl max-w-2xl text-[#e0e2ec] p-6 shadow-2xl">
        <DialogHeader className="border-b border-[#222630] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#00cfbf]/15 border border-[#00cfbf]/40 flex items-center justify-center text-[#00cfbf] shadow-sm">
                <span className="material-symbols-outlined text-2xl">
                  {doc.type === 'Manual' ? 'auto_stories' : doc.type === 'Log File' ? 'article' : 'verified_user'}
                </span>
              </div>
              <div>
                <DialogTitle className="font-sans text-lg font-bold text-white">
                  {doc.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="border-[#2d3240] bg-[#1a1f2c] text-[#b9cacb] font-mono text-[10px]">
                    {doc.type}
                  </Badge>
                  <span className="text-[#3a494b]">•</span>
                  <span className="font-mono text-xs text-[#849495]">Ingested: {doc.dateAdded}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-[#0e1119] border border-[#222630] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#222630] pb-2 font-mono text-xs text-[#00cfbf] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">radar</span>
                {t('vecEmbedStatus')}
              </span>
              <span className="text-[#667475]">--</span>
            </div>

            <div className="text-xs font-mono">
              <span className="text-[#849495] block">{t('cosineSimLabel')}</span>
              <span className="text-[#667475]">--</span>
            </div>
            <div className="text-xs font-mono">
              <span className="text-[#849495] block">{t('diagUsageLabel')}</span>
              <span className="text-[#00cfbf] font-bold">{doc.status || 'Indexed'}</span>
            </div>
          </div>

          <div className="bg-[#1b202e] border border-[#2d3240] rounded-xl p-4 space-y-2">
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffba43] text-[16px]">menu_book</span>
              {t('aiExcerptTitle')}
            </h4>
            <div className="font-mono text-xs text-[#d1d5db] leading-relaxed bg-[#0e1119] p-3 rounded-lg border border-[#222630]">
              <p className="text-[#667475] italic">
                {t('aiExcerptContent')}
              </p>
              <p className="text-[#667475] text-[10px] mt-2 border-t border-[#222630] pt-2">
                — Mock content: actual document excerpt unavailable in memory-only mode.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[#222630] pt-4 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#00cfbf] text-[#0B0E14] font-bold text-xs h-9 px-5 hover:bg-[#00cfbf]/90 cursor-pointer"
          >
            {t('previewClose')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
