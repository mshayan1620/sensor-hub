interface Props {
  connected: boolean;
  sensorCount: number;
  alertCount: number;
}

export function Header({ connected, sensorCount, alertCount }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SensorHub</h1>
            <p className="text-xs text-gray-500">IoT Monitoring Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <span className="text-gray-300">|</span>

          <span className="text-gray-600">{sensorCount} sensors</span>

          {alertCount > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-amber-600 font-medium">
                {alertCount} alert{alertCount !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
