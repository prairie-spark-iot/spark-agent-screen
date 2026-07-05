import React from 'react';
import { useTranslation } from '../../i18n/context';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface TimelineStep {
  title: string;
  description: string;
  metrics?: { label: string; value: string; status?: 'normal' | 'error' | 'warning' }[];
  docs?: string[];
}

interface DiagnosisTimelineProps {
  timeline: TimelineStep[];
}

export const DiagnosisTimeline = React.memo(function DiagnosisTimeline({
  timeline
}: DiagnosisTimelineProps) {
  const { t } = useTranslation();

  return (
    <div className="relative border-l border-[#2d3240] ml-3 pl-6 space-y-6">
      {timeline.map((step, idx) => (
        <div key={idx} className="relative">
          {/* Circle indicator */}
          <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#141822] border-2 border-[#00cfbf] flex items-center justify-center shadow-[0_0_8px_rgba(0,207,191,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00cfbf]"></span>
          </span>

          <div className="space-y-2">
            <h4 className="font-sans text-sm font-bold text-white">{step.title}</h4>
            <p className="text-[#e2e8f0] text-xs leading-relaxed font-medium">{step.description}</p>

            {/* Optional step telemetry table */}
            {step.metrics && step.metrics.length > 0 && (
              <div className="bg-[#0f121a] border border-[#2d3240] rounded-md p-3 max-w-md mt-2 shadow-inner">
                <Table className="w-full text-left font-mono text-xs border-none">
                  <TableHeader className="border-b border-[#2d3240]">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="pb-1.5 h-auto text-[#d1d5db] font-bold p-0">{t('metricAnalyzed')}</TableHead>
                      <TableHead className="pb-1.5 h-auto text-right text-[#d1d5db] font-bold p-0">{t('value')}</TableHead>
                      <TableHead className="pb-1.5 h-auto text-right text-[#d1d5db] font-bold p-0">{t('status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-[#2d3240]/60 text-white">
                    {step.metrics.map((m, mIdx) => (
                      <TableRow key={mIdx} className="border-none hover:bg-white/5">
                        <TableCell className="py-1.5 p-0 text-[#e2e8f0] font-medium">{m.label}</TableCell>
                        <TableCell className="py-1.5 p-0 text-right font-bold text-white">{m.value}</TableCell>
                        <TableCell className="py-1.5 p-0 text-right">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            m.status === 'error' ? 'bg-[#ffb4ab] glow-red' :
                            m.status === 'warning' ? 'bg-[#ffba43]' : 'bg-[#00cfbf]'
                          }`}></span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Optional step attachments docs */}
            {step.docs && step.docs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {step.docs.map((doc, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-1.5 bg-[#1e2433] border border-[#2d3240] rounded px-2.5 py-1 text-[11px] font-mono font-bold text-[#e2e8f0] shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-[#00cfbf]">description</span>
                    {doc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
