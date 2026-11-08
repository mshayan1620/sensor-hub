const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { SensorStore } = require('./services/sensorStore');
const { createApiRoutes } = require('./routes/api');

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with CORS for the dev client
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// In-memory store for sensor readings
const store = new SensorStore();

// REST routes
app.use('/api', createApiRoutes(store));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current sensor states on connect
  socket.emit('sensors:init', store.getAllSensors());

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Expose io and store so the simulator can push data
app.set('io', io);
app.set('store', store);

// Internal endpoint for the simulator to push readings
app.post('/api/readings', (req, res) => {
  const { sensorId, type, value, unit } = req.body;

  if (!sensorId || !type || value === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reading = store.addReading(sensorId, type, value, unit);
  const sensor = store.getSensor(sensorId);

  // Broadcast the new reading to all connected clients
  io.emit('sensor:reading', { sensorId, reading, sensor });

  res.json({ ok: true, reading });
});

httpServer.listen(PORT, () => {
  console.log(`SensorHub server running on http://localhost:${PORT}`);
});
