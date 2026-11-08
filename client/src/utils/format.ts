export function formatValue(value: number, type: string): string {
  switch (type) {
    case 'temperature':
      return `${value.toFixed(1)}°C`;
    case 'humidity':
      return `${value.toFixed(1)}%`;
    case 'pressure':
      return `${value.toFixed(0)} hPa`;
    default:
      return String(value);
  }
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function sensorIcon(type: string): string {
  switch (type) {
    case 'temperature':
      return '🌡️';
    case 'humidity':
      return '💧';
    case 'pressure':
      return '🌀';
    default:
      return '📡';
  }
}
