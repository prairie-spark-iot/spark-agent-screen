import React, { useState } from 'react';
import { Doc } from '../types';
import { useTranslation } from '../i18n/context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FeaturedDocBanner } from './knowledge/FeaturedDocBanner';
import { CategoryCards } from './knowledge/CategoryCards';
import { UploadDocDialog, DocPreviewModal } from './knowledge/KnowledgeModals';

interface KnowledgeBaseViewProps {
  documents: Doc[];
  onAddDoc?: (doc: Doc) => void;
}

export default function KnowledgeBaseView({ documents, onAddDoc }: KnowledgeBaseViewProps) {
  const { t, language } = useTranslation();
  const [kbSearch, setKbSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  const getTranslatedType = React.useCallback((type: string) => {
    if (type === 'Manual') return t('docTypeManual');
    if (type === 'Log File') return t('docTypeLogFile');
    if (type === 'Safety') return t('docTypeSafety');
    return type;
  }, [t]);

  const filteredDocs = React.useMemo(() => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(kbSearch.toLowerCase()) ||
      doc.type.toLowerCase().includes(kbSearch.toLowerCase()) ||
      getTranslatedType(doc.type).toLowerCase().includes(kbSearch.toLowerCase())
    );
  }, [documents, kbSearch, getTranslatedType]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-end border-b border-[#2d3240] pb-4">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">{t('knowledgeBase')}</h1>
          <p className="font-sans text-xs text-[#d1d5db] font-medium mt-1">
            {t('kbSubtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          {/* KB Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#d1d5db]">search</span>
            <Input 
              value={kbSearch}
              onChange={(e) => setKbSearch(e.target.value)}
              className="bg-[#141822] border-[#2d3240] focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf] text-xs font-sans py-1.5 pl-9 pr-3 w-52 text-white transition-all placeholder:text-[#d1d5db]/40 h-8 rounded-md" 
              placeholder={t('searchDocsPlaceholder')} 
              type="text"
            />
          </div>

          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-[#00cfbf] text-[#0B0E14] font-sans text-xs font-extrabold px-3.5 py-1.5 h-8 rounded-md flex items-center gap-1.5 hover:bg-[#00cfbf]/90 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,207,191,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">upload_file</span> 
            {t('uploadManual')}
          </Button>
        </div>
      </div>

      {/* Featured Banner */}
      <FeaturedDocBanner />

      {/* Category Grid with real document count */}
      <CategoryCards totalDocs={documents.length} />

      {/* Table listing technical documents */}
      <div className="bg-[#141822] border border-[#2d3240] rounded-xl overflow-hidden shadow-md flex flex-col">
        <Table className="w-full text-left border-collapse whitespace-nowrap text-xs border-0">
          <TableHeader className="bg-[#1a1f2c] border-b border-[#2d3240] hover:bg-transparent">
            <TableRow className="font-mono text-[10px] font-bold tracking-wider text-white/90 uppercase border-b-0 hover:bg-transparent">
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('manualName')}</TableHead>
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('documentType')}</TableHead>
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('dateUploaded')}</TableHead>
              <TableHead className="px-5 py-3 h-auto border-b-0 text-[#e2e8f0]">{t('vectorEmbedding')}</TableHead>
              <TableHead className="px-5 py-3 w-12 h-auto border-b-0"></TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-[#2d3240] border-0">
            {filteredDocs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="px-5 py-8 text-center text-[#d1d5db]/50 font-sans border-0">
                  {t('noDocsMatched')}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:bg-[#1d2334] transition-colors group border-[#2d3240] cursor-pointer"
                >
                  <TableCell className="px-5 py-4 font-sans text-white font-bold flex items-center gap-2.5 border-0">
                    <div className="w-7 h-7 rounded bg-[#00cfbf]/15 border border-[#00cfbf]/35 flex items-center justify-center text-[#00cfbf]">
                      <span className="material-symbols-outlined text-[16px]">
                        {doc.type === 'Manual' ? 'auto_stories' : doc.type === 'Log File' ? 'article' : 'verified_user'}
                      </span>
                    </div>
                    <span>{doc.name}</span>
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 font-mono text-[#d1d5db] font-semibold border-0">{getTranslatedType(doc.type)}</TableCell>
                  
                  <TableCell className="px-5 py-4 font-mono text-[#d1d5db] font-semibold border-0">{doc.dateAdded}</TableCell>
                  
                  <TableCell className="px-5 py-4 border-0">
                    {doc.status ? (
                      <Badge variant="outline" className="inline-flex items-center gap-1 text-[#00cfbf] bg-[#00cfbf]/15 px-2.5 py-0.5 rounded border border-[#00cfbf]/40 font-sans font-bold text-[10px] h-5 shadow-[0_0_8px_rgba(0,207,191,0.2)]">
                        <span className="material-symbols-outlined text-[12px] font-bold text-[#00cfbf]">check_circle</span>
                        <span>{doc.status === 'Used in AI Diagnosis' ? t('docStatusUsedInAI') : doc.status}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="inline-flex items-center gap-1 text-[#d1d5db] bg-[#1e2433] px-2.5 py-0.5 rounded border border-[#2d3240] font-sans font-bold text-[10px] h-5">
                        <span className="w-1.5 h-1.5 bg-[#00cfbf] rounded-full animate-pulse"></span>
                        <span>{t('docStatusIndexed')}</span>
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 text-right border-0">
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className="text-[#d1d5db] hover:text-[#00cfbf] hover:bg-white/5 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UploadDocDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        onAddDoc={(newDoc) => {
          if (onAddDoc) onAddDoc(newDoc);
        }}
      />

      <DocPreviewModal
        doc={selectedDoc}
        open={Boolean(selectedDoc)}
        onOpenChange={(open) => {
          if (!open) setSelectedDoc(null);
        }}
      />
    </div>
  );
}
