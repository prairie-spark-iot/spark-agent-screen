import React from 'react';
import { Card } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string | number;
  indicatorText?: string;
  indicatorColor?: string;
  iconName: string;
  iconColorClass?: string;
  iconFill?: boolean;
  progressPercentage?: number;
  progressColorClass?: string;
}

export const KpiCard = React.memo(function KpiCard({
  title,
  value,
  subValue,
  indicatorText,
  indicatorColor,
  iconName,
  iconColorClass = 'text-[#00cfbf]',
  iconFill = false,
  progressPercentage,
  progressColorClass = 'bg-[#00cfbf]'
}: KpiCardProps) {
  return (
    <Card className="bg-[#141822] border-[#2d3240] text-card-foreground p-5 flex flex-col gap-2 shadow-sm rounded-lg transition-all hover:border-[#00cfbf]/40 hover:bg-[#1b202e] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-start">
        <h3 className="font-sans text-xs text-white/90 font-bold uppercase tracking-wider">{title}</h3>
        <span className={`material-symbols-outlined ${iconColorClass} text-[24px] font-semibold ${iconFill ? 'icon-fill' : ''}`}>
          {iconName}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-[#ffebd8]">{value}</span>
        {subValue && <span className="font-mono text-sm text-[#e0e2ec] font-semibold">{subValue}</span>}
      </div>
      
      {progressPercentage !== undefined ? (
        <div className="w-full bg-[#1d2027] h-1.5 mt-2 rounded-full overflow-hidden border border-[#2d3240]">
          <div 
            className={`${progressColorClass} h-full transition-all duration-500 glow-cyan`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      ) : indicatorText ? (
        <div className="flex items-center gap-1.5 mt-1">
          <span 
            className="w-2 h-2 rounded-full animate-pulse shadow-sm" 
            style={{ backgroundColor: indicatorColor || '#00cfbf' }}
          ></span>
          <span className="font-sans text-xs font-semibold" style={{ color: indicatorColor || '#e0e2ec' }}>
            {indicatorText}
          </span>
        </div>
      ) : null}
    </Card>
  );
});
