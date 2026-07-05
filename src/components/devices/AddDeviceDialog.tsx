import React, { useState } from 'react';
import { useTranslation } from '../../i18n/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDevice: (deviceData: {
    name: string;
    location: string;
    metricName: string;
    initialValue: string;
    unit: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  }) => void;
}

export const AddDeviceDialog = React.memo(function AddDeviceDialog({
  open,
  onOpenChange,
  onAddDevice
}: AddDeviceDialogProps) {
  const { t, language } = useTranslation();
  
  // Add device form state
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newStatus, setNewStatus] = useState<'ONLINE' | 'OFFLINE' | 'WARNING'>('ONLINE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMetric) return;
    onAddDevice({
      name: newName,
      location: newLocation,
      metricName: newMetric,
      initialValue: newVal || '0',
      unit: newUnit || '',
      status: newStatus
    });
    // Reset form
    setNewName('');
    setNewLocation('');
    setNewMetric('');
    setNewVal('');
    setNewUnit('');
    setNewStatus('ONLINE');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161a25] border border-[#2e3444] rounded-xl max-w-[95vw] sm:max-w-md w-full overflow-hidden shadow-2xl p-6 text-[#e0e2ec]">
        <DialogHeader className="border-b border-[#2e3444] pb-4">
          <DialogTitle className="font-sans text-base font-bold text-white">
            {t('addSystemNode')}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#d1d5db]">
            {t('registerNewNodeDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('nodeName')}</label>
            <Input 
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('placeholderNodeName')}
              className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('locationSegment')}</label>
            <Input 
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder={t('placeholderLocation')}
              className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('metricName')}</label>
              <Input 
                required
                value={newMetric}
                onChange={(e) => setNewMetric(e.target.value)}
                placeholder={t('placeholderMetric')}
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('unit')}</label>
              <Input 
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="e.g. °C, MPa, %"
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('initialValue')}</label>
              <Input 
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                placeholder="e.g. 84.2, 12"
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('startingStatus')}</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full bg-[#0f121a] border border-[#2e3444] rounded p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans"
              >
                <option value="ONLINE">ONLINE</option>
                <option value="WARNING">WARNING</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-[#2e3444] flex gap-2 justify-end">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border-[#2e3444] text-[#d1d5db] hover:bg-[#1a1f2c] hover:text-white cursor-pointer rounded h-9 font-sans"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              className="px-4 py-2 bg-[#00cfbf] text-[#0B0E14] font-extrabold hover:bg-[#00cfbf]/90 transition-colors cursor-pointer rounded h-9 font-sans shadow-[0_0_12px_rgba(0,207,191,0.3)]"
            >
              {t('addNodeBtn')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
