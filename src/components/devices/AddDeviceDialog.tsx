import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const addDeviceSchema = z.object({
  name: z.string().min(1),
  location: z.string(),
  metricName: z.string().min(1),
  initialValue: z.string(),
  unit: z.string(),
  status: z.enum(['ONLINE', 'OFFLINE', 'WARNING']),
});

type AddDeviceFormValues = z.infer<typeof addDeviceSchema>;

const defaultValues: AddDeviceFormValues = {
  name: '',
  location: '',
  metricName: '',
  initialValue: '',
  unit: '',
  status: 'ONLINE',
};

export const AddDeviceDialog = React.memo(function AddDeviceDialog({
  open,
  onOpenChange,
  onAddDevice
}: AddDeviceDialogProps) {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddDeviceFormValues>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues,
  });

  const onSubmit = (data: AddDeviceFormValues) => {
    onAddDevice({
      name: data.name,
      location: data.location,
      metricName: data.metricName,
      initialValue: data.initialValue || '0',
      unit: data.unit,
      status: data.status,
    });
    reset(defaultValues);
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset(defaultValues);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#161a25] border border-[#2e3444] rounded-xl max-w-[95vw] sm:max-w-md w-full overflow-hidden shadow-2xl p-6 text-[#e0e2ec]">
        <DialogHeader className="border-b border-[#2e3444] pb-4">
          <DialogTitle className="font-sans text-base font-bold text-white">
            {t('addSystemNode')}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#d1d5db]">
            {t('registerNewNodeDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('nodeName')}</label>
            <Input
              {...register('name')}
              placeholder={t('placeholderNodeName')}
              className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
            />
            {errors.name && <p className="text-[10px] text-[#ffb4ab] mt-1">{t('fieldRequired')}</p>}
          </div>

          <div>
            <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('locationSegment')}</label>
            <Input
              {...register('location')}
              placeholder={t('placeholderLocation')}
              className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('metricName')}</label>
              <Input
                {...register('metricName')}
                placeholder={t('placeholderMetric')}
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
              {errors.metricName && <p className="text-[10px] text-[#ffb4ab] mt-1">{t('fieldRequired')}</p>}
            </div>
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('unit')}</label>
              <Input
                {...register('unit')}
                placeholder="e.g. °C, MPa, %"
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('initialValue')}</label>
              <Input
                {...register('initialValue')}
                placeholder="e.g. 84.2, 12"
                className="w-full bg-[#0f121a] border-[#2e3444] p-2 text-sm text-[#e0e2ec] focus:outline-none focus:border-[#00cfbf] focus:ring-1 focus:ring-[#00cfbf]/50 h-9 font-sans placeholder:text-[#d1d5db]/30"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold text-[#e2e8f0] uppercase mb-1">{t('startingStatus')}</label>
              <select
                {...register('status')}
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
              onClick={() => handleOpenChange(false)}
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
