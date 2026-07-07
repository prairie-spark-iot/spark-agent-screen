import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
import { useDevices, useAddDevice, useUpdateDeviceStatusLocal, addFallbackDeviceToCache } from '@/src/features/devices/hooks';
import { useDeviceStatusWS } from '@/src/features/devices/useDeviceStatusWS';
import { useAlerts, useDiagnoseAlert, useApproveAlertAction, useAutoDiagnoseAllAlerts } from '@/src/features/alerts/hooks';
import { useAlertWS } from '@/src/features/alerts/useAlertWS';
import { useDiagnosisWS } from '@/src/features/alerts/useDiagnosisWS';
import { useDocuments, useAddDocumentLocal } from '@/src/features/knowledge/hooks';
import { useTelemetrySync } from '@/src/features/telemetry/hooks';
import { useDeviceTelemetryWS } from '@/src/features/telemetry/useTelemetryWS';

const logoSrc = typeof sparkLogo === 'object' && sparkLogo && 'src' in sparkLogo 
  ? (sparkLogo as any).src 
  : sparkLogo;

export default function App() {
  const { language, setLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Devices, alerts, and documents are all sourced from the shared telemetry-sync React Query
  // cache (src/features/*) — no local state mirrors needed. React Query dedupes the underlying
  // fetch across these hooks since they share the same query key.
  const queryClient = useQueryClient();
  const { devices } = useDevices();
  const addDeviceMutation = useAddDevice();
  const updateDeviceStatusLocal = useUpdateDeviceStatusLocal();

  const { alerts } = useAlerts();
  const diagnoseAlertMutation = useDiagnoseAlert();
  const approveAlertActionMutation = useApproveAlertAction();
  const autoDiagnoseAllAlertsMutation = useAutoDiagnoseAllAlerts();

  const { documents } = useDocuments();
  const addDocumentLocal = useAddDocumentLocal();

  const { isLoading: loading, isError, error: queryError, refetch, isFetching } = useTelemetrySync();

  // Real-time push layer — no-ops in mock mode (NEXT_PUBLIC_BACKEND_WS_URL unset). Each hook
  // writes straight into the telemetryQueryKey cache that useDevices/useAlerts above read from, so
  // no component below needs to change to receive live updates.
  useDeviceTelemetryWS();
  useDeviceStatusWS();
  useAlertWS();
  useDiagnosisWS();

  // Page level state
  const [diagnosingAll, setDiagnosingAll] = useState(false);

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

  // 1. Diagnose single alert handler
  const handleDiagnose = async (alertId: string) => {
    // Switch to detail view so user can watch live reasoning compilation!
    setSelectedAlertId(alertId);
    setActiveTab('diagnosis-detail');

    try {
      // The mutation's onMutate already sets status to "Diagnosing" optimistically; the real
      // diagnosis (rootCause, timeline, etc.) arrives via the existing 4s poll once the engine's
      // single-concurrency Ollama consumer actually completes the LLM call, not synchronously
      // from this request.
      const updatedAlert = await diagnoseAlertMutation.mutateAsync(alertId);
      triggerNotification(`Diagnosis started for ${updatedAlert.device} — results will appear shortly.`);
    } catch (err: any) {
      console.error(err);
      triggerNotification(`Error: Failed to start AI diagnosis.`);
    }
  };

  // 2. Approve action plan handler
  const handleApproveAction = async (alertId: string) => {
    try {
      await approveAlertActionMutation.mutateAsync(alertId);
      triggerNotification(`Action plan approved.`);
    } catch (err: any) {
      console.error(err);
      triggerNotification(`Error: Failed to approve action plan.`);
    }
  };

  // 3. Bulk auto-diagnose pending alerts handler
  const handleAutoDiagnoseAll = async () => {
    setDiagnosingAll(true);
    triggerNotification('Diagnosis requests sent for all pending alerts...');
    try {
      await autoDiagnoseAllAlertsMutation.mutateAsync();
      triggerNotification('Diagnosis started for all pending alerts — results will appear shortly.');
    } catch (err: any) {
      console.error(err);
      triggerNotification('Error while requesting auto-diagnosis.');
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
        newDev = await addDeviceMutation.mutateAsync(deviceData);
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
        addFallbackDeviceToCache(queryClient, newDev);
      }

      triggerNotification(`Node "${newDev.name}" successfully provisioned at ${newDev.location}.`);
    } catch (err: any) {
      console.error(err);
      triggerNotification('Error: Failed to register custom telemetry node.');
    }
  };

  const handleUpdateDeviceStatus = useCallback((deviceId: string, newStatus: 'ONLINE' | 'OFFLINE' | 'WARNING') => {
    updateDeviceStatusLocal(deviceId, newStatus);
    triggerNotification(`Transceiver ${deviceId} status updated to ${newStatus}.`);
  }, [updateDeviceStatusLocal]);

  // Utility helper for toast notification
  const triggerNotification = (msg: string) => {
    toast(msg);
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
          toast(t('nodeSwitchSuccess', { node: translatedNode }));
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
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center max-w-md mx-auto space-y-4">
              <span className="material-symbols-outlined text-4xl text-[#ffb4ab]">error</span>
              <div>
                <h3 className="font-sans text-base font-bold text-[#ffb4ab]">{t('syncOffline')}</h3>
                <p className="text-[#b9cacb] text-xs mt-1 leading-relaxed">
                  {queryError instanceof Error ? queryError.message : 'Unable to reach the telemetry gateway.'}
                </p>
              </div>
              <button
                onClick={() => refetch()}
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
                  onRefresh={() => refetch()}
                  refreshing={isFetching}
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
                    addDocumentLocal(newDoc);
                    toast(t('uploadSuccessMsg'));
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
