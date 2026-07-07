import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../i18n/context';

export interface TelemetryPoint {
  time: string;
  temp: number;
  press: number;
  current: number;
  speed: number;
  humidity: number;
}

/** Chart metric config keyed by dataKey — labelKey maps to TELEMETRY_LABELS in deviceAdapter. */
export const METRICS_CONFIG: Record<string, { labelKey: string; color: string; unit: string }> = {
  temp: { labelKey: 'temperature', color: '#00cfbf', unit: '°C' },
  press: { labelKey: 'pressure', color: '#ffba43', unit: 'kPa' },
  current: { labelKey: 'current', color: '#64b5f6', unit: 'A' },
  speed: { labelKey: 'speed', color: '#ce93d8', unit: 'rpm' },
  humidity: { labelKey: 'humidity', color: '#81c784', unit: '%' },
};

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

export const TelemetryChart = React.memo(function TelemetryChart({ data }: TelemetryChartProps) {
  const { t } = useTranslation();

  const activeMetrics = data.length > 0
    ? (Object.keys(METRICS_CONFIG) as (keyof typeof METRICS_CONFIG)[]).filter(k => k in data[0])
    : [];

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col h-96 relative overflow-hidden transition-all hover:border-[#00cfbf]/40 shadow-md">
      <div className="flex justify-between items-center pb-4 border-b border-[#2d3240] mb-4 z-10">
        <div>
          <h3 className="font-sans text-base font-bold text-white tracking-wide">{t('liveTelemetry')}</h3>
        </div>
        <div className="flex gap-5 flex-wrap">
          {activeMetrics.map(key => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-3.5 h-1.5 rounded-full"
                style={{ backgroundColor: METRICS_CONFIG[key].color, boxShadow: `0 0 8px ${METRICS_CONFIG[key].color}80` }}
              ></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {t(METRICS_CONFIG[key].labelKey)} ({METRICS_CONFIG[key].unit})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Recharts Line Graph */}
      <div className="flex-1 w-full h-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {activeMetrics.map(key => (
                <linearGradient key={key} id={`color${key.charAt(0).toUpperCase()}${key.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={METRICS_CONFIG[key].color} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={METRICS_CONFIG[key].color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3240" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#d1d5db" 
              tickLine={false} 
              axisLine={{ stroke: '#2d3240' }}
              tick={{ fill: '#d1d5db', fontFamily: 'JetBrains Mono', fontSize: 11 }} 
            />
            <YAxis 
              stroke="#d1d5db" 
              tickLine={false} 
              axisLine={{ stroke: '#2d3240' }}
              tick={{ fill: '#d1d5db', fontFamily: 'JetBrains Mono', fontSize: 11 }}
              tickFormatter={(v: number) => v % 1 === 0 ? `${v}` : v.toFixed(1)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1f2c', 
                borderColor: '#00cfbf', 
                borderRadius: '8px', 
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              formatter={(value: number, name: string) => {
                // Recharts passes dataKey as name — check against known keys
                if (name === 'temp' || name === 'current' || name === 'speed' || name === 'humidity') return [value.toFixed(1), name];
                if (name === 'press') return [value.toFixed(2), name];
                return [value, name];
              }}
            />
            {activeMetrics.map(key => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={t(METRICS_CONFIG[key].labelKey)}
                stroke={METRICS_CONFIG[key].color}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#color${key.charAt(0).toUpperCase()}${key.slice(1)})`}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
