import type { Sensor } from '../types/sensor';

interface Props {
  sensor: Sensor;
  onClose: () => void;
}

// Placeholder — real chart coming next
export function SensorChart({ sensor, onClose }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          {sensor.id} — {sensor.type}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕ Close
        </button>
      </div>
      <p className="text-gray-500">Chart loading...</p>
    </div>
  );
}
