# SensorHub — IoT Monitoring Dashboard

Real-time IoT sensor monitoring dashboard built with React, Node.js, and WebSocket. Visualizes live temperature, humidity, and pressure data from simulated (or real) IoT sensors with alert thresholds and historical charts.

## Architecture

```
┌────────────────┐     HTTP POST      ┌──────────────────┐     WebSocket     ┌────────────────┐
│   Simulator    │ ──────────────────► │   Express API    │ ◄──────────────── │  React Client  │
│  (Node.js)     │   /api/readings     │  + Socket.IO     │   sensor:reading  │  + Recharts    │
│                │                     │                  │   sensors:init    │  + Tailwind    │
│  Generates     │                     │  In-memory store │                   │                │
│  fake sensor   │                     │  Alert engine    │  GET /api/sensors │  Live charts   │
│  readings      │                     │  REST + WS       │ ◄──────────────── │  Sensor cards  │
└────────────────┘                     └──────────────────┘                   └────────────────┘
```

## Features

- **Real-time data** — WebSocket pushes sensor updates to all connected clients
- **Interactive charts** — Click any sensor card to see historical readings with Recharts
- **Alert thresholds** — Visual warnings when sensors go out of range
- **Sensor status** — Online/warning/offline indicators with live pulse
- **Responsive grid** — Works on desktop and mobile
- **REST API** — Query sensors and historical data programmatically
- **Built-in simulator** — No hardware needed to demo the full system

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/mshayan1620/sensor-hub.git
cd sensor-hub

# 2. Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# 3. Copy environment config
cp .env.example .env

# 4. Start everything (server + client)
npm run dev

# 5. In another terminal, start the sensor simulator
npm run simulate
```

Open **http://localhost:5173** to see the dashboard.

## Docker

```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sensors` | List all sensors with latest readings |
| `GET` | `/api/sensors/:id` | Get a single sensor's details |
| `GET` | `/api/sensors/:id/history?limit=50` | Historical readings for a sensor |
| `POST` | `/api/readings` | Push a new sensor reading |
| `GET` | `/api/health` | Server health check |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `sensors:init` | Server → Client | All current sensor data on connect |
| `sensor:reading` | Server → Client | New reading from any sensor |

## Running Tests

```bash
npm test
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Recharts, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO
- **Simulator:** Node.js with random-walk data generation
- **Infra:** Docker Compose, Vite

## Alert Thresholds

| Sensor Type | Min | Max |
|-------------|-----|-----|
| Temperature | 15°C | 35°C |
| Humidity | 20% | 80% |
| Pressure | 980 hPa | 1050 hPa |

## Screenshots

*Start the simulator and open the dashboard to see live sensor data:*

![Dashboard](https://via.placeholder.com/800x400.png?text=SensorHub+Dashboard)

## License

MIT
