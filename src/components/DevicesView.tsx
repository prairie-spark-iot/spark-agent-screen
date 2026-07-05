import React, { useState } from 'react';
import { Device } from '../types';
import { useTranslation } from '../i18n/context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeviceCard } from './devices/DeviceCard';
import { AddDeviceDialog } from './devices/AddDeviceDialog';
import { DeviceDetailModal } from './devices/DeviceDetailModal';

interface DevicesViewProps {
  devices: Device[];
  onAddDevice: (deviceData: {
    name: string;
    location: string;
    metricName: string;
    initialValue: string;
    unit: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  }) => void;
  onUpdateStatus?: (deviceId: string, newStatus: 'ONLINE' | 'OFFLINE' | 'WARNING') => void;
}

export default function DevicesView({ devices, onAddDevice, onUpdateStatus }: DevicesViewProps) {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Summary KPI Calculations memoized for smooth telemetry polling
  const { totalCount, onlineCount, warningCount, offlineCount, healthRate } = React.useMemo(() => {
    const total = devices.length;
    const online = devices.filter(d => d.status === 'ONLINE').length;
    const warning = devices.filter(d => d.status === 'WARNING').length;
    const offline = devices.filter(d => d.status === 'OFFLINE').length;
    return {
      totalCount: total,
      onlineCount: online,
      warningCount: warning,
      offlineCount: offline,
      healthRate: total > 0 ? Math.round((online / total) * 100) : 100
    };
  }, [devices]);

  const filteredDevices = React.useMemo(() => {
    return devices.filter(dev => {
      const matchesSearch = 
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.metricName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'ALL' || dev.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [devices, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#b9cacb] uppercase">{t('totalNodes')}</p>
            <p className="font-mono text-2xl font-extrabold text-white mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00cfbf]/10 border border-[#00cfbf]/30 flex items-center justify-center text-[#00cfbf]">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
        </div>

        <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#b9cacb] uppercase">{t('systemHealthRate')}</p>
            <p className={`font-mono text-2xl font-extrabold mt-1 ${healthRate >= 90 ? 'text-[#00cfbf]' : healthRate >= 75 ? 'text-[#ffba43]' : 'text-[#ffb4ab]'}`}>
              {healthRate}%
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${healthRate >= 90 ? 'bg-[#00cfbf]/10 border border-[#00cfbf]/30 text-[#00cfbf]' : 'bg-[#ffba43]/10 border border-[#ffba43]/30 text-[#ffba43]'}`}>
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
          </div>
        </div>

        <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#b9cacb] uppercase">{t('activeWarningsCount')}</p>
            <p className={`font-mono text-2xl font-extrabold mt-1 ${warningCount > 0 ? 'text-[#ffba43]' : 'text-[#00cfbf]'}`}>
              {warningCount}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${warningCount > 0 ? 'bg-[#ffba43]/15 border border-[#ffba43]/40 text-[#ffba43] animate-pulse' : 'bg-[#00cfbf]/10 border border-[#00cfbf]/30 text-[#00cfbf]'}`}>
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
        </div>

        <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#b9cacb] uppercase">{t('avgResponseTime')}</p>
            <p className="font-mono text-2xl font-extrabold text-white mt-1">
              8<span className="text-sm font-normal text-[#849495] ml-0.5">ms</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#1a1f2c] border border-[#3a494b] flex items-center justify-center text-[#b9cacb]">
            <span className="material-symbols-outlined text-xl">speed</span>
          </div>
        </div>
      </div>

      {/* Header controls & Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222630] pb-4 gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0b0e15] p-1 rounded-lg border border-[#222630] overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-[#1e2433] text-white shadow-sm border border-[#3a494b]/60'
                : 'text-[#b9cacb] hover:text-white hover:bg-[#141822]'
            }`}
          >
            <span>{t('allNodes')}</span>
            <span className="font-mono text-[10px] bg-[#141822] px-1.5 py-0.5 rounded text-[#b9cacb]">{totalCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('ONLINE')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'ONLINE'
                ? 'bg-[#00cfbf]/15 text-[#00cfbf] shadow-sm border border-[#00cfbf]/40'
                : 'text-[#b9cacb] hover:text-[#00cfbf] hover:bg-[#141822]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00cfbf]"></span>
            <span>{t('onlineNodes')}</span>
            <span className="font-mono text-[10px] bg-[#00cfbf]/10 px-1.5 py-0.5 rounded text-[#00cfbf]">{onlineCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('WARNING')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'WARNING'
                ? 'bg-[#ffba43]/20 text-[#ffba43] shadow-sm border border-[#ffba43]/40'
                : 'text-[#b9cacb] hover:text-[#ffba43] hover:bg-[#141822]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffba43] animate-pulse"></span>
            <span>{t('warningNodes')}</span>
            <span className="font-mono text-[10px] bg-[#ffba43]/10 px-1.5 py-0.5 rounded text-[#ffba43]">{warningCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('OFFLINE')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'OFFLINE'
                ? 'bg-[#222630] text-white shadow-sm border border-[#3a494b]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[#141822]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#849495]"></span>
            <span>{t('offlineNodes')}</span>
            <span className="font-mono text-[10px] bg-[#141822] px-1.5 py-0.5 rounded text-[#849495]">{offlineCount}</span>
          </button>
        </div>

        <div className="flex gap-2.5 w-full md:w-auto justify-between md:justify-end items-center">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#b9cacb] font-light">search</span>
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#080A0E] border-[#222630] focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 text-xs font-sans py-1.5 pl-8 pr-3 w-full md:w-52 text-[#e0e2ec] transition-all placeholder:text-[#b9cacb]/50 h-9 rounded-md" 
              placeholder={t('searchDevices')} 
              type="text"
            />
          </div>

          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#00cfbf] text-[#0B0E14] font-sans text-xs font-extrabold px-3.5 py-1.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-[#00cfbf]/90 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,207,191,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">add</span> {t('addNode')}
          </Button>
        </div>
      </div>

      {/* Grid of Device Cards */}
      {filteredDevices.length === 0 ? (
        <div className="bg-[#141822] border border-[#2d3240] rounded-xl p-12 text-center text-[#b9cacb]">
          <span className="material-symbols-outlined text-4xl text-[#3a494b] mb-2">router</span>
          <p className="font-sans text-sm font-bold text-white">
            {t('noTransceiversFound')}
          </p>
          <p className="font-sans text-xs text-[#849495] mt-1">
            {t('tryClearingSearch')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDevices.map((dev) => (
            <DeviceCard 
              key={dev.id} 
              dev={dev} 
              onSelect={(device) => setSelectedDevice(device)} 
            />
          ))}
        </div>
      )}

      {/* Add Device Modal Dialog */}
      <AddDeviceDialog 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onAddDevice={onAddDevice} 
      />

      {/* Interactive Device Detail & Control Modal */}
      <DeviceDetailModal
        dev={selectedDevice}
        open={Boolean(selectedDevice)}
        onOpenChange={(open) => {
          if (!open) setSelectedDevice(null);
        }}
        onUpdateStatus={(devId, status) => {
          if (onUpdateStatus) onUpdateStatus(devId, status);
          if (selectedDevice) {
            setSelectedDevice({ ...selectedDevice, status });
          }
        }}
      />
    </div>
  );
}
