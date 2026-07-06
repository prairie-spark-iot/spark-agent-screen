import { describe, it, expect } from 'vitest';
import { mapEngineDeviceToUiDevice, EngineDevice } from '../lib/adapters/deviceAdapter';

describe('mapEngineDeviceToUiDevice', () => {
  it('maps an online device with telemetry to the legacy single-metric Device shape', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_INJ_001',
      deviceName: '1号注塑机',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [
        { deviceKey: 'DK_INJ_001', identifier: 'temperature', value: '235.5', valueNum: 235.5, quality: 1, reportTime: '2026-07-05T09:14:20' },
        { deviceKey: 'DK_INJ_001', identifier: 'pressure', value: '156.2', valueNum: 156.2, quality: 1, reportTime: '2026-07-05T09:14:20' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.id).toBe('DK_INJ_001');
    expect(device.name).toBe('1号注塑机');
    expect(device.status).toBe('ONLINE');
    expect(device.metricName).toBe('TEMPERATURE');
    expect(device.value).toBe('235.5');
    expect(device.unit).toBe('℃');
    expect(device.icon).toBe('precision_manufacturing');
  });

  it('always returns exactly 9 sparkline points so fixed-index chart rendering never sees undefined', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_INJ_001',
      deviceName: '1号注塑机',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [
        { deviceKey: 'DK_INJ_001', identifier: 'temperature', value: '235.5', valueNum: 235.5, quality: 1, reportTime: '2026-07-05T09:14:20' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.sparkline).toHaveLength(9);
    device.sparkline.forEach(point => expect(point).toBe(235.5));
  });

  it('maps an offline device to OFFLINE status', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_CMP_001',
      deviceName: '1号空压机',
      productKey: 'PK_COMPRESSOR_GA',
      online: false,
      telemetry: [
        { deviceKey: 'DK_CMP_001', identifier: 'pressure', value: '8.1', valueNum: 8.1, quality: 1, reportTime: '2026-07-05T09:14:20' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.status).toBe('OFFLINE');
  });

  it('device with no telemetry yet falls back to safe non-undefined placeholders', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_NEW_001',
      deviceName: 'Newly Provisioned Device',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.value).toBe('--');
    expect(device.unit).toBeDefined();
    expect(device.metricName).toBeDefined();
    expect(device.sparkline).toHaveLength(9);
    device.sparkline.forEach(point => expect(point).toBe(0));
  });

  it('unknown identifier falls back to an uppercased label and empty unit', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_TEST',
      deviceName: 'Test Device',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [
        { deviceKey: 'DK_TEST', identifier: 'some_new_metric', value: '1.0', valueNum: 1.0, quality: 1, reportTime: '2026-07-05T09:14:20' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.metricName).toBe('SOME_NEW_METRIC');
    expect(device.unit).toBe('');
  });

  it('unknown or null productKey falls back to the default icon instead of throwing', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_TEST',
      deviceName: 'Test Device',
      productKey: null,
      online: true,
      telemetry: [],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.icon).toBe('precision_manufacturing');
  });

  // Real live-engine payloads return telemetry ordered alphabetically by identifier (an artifact
  // of the query, not a semantic ordering) — e.g. an injection molder returns
  // [current, pressure, temperature], and a temperature controller returns [humidity,
  // temperature]. Blindly taking telemetry[0] headlines the wrong metric (CURRENT instead of
  // TEMPERATURE for a molder; HUMIDITY instead of TEMPERATURE for a temp controller) — this is
  // the "data mismatch" observed in real E2E testing.
  it('prefers the product-appropriate primary metric over array position when telemetry is alphabetically ordered', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_INJ_002',
      deviceName: 'injection_02',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [
        { deviceKey: 'DK_INJ_002', identifier: 'current', value: '38.7', valueNum: 38.7, quality: 1, reportTime: '2026-07-04T16:56:54.193' },
        { deviceKey: 'DK_INJ_002', identifier: 'pressure', value: '115.9', valueNum: 115.9, quality: 1, reportTime: '2026-07-04T16:56:54.193' },
        { deviceKey: 'DK_INJ_002', identifier: 'temperature', value: '233.0', valueNum: 233.0, quality: 1, reportTime: '2026-07-04T16:56:54.193' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.metricName).toBe('TEMPERATURE');
    expect(device.value).toBe('233.0');
  });

  it('prefers temperature over humidity for a temperature-controller product', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_TC_001',
      deviceName: 'tempctrl_01',
      productKey: 'PK_TEMPCTRL_TC100',
      online: true,
      telemetry: [
        { deviceKey: 'DK_TC_001', identifier: 'humidity', value: '58.5', valueNum: 58.5, quality: 1, reportTime: '2026-07-04T16:56:49.83' },
        { deviceKey: 'DK_TC_001', identifier: 'temperature', value: '21.0', valueNum: 21.0, quality: 1, reportTime: '2026-07-04T16:56:49.83' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.metricName).toBe('TEMPERATURE');
    expect(device.value).toBe('21.0');
  });

  it('falls back to the first available metric when the preferred one is absent from telemetry', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_INJ_001',
      deviceName: 'injection_01',
      productKey: 'PK_INJECTION_MA',
      online: true,
      telemetry: [
        { deviceKey: 'DK_INJ_001', identifier: 'current', value: '34.0', valueNum: 34.0, quality: 1, reportTime: '2026-07-04T16:56:54.76' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.metricName).toBe('CURRENT');
    expect(device.value).toBe('34.0');
  });

  it('falls back to the first available metric for a product with no configured preference', () => {
    const engineDevice: EngineDevice = {
      deviceKey: 'DK_TEST',
      deviceName: 'Test Device',
      productKey: 'PK_UNKNOWN_PRODUCT',
      online: true,
      telemetry: [
        { deviceKey: 'DK_TEST', identifier: 'pressure', value: '5.0', valueNum: 5.0, quality: 1, reportTime: '2026-07-05T09:14:20' },
      ],
    };

    const device = mapEngineDeviceToUiDevice(engineDevice);

    expect(device.metricName).toBe('PRESSURE');
    expect(device.value).toBe('5.0');
  });
});
