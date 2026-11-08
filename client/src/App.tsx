import { useState } from 'react';
import { useSensors } from './hooks/useSensors';
import { Header } from './components/Header';
import { SensorCard } from './components/SensorCard';
import { SensorChart } from './components/SensorChart';

export function App() {
  const { sensors, connected } = useSensors();
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const alertCount = sensors.reduce((n, s) => n + s.alerts.length, 0);
  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || null;

  return (
    <div className="min-h-screen">
      <Header
        connected={connected}
        sensorCount={sensors.length}
        alertCount={alertCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {sensors.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Waiting for sensor data...</p>
            <p className="text-sm mt-2">Start the simulator with <code className="bg-gray-100 px-2 py-0.5 rounded">npm run simulate</code></p>
          </div>
        ) : (
          <>
            {/* Sensor grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sensors.map((sensor) => (
                <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  onClick={setSelectedSensorId}
                />
              ))}
            </div>

            {/* Chart panel */}
            {selectedSensor && (
              <SensorChart
                sensor={selectedSensor}
                onClose={() => setSelectedSensorId(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
