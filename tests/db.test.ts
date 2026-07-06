import { describe, it, expect } from 'vitest';
import { initialAlerts, initialDevices, initialDocuments } from '../lib/db';

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
});
