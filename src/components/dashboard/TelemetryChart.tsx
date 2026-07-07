import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../i18n/context';

export interface TelemetryPoint {
  time: string;
  temp: number;
  press: number;
}

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

export const TelemetryChart = React.memo(function TelemetryChart({ data }: TelemetryChartProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-5 flex flex-col h-96 relative overflow-hidden transition-all hover:border-[#00cfbf]/40 shadow-md">
      <div className="flex justify-between items-center pb-4 border-b border-[#2d3240] mb-4 z-10">
        <div>
          <h3 className="font-sans text-base font-bold text-white tracking-wide">{t('liveTelemetry')}</h3>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-[#00cfbf] rounded-full shadow-[0_0_8px_rgba(0,207,191,0.5)]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">{t('temperature')} (°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-[#ffba43] rounded-full shadow-[0_0_8px_rgba(255,186,67,0.5)]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ffebd8]">{t('pressure')} (kPa)</span>
          </div>
        </div>
      </div>

      {/* Interactive Recharts Line Graph */}
      <div className="flex-1 w-full h-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00cfbf" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#00cfbf" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffba43" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#ffba43" stopOpacity={0}/>
              </linearGradient>
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
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              name={t('temperature')}
              stroke="#00cfbf" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              dot={false}
            />
            <Area 
              type="monotone" 
              dataKey="press" 
              name={t('pressure')}
              stroke="#ffba43" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorPress)" 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
