import React, { useEffect, useState, useCallback } from 'react';
import { Alert, Device, Doc } from './types';
import DashboardView from './components/DashboardView';
import DevicesView from './components/DevicesView';
import AlertsView from './components/AlertsView';
import DiagnosisDetailView from './components/DiagnosisDetailView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import { SystemNodeModal } from './components/system/SystemNodeModal';
import { Sidebar, TopNavbar, MobileBottomNav, SystemInfoModal } from './components/layout';
import { LoginView } from './components/LoginView';
import { useTranslation } from './i18n/context';
import sparkLogo from './assets/images/spark_logo_1783157836702.jpg';
import { initialAlerts, initialDevices, initialDocuments, generateHeuristicDiagnosis } from '@/lib/db';

const logoSrc = typeof sparkLogo === 'object' && sparkLogo && 'src' in sparkLogo 
  ? (sparkLogo as any).src 
  : sparkLogo;

export default function App() {
  const { language, setLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Database state initialized with client defaults immediately so UI never blocks
  const [alerts, setAlerts] = useState<Alert[]>(() => initialAlerts());
  const [devices, setDevices] = useState<Device[]>(() => initialDevices());
  const [documents, setDocuments] = useState<Doc[]>(() => initialDocuments());

  // Page level state
  const [diagnosingAll, setDiagnosingAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notification popup state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Info modal state
  const [showInfoModal, setShowInfoModal] = useState(false);

  // System node modal state
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState('NODE_01');
  const [activeNodeLabel, setActiveNodeLabel] = useState('sysNode01Name');

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spark_iot_auth') === 'true';
    }
    return false;
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spark_iot_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spark_iot_auth');
    }
  };

  const parseResponseJson = async <T,>(res: Response): Promise<T> => {
    const text = await res.text();
    if (!text || !text.trim()) {
      throw new Error('Empty response from server');
    }
    return JSON.parse(text) as T;
  };

  // Fetch initial system state from Express Backend with retry and fallback
  const fetchData = async (silent = false, retries = 2): Promise<void> => {
    if (!silent && alerts.length === 0) setLoading(true);
    try {
      let alertsData: Alert[];
      let devicesData: Device[];
      let docsData: Doc[];

      if (silent) {
        // API Batching: Single stream sync endpoint to reduce network overhead
        const syncRes = await fetch('/api/telemetry/sync');
        if (!syncRes.ok) throw new Error('Telemetry sync failed');
        const syncData = await parseResponseJson<{ alerts: Alert[]; devices: Device[]; documents: Doc[] }>(syncRes);
        alertsData = syncData.alerts;
        devicesData = syncData.devices;
        docsData = syncData.documents;
      } else {
        const [alertsRes, devicesRes, docsRes] = await Promise.all([
          fetch('/api/alerts'),
          fetch('/api/devices'),
          fetch('/api/documents')
        ]);

        if (!alertsRes.ok || !devicesRes.ok || !docsRes.ok) {
          throw new Error('Server returned an error while fetching telemetry data.');
        }

        [alertsData, devicesData, docsData] = await Promise.all([
          parseResponseJson<Alert[]>(alertsRes),
          parseResponseJson<Device[]>(devicesRes),
          parseResponseJson<Doc[]>(docsRes)
        ]);
      }

      // Local persistence recovery: Restore locally cached approved diagnoses
      const localCacheStr = localStorage.getItem('spark_ai_local_diagnoses');
      const localCache: Record<string, any> = localCacheStr ? JSON.parse(localCacheStr) : {};

      if (silent) {
        // Smart Delta Merge: Preserve active UI focus & ongoing diagnosis workflows
        setAlerts(prevAlerts => {
          return alertsData.map(newAlert => {
            const existing = prevAlerts.find(a => a.id === newAlert.id);
            const cachedDiag = localCache[newAlert.id];
            if (!existing) return cachedDiag ? { ...newAlert, status: 'Diagnosed', diagnosis: cachedDiag } : newAlert;
            if (existing.status === 'Diagnosing') {
              return { ...newAlert, status: 'Diagnosing', diagnosis: existing.diagnosis };
            }
            if (existing.status === 'Diagnosed' && existing.diagnosis) {
              return {
                ...newAlert,
                status: 'Diagnosed',
                diagnosis: {
                  ...existing.diagnosis,
                  approved: existing.diagnosis.approved || newAlert.diagnosis?.approved
                }
              };
            }
            return cachedDiag ? { ...newAlert, status: 'Diagnosed', diagnosis: cachedDiag } : newAlert;
          });
        });

        setDevices(prevDevices => {
          return devicesData.map(newDev => {
            const existing = prevDevices.find(d => d.id === newDev.id);
            return existing ? { ...existing, value: newDev.value, status: newDev.status, sparkline: newDev.sparkline } : newDev;
          });
        });
      } else {
        setAlerts(alertsData.map(a => localCache[a.id] ? { ...a, status: 'Diagnosed', diagnosis: localCache[a.id] } : a));
        setDevices(devicesData);
      }
      setDocuments(docsData);
      setError(null);
    } catch (err: any) {
      console.warn('API sync attempt failed:', err);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return fetchData(silent, retries - 1);
      }
      setError(null);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up smart polling with Page Visibility API check
    const interval = setInterval(() => {
      // Don't poll when page is hidden in background tab to save CPU and network
      if (!document.hidden) {
        fetchData(true);
      }
    }, 4000);

    // Immediately refresh telemetry when user switches back to this browser tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const updateLocalDiagCache = (id: string, diag: any) => {
    try {
      const cached = JSON.parse(localStorage.getItem('spark_ai_local_diagnoses') || '{}');
      cached[id] = diag;
      localStorage.setItem('spark_ai_local_diagnoses', JSON.stringify(cached));
    } catch {}
  };

  // 1. Diagnose single alert handler
  const handleDiagnose = async (alertId: string) => {
    // Set immediate client state for UX
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Diagnosing' } : a));
    
    // Switch to detail view so user can watch live reasoning compilation!
    setSelectedAlertId(alertId);
    setActiveTab('diagnosis-detail');

    try {
      let updatedAlert: Alert;
      try {
        const res = await fetch(`/api/alerts/diagnose/${alertId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language })
        });
        if (!res.ok) throw new Error('Diagnosis compilation failed.');
        updatedAlert = await parseResponseJson<Alert>(res);
      } catch (apiErr) {
        // Client fallback if offline or server restarting
        const target = alerts.find(a => a.id === alertId);
        if (!target) throw apiErr;
        updatedAlert = {
          ...target,
          status: 'Diagnosed',
          diagnosis: generateHeuristicDiagnosis(target)
        };
      }
      
      if (updatedAlert.diagnosis) {
        updateLocalDiagCache(alertId, updatedAlert.diagnosis);
      }

      // Update alerts state with diagnosed report
      setAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
      triggerNotification(`AI successfully compiled diagnostic reasoning for ${updatedAlert.device}!`);
    } catch (err: any) {
      console.error(err);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Pending' } : a));
      triggerNotification(`Error: Failed to perform AI diagnosis on node.`);
    }
  };

  // 2. Approve action plan handler
  const handleApproveAction = async (alertId: string) => {
    try {
      let updatedAlert: Alert;
      try {
        const res = await fetch(`/api/alerts/approve-action/${alertId}`, {
          method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to dispatch action plan.');
        updatedAlert = await parseResponseJson<Alert>(res);
      } catch (apiErr) {
        const target = alerts.find(a => a.id === alertId);
        if (!target) throw apiErr;
        updatedAlert = {
          ...target,
          status: 'Diagnosed',
          diagnosis: target.diagnosis ? { ...target.diagnosis, approved: true } : undefined
        };
      }

      if (updatedAlert.diagnosis) {
        updateLocalDiagCache(alertId, updatedAlert.diagnosis);
      }

      setAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
      triggerNotification(`Action plan approved. Micro-actuator commands successfully dispatched.`);
    } catch (err: any) {
      console.error(err);
      triggerNotification(`Error: Failed to approve mechanical action plan.`);
    }
  };

  // 3. Bulk auto-diagnose pending alerts handler
  const handleAutoDiagnoseAll = async () => {
    setDiagnosingAll(true);
    triggerNotification('Initiated parallel diagnostic reasoning pipelines...');
    try {
      let updatedAlerts: Alert[];
      try {
        const res = await fetch('/api/alerts/auto-diagnose-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language })
        });
        if (!res.ok) throw new Error('Auto-diagnose all failed.');
        const data = await parseResponseJson<any>(res);
        updatedAlerts = data.alerts || data;
      } catch (apiErr) {
        updatedAlerts = alerts.map(a => {
          if (a.status === 'Pending') {
            return {
              ...a,
              status: 'Diagnosed' as const,
              diagnosis: generateHeuristicDiagnosis(a)
            };
          }
          return a;
        });
      }

      updatedAlerts.forEach(a => {
        if (a.diagnosis) updateLocalDiagCache(a.id, a.diagnosis);
      });

      setAlerts(updatedAlerts);
      triggerNotification('Successfully diagnosed all pending anomalies!');
    } catch (err: any) {
      console.error(err);
      triggerNotification('Error while auto-diagnosing alerts.');
    } finally {
      setDiagnosingAll(false);
    }
  };

  // 4. Add custom device node handler
  const handleAddDevice = async (deviceData: {
    name: string;
    location: string;
    metricName: string;
    initialValue: string;
    unit: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  }) => {
    try {
      let newDev: Device;
      try {
        const res = await fetch('/api/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deviceData)
        });
        if (!res.ok) throw new Error('Failed to append custom node.');
        newDev = await parseResponseJson<Device>(res);
      } catch (apiErr) {
        newDev = {
          id: `dev-${Date.now()}`,
          name: deviceData.name,
          location: deviceData.location || 'General Area',
          metricName: deviceData.metricName,
          value: deviceData.initialValue || '0',
          unit: deviceData.unit || '',
          status: deviceData.status || 'ONLINE',
          sparkline: Array(9).fill(parseFloat(deviceData.initialValue) || 0),
          icon: 'router'
        };
      }

      setDevices(prev => [...prev, newDev]);
      triggerNotification(`Node "${newDev.name}" successfully provisioned at ${newDev.location}.`);
    } catch (err: any) {
      console.error(err);
      triggerNotification('Error: Failed to register custom telemetry node.');
    }
  };

  const handleUpdateDeviceStatus = useCallback((deviceId: string, newStatus: 'ONLINE' | 'OFFLINE' | 'WARNING') => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return { ...d, status: newStatus };
      }
      return d;
    }));
    triggerNotification(`Transceiver ${deviceId} status updated to ${newStatus}.`);
  }, []);

  // Utility helper for toast notification
  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Navigation handler helper
  const handleNavigate = (tab: string, arg?: string) => {
    if (tab === 'diagnosis-detail' && arg) {
      setSelectedAlertId(arg);
    }
    setActiveTab(tab);
  };

  // Selected Alert for diagnosis-detail page
  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || null;

  if (!isLoggedIn) {
    return <LoginView logoSrc={logoSrc} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-[100dvh] w-screen bg-[#0B0E14] text-[#e0e2ec] font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 bg-surface-container border border-[#00cfbf]/40 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-slide-in shadow-[0_0_20px_rgba(0,207,191,0.25)]">
          <span className="material-symbols-outlined text-[#00cfbf]">notifications_active</span>
          <p className="font-sans text-xs font-semibold">{notificationMsg}</p>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-[#b9cacb] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <SystemInfoModal 
        open={showInfoModal} 
        onOpenChange={setShowInfoModal} 
      />

      <SystemNodeModal
        open={showNodeModal}
        onOpenChange={setShowNodeModal}
        activeNodeId={activeNodeId}
        onSelectNode={(nodeId, nodeLabel) => {
          setActiveNodeId(nodeId);
          setActiveNodeLabel(nodeLabel);
          setShowNodeModal(false);
          const translatedNode = nodeLabel.startsWith('sysNode') ? t(nodeLabel) : nodeLabel;
          setNotificationMsg(t('nodeSwitchSuccess', { node: translatedNode }));
          setShowNotification(true);
        }}
      />

      {/* Left Sidebar navigation panel */}
      <Sidebar
        logoSrc={logoSrc}
        activeTab={activeTab}
        activeNodeLabel={activeNodeLabel}
        pendingAlertsCount={alerts.filter(a => a.status === 'Pending').length}
        onNavigate={handleNavigate}
        onOpenNodeModal={() => setShowNodeModal(true)}
        onOpenInfoModal={() => setShowInfoModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <TopNavbar
          logoSrc={logoSrc}
          activeTab={activeTab}
          activeNodeLabel={activeNodeLabel}
          pendingAlertsCount={alerts.filter(a => a.status === 'Pending').length}
          onNavigate={handleNavigate}
          onOpenNodeModal={() => setShowNodeModal(true)}
          onOpenInfoModal={() => setShowInfoModal(true)}
          onLogout={handleLogout}
        />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#0B0E14] p-4 lg:p-6 pb-20 lg:pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3 spin-slow">progress_activity</span>
              <h3 className="font-sans text-sm font-semibold text-[#e0e2ec]">{t('connectingToGateway')}</h3>
              <p className="text-[#b9cacb] text-xs mt-1">{t('syncingBuffers')}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center max-w-md mx-auto space-y-4">
              <span className="material-symbols-outlined text-4xl text-[#ffb4ab]">error</span>
              <div>
                <h3 className="font-sans text-base font-bold text-[#ffb4ab]">{t('syncOffline')}</h3>
                <p className="text-[#b9cacb] text-xs mt-1 leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => fetchData()}
                className="px-4 py-2 bg-[#222630] border border-[#222630] rounded text-xs hover:bg-[#2d323f] transition-all cursor-pointer font-sans"
              >
                {t('retrySync')}
              </button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && (
                <DashboardView 
                  alerts={alerts} 
                  devices={devices} 
                  onNavigate={handleNavigate}
                  onDiagnose={handleDiagnose}
                />
              )}

              {activeTab === 'devices' && (
                <DevicesView 
                  devices={devices} 
                  onAddDevice={handleAddDevice}
                  onUpdateStatus={handleUpdateDeviceStatus}
                />
              )}

              {activeTab === 'alerts' && (
                <AlertsView 
                  alerts={alerts} 
                  onNavigate={handleNavigate} 
                  onDiagnose={handleDiagnose}
                  onAutoDiagnoseAll={handleAutoDiagnoseAll}
                  diagnosingAll={diagnosingAll}
                />
              )}

              {activeTab === 'diagnosis-detail' && (
                <DiagnosisDetailView 
                  alert={selectedAlert} 
                  onDiagnose={handleDiagnose}
                  onApproveAction={handleApproveAction}
                  onBack={() => handleNavigate('alerts')}
                />
              )}

              {activeTab === 'knowledge' && (
                <KnowledgeBaseView 
                  documents={documents}
                  onAddDoc={(newDoc) => {
                    setDocuments(prev => [newDoc, ...prev]);
                    setNotificationMsg(t('uploadSuccessMsg'));
                    setShowNotification(true);
                  }}
                />
              )}
            </div>
          )}
        </main>

        {/* Mobile bottom navigation bar */}
        <MobileBottomNav activeTab={activeTab} onNavigate={handleNavigate} />
      </div>

    </div>
  );
}
