import type { Sensor } from '../types/sensor';
import { formatValue, formatTime, sensorIcon } from '../utils/format';

interface Props {
  sensor: Sensor;
  onClick: (id: string) => void;
}

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-amber-500',
};

export function SensorCard({ sensor, onClick }: Props) {
  const currentValue = sensor.lastReading?.value ?? 0;
  const icon = sensorIcon(sensor.type);

  return (
    <button
      onClick={() => onClick(sensor.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5
                 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {sensor.type}
            </h3>
            <p className="text-xs text-gray-500">{sensor.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[sensor.status]}`} />
          <span className="text-xs text-gray-500 capitalize">{sensor.status}</span>
        </div>
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-1">
        {formatValue(currentValue, sensor.type)}
      </div>

      {sensor.lastReading && (
        <p className="text-xs text-gray-400">
          Updated {formatTime(sensor.lastReading.timestamp)}
        </p>
      )}

      {sensor.alerts.length > 0 && (
        <div className="mt-3 space-y-1">
          {sensor.alerts.map((alert, i) => (
            <div
              key={i}
              className={`text-xs px-2 py-1 rounded ${
                alert.level === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              ⚠ {alert.message}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
