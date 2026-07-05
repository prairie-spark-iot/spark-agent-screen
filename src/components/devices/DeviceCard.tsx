import React from 'react';
import { Device } from '../../types';
import { useTranslation } from '../../i18n/context';
import { Badge } from '@/components/ui/badge';

interface DeviceCardProps {
  dev: Device;
  onSelect?: (dev: Device) => void;
}

export const DeviceCard = React.memo(function DeviceCard({ dev, onSelect }: DeviceCardProps) {
  const { t } = useTranslation();

  // Helper to dynamically map icon string to a material symbols icon name
  const getIconName = (icon: string) => {
    switch (icon) {
      case 'precision_manufacturing': return 'precision_manufacturing';
      case 'water_damage': return 'water_damage';
      case 'conveyor_belt': return 'conveyor_belt';
      case 'wind_power': return 'wind_power';
      case 'electrical_services': return 'electrical_services';
      default: return 'precision_manufacturing';
    }
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(dev)}
      className={`rounded-lg border p-5 flex flex-col justify-between hover:bg-[#1b202e] transition-all duration-300 relative overflow-hidden bg-[#141822] shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer group ${
        dev.status === 'OFFLINE' ? 'opacity-65 border-[#222630] hover:border-[#323746]' :
        dev.status === 'WARNING' ? 'border-[#ffba43]/35 hover:border-[#ffba43]/70 hover:shadow-[0_0_15px_rgba(255,186,67,0.15)]' :
        'border-[#2d3240] hover:border-[#00cfbf]/50 hover:shadow-[0_0_15px_rgba(0,207,191,0.12)]'
      }`}
    >
      {/* Status gradient background layer */}
      {dev.status === 'ONLINE' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cfbf]/10 rounded-bl-full blur-2xl pointer-events-none"></div>
      )}
      {dev.status === 'WARNING' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffba43]/10 rounded-bl-full blur-2xl pointer-events-none"></div>
      )}

      <div className="z-10 flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded border flex items-center justify-center transition-colors bg-[#1f2433] group-hover:scale-105 ${
            dev.status === 'ONLINE' ? 'border-[#00cfbf]/50 text-[#00cfbf] shadow-[0_0_10px_rgba(0,207,191,0.25)]' :
            dev.status === 'WARNING' ? 'border-[#ffba43]/50 text-[#ffba43] animate-pulse shadow-[0_0_10px_rgba(255,186,67,0.25)]' :
            'border-[#3a494b]/40 text-[#b9cacb]/55'
          }`}>
            <span className="material-symbols-outlined font-semibold text-xl">
              {getIconName(dev.icon)}
            </span>
          </div>
          <div>
            <h3 className="font-sans text-sm font-bold text-white tracking-wide group-hover:text-[#00cfbf] transition-colors">{dev.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[#00cfbf]">location_on</span>
              <span className="font-sans text-xs text-[#d1d5db] font-medium">{dev.location}</span>
            </div>
          </div>
        </div>

        {/* Status pill badge */}
        <Badge 
          variant="outline"
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold tracking-wide h-5 shadow-sm ${
            dev.status === 'ONLINE' ? 'bg-[#00cfbf]/15 border-[#00cfbf]/40 text-[#00cfbf] hover:bg-[#00cfbf]/25' :
            dev.status === 'WARNING' ? 'bg-[#ffba43]/20 border-[#ffba43]/45 text-[#ffba43] hover:bg-[#ffba43]/30' :
            'bg-[#222630] border-[#3a494b] text-[#e0e2ec] hover:bg-[#2c313d]'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            dev.status === 'ONLINE' ? 'bg-[#00cfbf] shadow-[0_0_8px_#00cfbf]' :
            dev.status === 'WARNING' ? 'bg-[#ffba43] shadow-[0_0_8px_#ffba43] animate-pulse' :
            'bg-[#849495]'
          }`}></div>
          <span>
            {dev.status === 'ONLINE' ? t('ONLINE') : dev.status === 'WARNING' ? t('WARNING') : t('OFFLINE')}
          </span>
        </Badge>
      </div>

      {/* Sparkline & Values row */}
      <div className="z-10 border-t border-[#2d3240] pt-4 mt-2 grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-wider text-[#d1d5db] uppercase mb-1">
            {dev.metricName}
          </p>
          <p className={`font-mono text-xl font-bold flex items-baseline gap-0.5 ${
            dev.status === 'WARNING' ? 'text-[#ffba43]' : 'text-white'
          }`}>
            {dev.value}
            {dev.unit && <span className="text-xs text-[#d1d5db] font-normal ml-0.5">{dev.unit}</span>}
          </p>
        </div>

        {/* Inline vector sparkline */}
        <div className="flex flex-col justify-end h-10 w-full">
          {dev.status === 'OFFLINE' ? (
            <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,28 L100,28" fill="none" stroke="#3a494b" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke"></path>
            </svg>
          ) : (
            <svg className="w-full h-8 filter drop-shadow-[0_0_3px_rgba(0,207,191,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path 
                d={`M0,${25 - (dev.sparkline[0] % 10)} L12.5,${25 - (dev.sparkline[1] % 10)} L25,${25 - (dev.sparkline[2] % 10)} L37.5,${25 - (dev.sparkline[3] % 10)} L50,${25 - (dev.sparkline[4] % 10)} L62.5,${25 - (dev.sparkline[5] % 10)} L75,${25 - (dev.sparkline[6] % 10)} L87.5,${25 - (dev.sparkline[7] % 10)} L100,${25 - (dev.sparkline[8] % 10)}`}
                fill="none" 
                stroke={dev.status === 'WARNING' ? '#ffba43' : '#00cfbf'} 
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.dev.id === nextProps.dev.id &&
    prevProps.dev.value === nextProps.dev.value &&
    prevProps.dev.status === nextProps.dev.status &&
    prevProps.dev.sparkline[prevProps.dev.sparkline.length - 1] === nextProps.dev.sparkline[nextProps.dev.sparkline.length - 1] &&
    prevProps.onSelect === nextProps.onSelect
  );
});
