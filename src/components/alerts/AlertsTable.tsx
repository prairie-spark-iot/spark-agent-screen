import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type PaginationState,
} from '@tanstack/react-table';
import { Alert } from '../../types';
import { useTranslation } from '../../i18n/context';
import { localizeAlert } from '@/lib/alertI18n';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AlertsTableProps {
  alerts: Alert[];
  filteredAlerts: Alert[];
  totalFilteredCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNavigate: (tab: string, arg?: string) => void;
  onDiagnose: (alertId: string) => void;
}

const columnHelper = createColumnHelper<Alert>();

const deviceIconFor = (icon?: string) => {
  if (icon === 'router') return 'router';
  if (icon === 'dns') return 'dns';
  if (icon === 'security') return 'security';
  if (icon === 'water_damage') return 'water_damage';
  return 'precision_manufacturing';
};

function getHeaderCellClassName(columnId: string): string {
  switch (columnId) {
    case 'index': return 'px-3 py-3 w-10 h-auto border-b-0 text-[#849495] text-center';
    case 'time': return 'px-5 py-3 w-28 h-auto border-b-0 text-[#e2e8f0]';
    case 'triggerValue': return 'px-5 py-3 text-right w-32 h-auto border-b-0 text-[#e2e8f0]';
    case 'severity': return 'px-5 py-3 w-28 h-auto border-b-0 text-[#e2e8f0]';
    case 'status': return 'px-5 py-3 w-40 h-auto border-b-0 text-[#e2e8f0]';
    case 'actions': return 'px-5 py-3 w-12 h-auto border-b-0';
    default: return 'px-5 py-3 h-auto border-b-0 text-[#e2e8f0]';
  }
}

function getBodyCellClassName(columnId: string, alert: Alert): string {
  switch (columnId) {
    case 'index':
      return 'px-3 py-4 font-mono text-[#849495] text-center border-0 text-[11px] tabular-nums';
    case 'time':
      return 'px-5 py-4 font-mono text-[#d1d5db] border-0';
    case 'device':
      return 'px-5 py-4 font-mono text-white border-0';
    case 'metric':
      return 'px-5 py-4 font-sans text-white font-medium border-0';
    case 'triggerValue':
      return `px-5 py-4 font-mono text-right font-semibold border-0 ${
        alert.severity === 'Critical' ? 'text-[#ffb4ab]' :
        alert.severity === 'Warning' ? 'text-[#ffba43]' : 'text-secondary'
      }`;
    case 'actions':
      return 'px-5 py-4 text-right border-0';
    default:
      return 'px-5 py-4 border-0';
  }
}

