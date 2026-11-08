import type { Sensor } from '../types/sensor';

interface Props {
  sensors: Sensor[];
}

export function AlertBanner({ sensors }: Props) {
  const allAlerts = sensors.flatMap((s) =>
    s.alerts.map((a) => ({ ...a, sensorId: s.id, type: s.type }))
  );

  if (allAlerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {allAlerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
            alert.level === 'critical'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          <span className="font-medium">{alert.sensorId}</span>
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
}
