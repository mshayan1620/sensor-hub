/**
 * Sensor data simulator.
 * Generates realistic readings for multiple virtual IoT sensors
 * and pushes them to the SensorHub server via HTTP.
 */

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const INTERVAL = parseInt(process.env.SIMULATOR_INTERVAL_MS) || 2000;

// Each sensor drifts around a baseline with some noise
const sensors = [
  { id: 'temp-001', type: 'temperature', baseline: 22, drift: 3, unit: '°C' },
  { id: 'temp-002', type: 'temperature', baseline: 25, drift: 4, unit: '°C' },
  { id: 'hum-001', type: 'humidity', baseline: 55, drift: 10, unit: '%' },
  { id: 'hum-002', type: 'humidity', baseline: 45, drift: 8, unit: '%' },
  { id: 'pres-001', type: 'pressure', baseline: 1013, drift: 15, unit: 'hPa' },
  { id: 'pres-002', type: 'pressure', baseline: 1010, drift: 12, unit: 'hPa' },
];

// Track current values so readings look like a continuous walk
const currentValues = {};
sensors.forEach((s) => {
  currentValues[s.id] = s.baseline;
});

function generateReading(sensor) {
  const prev = currentValues[sensor.id];

  // Random walk: small step in either direction
  const step = (Math.random() - 0.5) * sensor.drift * 0.4;
  let next = prev + step;

  // Gently pull back toward the baseline so it doesn't wander too far
  const pull = (sensor.baseline - next) * 0.05;
  next += pull;

  // Round to one decimal
  next = Math.round(next * 10) / 10;
  currentValues[sensor.id] = next;

  return next;
}

async function pushReading(sensor) {
  const value = generateReading(sensor);

  try {
    const res = await fetch(`${SERVER_URL}/api/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensorId: sensor.id,
        type: sensor.type,
        value,
        unit: sensor.unit,
      }),
    });

    if (!res.ok) {
      console.error(`Failed to push ${sensor.id}: ${res.status}`);
    }
  } catch (err) {
    console.error(`Connection error for ${sensor.id}: ${err.message}`);
  }
}

async function tick() {
  await Promise.all(sensors.map(pushReading));
}

console.log(`Simulator started — pushing to ${SERVER_URL} every ${INTERVAL}ms`);
console.log(`Sensors: ${sensors.map((s) => s.id).join(', ')}`);

// Run immediately, then on interval
tick();
setInterval(tick, INTERVAL);
