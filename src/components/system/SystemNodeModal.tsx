import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface SystemNodeItem {
  id: string;
  nameKey: string;
  location: string;
  status: 'Active' | 'Standby' | 'Maintenance';
  latency: string;
}

interface SystemNodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeNodeId: string;
  onSelectNode: (nodeId: string, nodeLabel: string) => void;
}

function createDefaultNodes(): SystemNodeItem[] {
  const baseNodes: Omit<SystemNodeItem, 'latency'>[] = [
    { id: 'NODE_01', nameKey: 'sysNode01Name', location: 'locSectionA', status: 'Active' },
    { id: 'NODE_02', nameKey: 'sysNode02Name', location: 'locSectionB', status: 'Active' },
    { id: 'NODE_03', nameKey: 'sysNode03Name', location: 'locSubstation', status: 'Active' },
    { id: 'NODE_04', nameKey: 'sysNode04Name', location: 'locSectionD', status: 'Standby' },
  ];
  return baseNodes.map(n => ({
    ...n,
    latency: `${(2 + Math.random() * 10).toFixed(1)} ms`,
  }));
}

export const SystemNodeModal: React.FC<SystemNodeModalProps> = ({
  open,
  onOpenChange,
  activeNodeId,
  onSelectNode
}) => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<SystemNodeItem[]>(createDefaultNodes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newLocation.trim()) return;
    const customNodeId = `NODE_${Math.floor(10 + Math.random() * 90)}`;
    const customNode: SystemNodeItem = {
      id: customNodeId,
      nameKey: `${newId} (${newLocation})`,
      location: newLocation,
      status: 'Active',
      latency: `${(Math.random() * 6 + 2).toFixed(1)} ms`
    };
    setNodes(prev => [...prev, customNode]);
    setNewId('');
    setNewLocation('');
    setShowAddForm(false);
    onSelectNode(customNodeId, customNode.nameKey);
  };

  // Simulate live latency drift while modal is open
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        latency: `${Math.max(1, parseFloat(n.latency) + (Math.random() - 0.5) * 1.5).toFixed(1)} ms`,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [open]);

  const getNodeName = (item: SystemNodeItem) => {
    if (item.nameKey.startsWith('sysNode')) {
      return t(item.nameKey);
    }
    return item.nameKey;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141822] border border-[#2d3240] rounded-2xl w-[96vw] max-w-5xl xl:max-w-6xl text-[#e0e2ec] p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <DialogHeader className="border-b border-[#222630] pb-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#00cfbf]/15 border border-[#00cfbf]/40 flex items-center justify-center text-[#00cfbf] shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">radar</span>
              </div>
              <div>
                <DialogTitle className="font-sans text-lg sm:text-xl font-bold text-white tracking-wide">
                  {t('switchSystemNode')}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-[#849495] mt-1">
                  {t('selectSystemNodeDesc')}
                </DialogDescription>
              </div>
            </div>

            {/* Cluster Telemetry Stats Banner */}
            <div className="flex items-center gap-4 bg-[#181d28] border border-[#2d3240] px-4 py-2 rounded-xl text-xs flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#849495]">Cluster:</span>
                <span className="font-mono font-bold text-white">{nodes.length} Nodes Online</span>
              </div>
              <div className="h-4 w-[1px] bg-[#2d3240]" />
              <div className="flex items-center gap-1.5 font-mono text-[#00cfbf]">
                <span className="material-symbols-outlined text-[15px]">speed</span>
                <span>Avg &lt; 6.0 ms</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="my-4 overflow-y-auto pr-1 flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {nodes.map(node => {
              const isCurrent = node.id === activeNodeId;
              const nodeLabel = getNodeName(node);
              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode(node.id, nodeLabel)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                    isCurrent
                      ? 'bg-gradient-to-br from-[#00cfbf]/15 via-[#00cfbf]/5 to-[#1a1f2c] border-[#00cfbf] shadow-[0_0_25px_rgba(0,207,191,0.18)]'
                      : 'bg-[#1a1f2c] border-[#2d3240] hover:border-[#00cfbf]/50 hover:bg-[#1f2637]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                          isCurrent ? 'bg-[#00cfbf] text-[#0B0E14] shadow-[0_0_12px_rgba(0,207,191,0.3)]' : 'bg-[#141822] text-[#b9cacb] border border-[#2d3240]'
                        }`}>
                          {node.id.split('_')[1] || 'ND'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-white truncate max-w-full">
                            {nodeLabel}
                          </h4>
                          <span className="font-mono text-[11px] text-[#849495] block mt-0.5">
                            ID: {node.id}
                          </span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium flex-shrink-0 ${
                        node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        {node.status}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2d3240]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#849495]">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <span className="material-symbols-outlined text-[16px] text-[#00cfbf]">location_on</span>
                        <span className="truncate">{node.location.startsWith('loc') ? t(node.location) : node.location}</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#00cfbf] bg-[#00cfbf]/10 px-2.5 py-0.5 rounded border border-[#00cfbf]/20">
                        Ping: {node.latency}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {isCurrent ? (
                      <Badge className="bg-[#00cfbf] text-[#0B0E14] font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-lg shadow-[0_0_12px_rgba(0,207,191,0.4)] flex items-center gap-1.5 w-full justify-center">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {t('activeNodeBadge')}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node.id, nodeLabel);
                        }}
                        className="bg-[#141822] border-[#3a494b] group-hover:border-[#00cfbf] group-hover:text-[#00cfbf] text-xs h-9 px-4 rounded-lg transition-all shadow-sm w-full font-medium"
                      >
                        {t('switchSystemNode')}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {showAddForm && (
            <form onSubmit={handleAddNode} className="bg-[#1b202e] border border-[#00cfbf]/40 rounded-2xl p-5 sm:p-6 space-y-4 mt-5 animate-in fade-in shadow-lg">
              <div className="flex items-center gap-2 pb-2 border-b border-[#2d3240]">
                <span className="material-symbols-outlined text-[#00cfbf] text-lg">add_circle</span>
                <h5 className="font-sans text-xs sm:text-sm font-bold text-white uppercase tracking-wider">{t('addSystemNode')}</h5>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#b9cacb] mb-1.5 font-mono">{t('placeholderNodeName')}</label>
                  <Input
                    required
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    placeholder="e.g. System Node 05 (East Assembly)"
                    className="bg-[#0f121a] border-[#2e3444] text-xs sm:text-sm text-white h-10 focus:border-[#00cfbf]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#b9cacb] mb-1.5 font-mono">{t('placeholderLocation')}</label>
                  <Input
                    required
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Workshop Sector 9"
                    className="bg-[#0f121a] border-[#2e3444] text-xs sm:text-sm text-white h-10 focus:border-[#00cfbf]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs h-9 px-4 text-[#849495] hover:text-white"
                >
                  {t('cancelBtn')}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00cfbf] text-[#0B0E14] font-bold text-xs h-9 px-6 rounded-lg hover:bg-[#00cfbf]/90 shadow-sm"
                >
                  {t('registerNodeBtn')}
                </Button>
              </div>
            </form>
          )}
        </div>

        <DialogFooter className="border-t border-[#222630] pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          {!showAddForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="bg-[#141822] border-[#3a494b] hover:border-[#00cfbf] hover:text-[#00cfbf] text-xs h-9 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              {t('addSystemNode')}
            </Button>
          ) : <div />}
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-[#222630] text-white hover:bg-[#2d3240] text-xs h-9 px-5 rounded-lg cursor-pointer ml-auto"
          >
            {t('previewClose')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
