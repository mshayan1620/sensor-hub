export interface Reading {
  value: number;
  timestamp: string;
}

export interface Alert {
  level: 'warning' | 'critical';
  message: string;
}

export interface Sensor {
  id: string;
  type: 'temperature' | 'humidity' | 'pressure';
  unit: string;
  status: 'online' | 'offline' | 'warning';
  readings: Reading[];
  lastReading: Reading | null;
  lastSeen?: string;
  alerts: Alert[];
}
