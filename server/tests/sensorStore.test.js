const { describe, it } = require('node:test');
const assert = require('node:assert');
const { SensorStore } = require('../src/services/sensorStore');

describe('SensorStore', () => {
  it('should create a sensor on first reading', () => {
    const store = new SensorStore();
    store.addReading('temp-001', 'temperature', 22.5, '°C');

    const sensor = store.getSensor('temp-001');
    assert.ok(sensor);
    assert.strictEqual(sensor.type, 'temperature');
    assert.strictEqual(sensor.readings.length, 1);
    assert.strictEqual(sensor.lastReading.value, 22.5);
  });

  it('should accumulate readings for the same sensor', () => {
    const store = new SensorStore();
    store.addReading('hum-001', 'humidity', 55, '%');
    store.addReading('hum-001', 'humidity', 58, '%');
    store.addReading('hum-001', 'humidity', 52, '%');

    const sensor = store.getSensor('hum-001');
    assert.strictEqual(sensor.readings.length, 3);
    assert.strictEqual(sensor.lastReading.value, 52);
  });

  it('should enforce max readings limit', () => {
    const store = new SensorStore(5);

    for (let i = 0; i < 10; i++) {
      store.addReading('temp-001', 'temperature', 20 + i);
    }

    const sensor = store.getSensor('temp-001');
    assert.strictEqual(sensor.readings.length, 5);
    // Should keep the last 5 readings (values 25-29)
    assert.strictEqual(sensor.readings[0].value, 25);
  });

  it('should set status to warning when above threshold', () => {
    const store = new SensorStore();
    store.addReading('temp-001', 'temperature', 40);

    const sensor = store.getSensor('temp-001');
    assert.strictEqual(sensor.status, 'warning');
    assert.ok(sensor.alerts.length > 0);
  });

  it('should set status to online when within thresholds', () => {
    const store = new SensorStore();
    store.addReading('temp-001', 'temperature', 22);

    const sensor = store.getSensor('temp-001');
    assert.strictEqual(sensor.status, 'online');
    assert.strictEqual(sensor.alerts.length, 0);
  });

  it('should return all sensors', () => {
    const store = new SensorStore();
    store.addReading('temp-001', 'temperature', 22);
    store.addReading('hum-001', 'humidity', 55);
    store.addReading('pres-001', 'pressure', 1013);

    const all = store.getAllSensors();
    assert.strictEqual(all.length, 3);
  });

  it('should return history for a sensor', () => {
    const store = new SensorStore();
    for (let i = 0; i < 10; i++) {
      store.addReading('temp-001', 'temperature', 20 + i);
    }

    const history = store.getHistory('temp-001', 5);
    assert.strictEqual(history.length, 5);
  });

  it('should return empty array for unknown sensor history', () => {
    const store = new SensorStore();
    const history = store.getHistory('nonexistent');
    assert.deepStrictEqual(history, []);
  });
});
