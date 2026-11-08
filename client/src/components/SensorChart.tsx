import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { Sensor } from '../types/sensor';
import { formatTime, formatValue } from '../utils/format';

interface Props {
  sensor: Sensor;
  onClose: () => void;
}

// Alert thresholds (same as server-side)
const thresholds: Record<string, { min: number; max: number }> = {
  temperature: { min: 15, max: 35 },
  humidity: { min: 20, max: 80 },
  pressure: { min: 980, max: 1050 },
};

const lineColors: Record<string, string> = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
  pressure: '#8b5cf6',
};

export function SensorChart({ sensor, onClose }: Props) {
  const chartData = useMemo(
    () =>
      sensor.readings.map((r) => ({
        time: formatTime(r.timestamp),
        value: r.value,
      })),
    [sensor.readings]
  );

  const threshold = thresholds[sensor.type];
  const color = lineColors[sensor.type] || '#6b7280';

  // Compute y-axis domain with some padding
  const values = chartData.map((d) => d.value);
  const dataMin = Math.min(...values, threshold?.min ?? Infinity);
  const dataMax = Math.max(...values, threshold?.max ?? -Infinity);
  const padding = (dataMax - dataMin) * 0.1 || 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900">
            {sensor.id}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {sensor.type} — {sensor.lastReading ? formatValue(sensor.lastReading.value, sensor.type) : '—'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded hover:bg-gray-100"
        >
          ✕ Close
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
            />
            <YAxis
              domain={[dataMin - padding, dataMax + padding]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />

            {/* Threshold reference lines */}
            {threshold && (
              <>
                <ReferenceLine
                  y={threshold.max}
                  stroke="#fbbf24"
                  strokeDasharray="5 5"
                  label={{ value: 'Max', position: 'right', fontSize: 10, fill: '#f59e0b' }}
                />
                <ReferenceLine
                  y={threshold.min}
                  stroke="#fbbf24"
                  strokeDasharray="5 5"
                  label={{ value: 'Min', position: 'right', fontSize: 10, fill: '#f59e0b' }}
                />
              </>
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reading stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Min</p>
          <p className="font-semibold text-gray-700">
            {values.length > 0 ? formatValue(Math.min(...values), sensor.type) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average</p>
          <p className="font-semibold text-gray-700">
            {values.length > 0
              ? formatValue(values.reduce((a, b) => a + b, 0) / values.length, sensor.type)
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Max</p>
          <p className="font-semibold text-gray-700">
            {values.length > 0 ? formatValue(Math.max(...values), sensor.type) : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
