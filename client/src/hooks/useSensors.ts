import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Sensor, Reading } from '../types/sensor';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export function useSensors() {
  const [sensors, setSensors] = useState<Map<string, Sensor>>(new Map());
  const [connected, setConnected] = useState(false);

  const updateSensor = useCallback(
    (data: { sensorId: string; reading: Reading; sensor: Sensor }) => {
      setSensors((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.sensorId);

        if (existing) {
          const updatedReadings = [...existing.readings, data.reading].slice(-50);
          next.set(data.sensorId, {
            ...data.sensor,
            readings: updatedReadings,
          });
        } else {
          next.set(data.sensorId, data.sensor);
        }

        return next;
      });
    },
    []
  );

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Initial sensor data on connection
    socket.on('sensors:init', (initialSensors: Sensor[]) => {
      const map = new Map<string, Sensor>();
      initialSensors.forEach((s) => map.set(s.id, s));
      setSensors(map);
    });

    // Real-time updates
    socket.on('sensor:reading', updateSensor);

    return () => {
      socket.disconnect();
    };
  }, [updateSensor]);

  return {
    sensors: Array.from(sensors.values()),
    connected,
  };
}
