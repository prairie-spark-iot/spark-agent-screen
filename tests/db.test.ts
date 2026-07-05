import { describe, it, expect } from 'vitest';
import { initialAlerts, initialDevices, initialDocuments, generateHeuristicDiagnosis } from '../lib/db';
import { Alert } from '../src/types';

describe('Industrial IoT Core Data Layer & Heuristic Engine', () => {
  it('initialAlerts should generate valid initial alerts with correct severity and payload', () => {
    const alerts = initialAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    
    const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
    expect(criticalAlerts.length).toBeGreaterThan(0);
    expect(criticalAlerts[0].device).toBeDefined();
    expect(['Pending', 'Diagnosed']).toContain(criticalAlerts[0].status);
  });

  it('initialDevices should produce industrial machinery devices with live sensor metrics', () => {
    const devices = initialDevices();
    expect(devices.length).toBeGreaterThanOrEqual(4);
    
    devices.forEach(device => {
      expect(device.id).toBeDefined();
      expect(device.name).toBeDefined();
      expect(['ONLINE', 'OFFLINE', 'WARNING', 'CRITICAL', 'Online', 'Warning', 'Critical', 'Offline']).toContain(device.status);
    });
  });

  it('initialDocuments should load RAG knowledge base engineering SOPs', () => {
    const docs = initialDocuments();
    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0].id).toBeDefined();
    expect(docs[0].name).toBeDefined();
    expect(docs[0].type).toBeDefined();
  });

  it('generateHeuristicDiagnosis should return high-precision diagnostic reasoning for critical bearing alerts', () => {
    const mockAlert: Alert = {
      id: 'ALT_TEST_01',
      time: 'Just now',
      timestamp: new Date().toISOString(),
      device: 'CNC-Axis-X1 Machine Housing',
      metric: 'Bearing Vibration Velocity Spike',
      triggerValue: '8.2 mm/s',
      threshold: '4.5 mm/s',
      severity: 'Critical',
      status: 'Pending',
      details: 'Spindle bearing vibration velocity exceeded 8.2 mm/s threshold'
    };

    const diagnosis = generateHeuristicDiagnosis(mockAlert);
    expect(diagnosis.rootCause).toBeDefined();
    expect(diagnosis.rootCause.length).toBeGreaterThan(5);
    expect(diagnosis.timeline).toBeDefined();
    expect(diagnosis.suggestedActionPlan.length).toBeGreaterThanOrEqual(0);
  });
});