export const AlertsTable = React.memo(function AlertsTable({
  filteredAlerts,
  totalFilteredCount,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onNavigate,
  onDiagnose
}: AlertsTableProps) {
  const { t, language } = useTranslation();

  const localizedAlerts = React.useMemo(
    () => filteredAlerts.map(a => localizeAlert(a, language)),
    [filteredAlerts, language]
  );

  const columns = React.useMemo(() => [
    columnHelper.display({
      id: 'index',
      header: '#',
      cell: (ctx) => ctx.row.index + 1,
    }),
    columnHelper.accessor('time', {
      id: 'time',
      header: t('timeUtc'),
    }),
    columnHelper.display({
      id: 'device',
      header: t('deviceEntity'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b9cacb] text-[18px]">
            {deviceIconFor(row.original.icon)}
          </span>
          <span>{row.original.device}</span>
        </div>
      ),
    }),
    columnHelper.accessor('metric', {
      id: 'metric',
      header: t('metric'),
    }),
    columnHelper.accessor('triggerValue', {
      id: 'triggerValue',
      header: t('triggerValue'),
    }),
    columnHelper.display({
      id: 'severity',
      header: t('severity'),
      cell: ({ row }) => {
        const alert = row.original;
        return (
          <Badge
            variant="outline"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium font-sans h-5 ${
              alert.severity === 'Critical' ? 'bg-[#ffb4ab]/15 border-[#ffb4ab]/40 text-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.3)] hover:bg-[#ffb4ab]/25' :
              alert.severity === 'Warning' ? 'bg-[#ffba43]/10 border-[#ffba43]/30 text-[#ffba43] hover:bg-[#ffba43]/15' :
              'bg-[#00cfbf]/15 border-[#00cfbf]/40 text-[#00cfbf] hover:bg-[#00cfbf]/25'
            }`}
          >
            <span className={`w-1 h-1 rounded-full ${
              alert.severity === 'Critical' ? 'bg-[#ffb4ab]' :
              alert.severity === 'Warning' ? 'bg-[#ffba43]' : 'bg-[#00cfbf]'
            }`}></span>
            {alert.severity === 'Critical' ? t('Critical') :
             alert.severity === 'Warning' ? t('Warning') : t('Info')}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'status',
      header: t('diagnosisStatus'),
      cell: ({ row }) => {
        const alert = row.original;
        return (
          <>
            {alert.status === 'Diagnosed' && (
              <Badge variant="outline" className="inline-flex items-center gap-1.5 text-[#00cfbf] bg-[#00cfbf]/15 px-2.5 py-1 rounded border border-[#00cfbf]/40 font-sans font-semibold text-[10px] h-6 shadow-[0_0_8px_rgba(0,207,191,0.2)]">
                <span className="material-symbols-outlined text-[#00cfbf] text-[14px]">check_circle</span>
                <span>{t('aiDiagnosed')}</span>
              </Badge>
            )}
            {alert.status === 'Diagnosing' && (
              <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-[#ffba43] bg-[#ffba43]/10 px-2.5 py-1 rounded border border-[#ffba43]/20 font-sans font-semibold text-[10px] h-6">
                <span className="material-symbols-outlined text-[14px] spin-slow">progress_activity</span>
                <span>{t('diagnosing')}</span>
              </Badge>
            )}
            {alert.status === 'Pending' && (
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDiagnose(alert.id);
                }}
                className="inline-flex items-center gap-1.5 text-[#b9cacb] hover:text-white bg-[#32353c]/30 hover:bg-[#32353c]/60 px-2 h-6 border border-[#849495]/20 font-sans font-semibold transition-colors cursor-pointer rounded-md text-[10px]"
              >
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>{t('diagnoseAnomaly')}</span>
              </Button>
            )}
          </>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: () => (
        <Button variant="ghost" size="icon-sm" className="text-[#b9cacb] hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined">more_vert</span>
        </Button>
      ),
    }),
  ], [t, onDiagnose]);

  const pagination = React.useMemo<PaginationState>(() => ({
    pageIndex: page - 1,
    pageSize,
  }), [page, pageSize]);

  const table = useReactTable({
    data: localizedAlerts,
    columns,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;
      onPageChange(next.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageRows = table.getRowModel().rows;

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl overflow-hidden shadow-md flex flex-col">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse whitespace-nowrap text-xs border-0">
          <TableHeader className="bg-[#1a1f2c] border-b border-[#2d3240] hover:bg-transparent">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="font-mono text-[9px] font-bold tracking-wider text-white/90 uppercase border-b-0 hover:bg-transparent">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className={getHeaderCellClassName(header.column.id)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-[#2d3240] border-0">
            {filteredAlerts.length === 0 || pageRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-8 text-center text-[#d1d5db]/50 font-sans border-0">
                  {t('noAlertsFound')}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {pageRows.map(row => (
                  <TableRow
                    key={row.id}
                    onClick={() => onNavigate('diagnosis-detail', row.original.id)}
                    className="hover:bg-[#1d2334] transition-colors group cursor-pointer border-[#2d3240]"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className={getBodyCellClassName(cell.column.id, row.original)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Spacer rows to fill page */}
                {pageRows.length < pageSize && (
                  Array.from({ length: pageSize - pageRows.length }, (_, i) => (
                    <TableRow key={`spacer-${i}`} className="hover:bg-transparent cursor-default">
                      <TableCell colSpan={columns.length} className="px-5 py-4 border-0">&nbsp;</TableCell>
                    </TableRow>
                  ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#222630] flex items-center justify-between bg-[#191c23] text-xs">
        <p className="text-[#b9cacb]">
          {t('showing')}{' '}
          <span className="text-white font-mono">{pageRows.length}</span>{' '}
          {t('ofTotal')}{' '}
          <span className="text-white font-mono">{totalFilteredCount}</span>{' '}
          {t('alertsCount')}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded text-[#b9cacb] hover:bg-[#32353c] hover:text-white transition-colors disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-1 font-mono">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                  n === page
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'text-[#b9cacb] hover:bg-[#32353c]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            className="p-1 rounded text-[#b9cacb] hover:bg-[#32353c] hover:text-white transition-colors disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
});
