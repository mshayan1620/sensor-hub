/**
 * In-memory store for sensor data.
 * Keeps the last N readings per sensor and tracks sensor status.
 */
class SensorStore {
  constructor(maxReadings = 100) {
    this.sensors = new Map();
    this.maxReadings = maxReadings;
  }

  addReading(sensorId, type, value, unit) {
    if (!this.sensors.has(sensorId)) {
      this.sensors.set(sensorId, {
        id: sensorId,
        type,
        unit: unit || this._defaultUnit(type),
        status: 'online',
        readings: [],
        lastReading: null,
        alerts: [],
      });
    }

    const sensor = this.sensors.get(sensorId);
    const reading = {
      value,
      timestamp: new Date().toISOString(),
    };

    sensor.readings.push(reading);
    sensor.lastReading = reading;
    sensor.lastSeen = reading.timestamp;

    // Keep only the most recent readings
    if (sensor.readings.length > this.maxReadings) {
      sensor.readings = sensor.readings.slice(-this.maxReadings);
    }

    // Check alert thresholds
    sensor.alerts = this._checkAlerts(sensor);
    sensor.status = sensor.alerts.length > 0 ? 'warning' : 'online';

    return reading;
  }

  getSensor(sensorId) {
    return this.sensors.get(sensorId) || null;
  }

  getAllSensors() {
    return Array.from(this.sensors.values()).map((s) => ({
      ...s,
      readings: s.readings.slice(-20),
    }));
  }

  getHistory(sensorId, limit = 50) {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) return [];
    return sensor.readings.slice(-limit);
  }

  // Default thresholds for common sensor types
  _checkAlerts(sensor) {
    const thresholds = {
      temperature: { min: 15, max: 35, unit: '°C' },
      humidity: { min: 20, max: 80, unit: '%' },
      pressure: { min: 980, max: 1050, unit: 'hPa' },
    };

    const t = thresholds[sensor.type];
    if (!t || !sensor.lastReading) return [];

    const val = sensor.lastReading.value;
    const alerts = [];

    if (val < t.min) {
      alerts.push({ level: 'warning', message: `${sensor.type} below ${t.min}${t.unit}` });
    }
    if (val > t.max) {
      alerts.push({ level: 'critical', message: `${sensor.type} above ${t.max}${t.unit}` });
    }

    return alerts;
  }

  _defaultUnit(type) {
    const units = { temperature: '°C', humidity: '%', pressure: 'hPa' };
    return units[type] || '';
  }
}

module.exports = { SensorStore };
