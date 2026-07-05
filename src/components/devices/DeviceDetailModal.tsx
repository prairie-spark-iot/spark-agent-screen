import React, { useState, useEffect } from 'react';
import { Device } from '../../types';
import { useTranslation } from '../../i18n/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DeviceDetailModalProps {
  dev: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus?: (deviceId: string, newStatus: 'ONLINE' | 'OFFLINE' | 'WARNING') => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  dev,
  open,
  onOpenChange,
  onUpdateStatus
}) => {
  const { t, language } = useTranslation();
  const [actionState, setActionState] = useState<'idle' | 'pinging' | 'rebooting'>('idle');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [liveSparkline, setLiveSparkline] = useState<number[]>([]);
  const [lastCommandLog, setLastCommandLog] = useState<string>('');

  useEffect(() => {
    if (dev) {
      setLiveSparkline([...dev.sparkline, dev.sparkline[dev.sparkline.length - 1] || 15]);
      setPingLatency(12);
      setActionState('idle');
      setLastCommandLog(`${t('cmdSysReady')}${dev.id}`);
    }
  }, [dev, open, language]);

  // Simulate real-time stream fluctuation while modal is open
  useEffect(() => {
    if (!open || !dev || dev.status === 'OFFLINE') return;
    const interval = setInterval(() => {
      setLiveSparkline(prev => {
        const last = prev[prev.length - 1] || 20;
        const delta = (Math.random() - 0.48) * 3;
        const next = Math.max(5, Math.min(95, parseFloat((last + delta).toFixed(1))));
        return [...prev.slice(1), next];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [open, dev]);

  if (!dev) return null;

  const handlePing = () => {
    setActionState('pinging');
    setLastCommandLog(t('cmdPingDispatch'));
    setTimeout(() => {
      setActionState('idle');
      const rtt = Math.floor(Math.random() * 8) + 5;
      setPingLatency(rtt);
      setLastCommandLog(`${t('cmdPingOk')}${rtt}${t('pingLossZero')}`);
    }, 800);
  };

  const handleReboot = () => {
    setActionState('rebooting');
    setLastCommandLog(t('cmdRebootDispatch'));
    setTimeout(() => {
      setActionState('idle');
      if (onUpdateStatus) {
        onUpdateStatus(dev.id, 'ONLINE');
      }
      setLastCommandLog(t('cmdRebootSuccess'));
    }, 1500);
  };

  const handleClearWarning = () => {
    if (onUpdateStatus) {
      onUpdateStatus(dev.id, 'ONLINE');
    }
    setLastCommandLog(t('cmdAlarmCleared'));
  };

  const currentValue = liveSparkline[liveSparkline.length - 1] || dev.value;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141822] border border-[#2d3240] rounded-2xl max-w-[96vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full overflow-hidden shadow-2xl p-6 md:p-8 text-[#e0e2ec] max-h-[90vh] flex flex-col">
        
        {/* Top Header Section */}
        <DialogHeader className="border-b border-[#222630] pb-5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 ${
                dev.status === 'ONLINE' ? 'bg-[#00cfbf]/15 border-[#00cfbf]/50 text-[#00cfbf] shadow-[0_0_15px_rgba(0,207,191,0.25)]' :
                dev.status === 'WARNING' ? 'bg-[#ffba43]/20 border-[#ffba43]/50 text-[#ffba43] shadow-[0_0_15px_rgba(255,186,67,0.25)]' :
                'bg-[#1f2433] border-[#3a494b] text-[#849495]'
              }`}>
                <span className="material-symbols-outlined font-bold text-3xl">{dev.icon || 'precision_manufacturing'}</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="font-sans text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    {dev.name}
                  </DialogTitle>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#b9cacb] mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#00cfbf]">location_on</span>
                    {dev.location}
                  </span>
                  <span className="text-[#3a494b]">•</span>
                  <span className="font-mono text-[11px] text-[#849495] bg-[#0b0e15] px-2 py-0.5 rounded border border-[#222630]">
                    ID: {dev.id}
                  </span>
                  <span className="text-[#3a494b]">•</span>
                  <span className="font-mono text-[11px] text-[#00cfbf] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">hub</span>
                    MQTT / Sub-1GHz
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <Badge 
                variant="outline"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold tracking-wide shadow-sm ${
                  dev.status === 'ONLINE' ? 'bg-[#00cfbf]/15 border-[#00cfbf]/40 text-[#00cfbf]' :
                  dev.status === 'WARNING' ? 'bg-[#ffba43]/20 border-[#ffba43]/45 text-[#ffba43]' :
                  'bg-[#222630] border-[#3a494b] text-[#849495]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  dev.status === 'ONLINE' ? 'bg-[#00cfbf] shadow-[0_0_8px_#00cfbf]' :
                  dev.status === 'WARNING' ? 'bg-[#ffba43] shadow-[0_0_8px_#ffba43] animate-pulse' :
                  'bg-[#849495]'
                }`}></div>
                <span>
                  {dev.status === 'ONLINE' ? t('ONLINE') : dev.status === 'WARNING' ? t('WARNING') : t('OFFLINE')}
                </span>
              </Badge>
            </div>
          </div>
          <DialogDescription className="sr-only">
            {t('nodeDetails')}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="space-y-6 mt-6 overflow-y-auto pr-1">
          
          {/* 3-Column Key Metric Summary Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Live Telemetry */}
            <div className="bg-[#0b0e15] border border-[#222630] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#849495]">{dev.metricName}</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-[#00cfbf]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00cfbf] animate-ping"></span>
                  {t('liveStreamStatus')}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-extrabold text-white">{currentValue}</span>
                <span className="font-mono text-sm font-bold text-[#b9cacb]">{dev.unit}</span>
              </div>
            </div>

            {/* Card 2: Network Latency / RTT */}
            <div className="bg-[#0b0e15] border border-[#222630] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#849495]">{t('linkQuality')}</span>
                <span className="text-[11px] font-mono text-[#64b5f6] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                  {t('sub1GhzMesh')}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-white">{pingLatency !== null ? `${pingLatency} ms` : '--'}</span>
                <span className="text-xs text-[#00cfbf] font-medium">{t('packetLossZero')}</span>
              </div>
            </div>

            {/* Card 3: Gateway Health & Power */}
            <div className="bg-[#0b0e15] border border-[#222630] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#849495]">{t('nodeUptimePower')}</span>
                <span className="text-[11px] font-mono text-[#00cfbf]">
                  {t('powerNormal')}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-white">99.98%</span>
                <span className="text-xs text-[#849495]">{t('uninterrupted')}</span>
              </div>
            </div>
          </div>

          {/* Dedicated Wide Telemetry Carrier Waveform Panel */}
          <div className="bg-[#0b0e15] border border-[#222630] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-sans text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00cfbf] text-lg">show_chart</span>
                  {t('carrierWaveformTrend')}
                </h4>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#849495]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-0.5 bg-[#00cfbf]"></span>
                  {dev.metricName} ({dev.unit})
                </span>
                <span>•</span>
                <span>{t('sampleWindow60s')}</span>
              </div>
            </div>

            {/* Spacious SVG Waveform Canvas */}
            <div className="h-44 w-full relative bg-[#10131d] rounded-lg border border-[#1d202d] overflow-hidden flex flex-col justify-between p-3">
              {dev.status === 'OFFLINE' ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#849495] gap-2.5">
                  <span className="material-symbols-outlined text-3xl text-[#3a494b]">signal_wifi_off</span>
                  <span>{t('transceiverOfflineMsg')}</span>
                </div>
              ) : (
                <>
                  <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_0_8px_rgba(0,207,191,0.35)]" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <defs>
                      <linearGradient id="sparkGradientModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={dev.status === 'WARNING' ? '#ffba43' : '#00cfbf'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={dev.status === 'WARNING' ? '#ffba43' : '#00cfbf'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal reference grid lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#1f2433" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#1f2433" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#1f2433" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />

                    {/* Gradient Area Fill */}
                    <path 
                      d={`M0,40 ` + liveSparkline.map((val, idx) => {
                        const x = (idx / (liveSparkline.length - 1 || 1)) * 100;
                        const y = 36 - ((val % 100) / 100) * 32;
                        return `L${x},${y}`;
                      }).join(' ') + ` L100,40 Z`}
                      fill="url(#sparkGradientModal)"
                    />

                    {/* Main Line Waveform */}
                    <path 
                      d={liveSparkline.map((val, idx) => {
                        const x = (idx / (liveSparkline.length - 1 || 1)) * 100;
                        const y = 36 - ((val % 100) / 100) * 32;
                        return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
                      }).join(' ')}
                      fill="none" 
                      stroke={dev.status === 'WARNING' ? '#ffba43' : '#00cfbf'} 
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Top annotations inside chart */}
                  <div className="relative z-10 flex justify-between text-[10px] font-mono text-[#849495] select-none">
                    <span>100 {dev.unit}</span>
                    <span className="text-[#00cfbf] font-bold">{t('liveStreaming')}</span>
                  </div>

                  {/* Bottom timestamps inside chart */}
                  <div className="relative z-10 flex justify-between text-[10px] font-mono text-[#849495] select-none mt-auto">
                    <span>-60s</span>
                    <span>-45s</span>
                    <span>-30s</span>
                    <span>-15s</span>
                    <span className="text-white font-bold">{t('now')}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Remote Transceiver Control Suite */}
          <div className="bg-[#1b202e]/50 border border-[#2d3240] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-sans text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00cfbf] text-lg">settings_remote</span>
                  {t('nodeDetails')}
                </h4>
                <p className="text-xs text-[#849495] mt-0.5">
                  {t('remoteControlDesc')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePing}
                disabled={actionState !== 'idle' || dev.status === 'OFFLINE'}
                className="bg-[#141822] border-[#3a494b] hover:border-[#00cfbf] hover:bg-[#00cfbf]/10 hover:text-[#00cfbf] text-xs font-sans h-9 px-4 cursor-pointer transition-all"
              >
                <span className={`material-symbols-outlined text-[16px] mr-2 ${actionState === 'pinging' ? 'animate-spin' : ''}`}>
                  {actionState === 'pinging' ? 'sync' : 'cell_tower'}
                </span>
                {actionState === 'pinging' ? t('pinging') : t('sendPing')}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReboot}
                disabled={actionState !== 'idle'}
                className="bg-[#141822] border-[#3a494b] hover:border-[#ffba43] hover:bg-[#ffba43]/10 hover:text-[#ffba43] text-xs font-sans h-9 px-4 cursor-pointer transition-all"
              >
                <span className={`material-symbols-outlined text-[16px] mr-2 ${actionState === 'rebooting' ? 'animate-spin' : ''}`}>
                  restart_alt
                </span>
                {actionState === 'rebooting' ? t('rebooting') : t('remoteReboot')}
              </Button>

              {dev.status === 'WARNING' && (
                <Button
                  size="sm"
                  onClick={handleClearWarning}
                  className="bg-[#00cfbf] hover:bg-[#00cfbf]/90 text-[#0B0E14] font-extrabold text-xs h-9 px-4 cursor-pointer shadow-[0_0_12px_rgba(0,207,191,0.35)] transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] mr-1.5">check_circle</span>
                  {t('clearWarning')}
                </Button>
              )}
            </div>

            {/* Diagnostic Command Feedback Strip */}
            {lastCommandLog && (
              <div className="mt-4 pt-3 border-t border-[#2d3240]/60 flex items-center gap-2 font-mono text-xs text-[#b9cacb]">
                <span className="material-symbols-outlined text-[15px] text-[#00cfbf]">terminal</span>
                <span className="truncate">{lastCommandLog}</span>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

