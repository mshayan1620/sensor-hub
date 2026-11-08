const express = require('express');

function createApiRoutes(store) {
  const router = express.Router();

  // Get all sensors with their latest status
  router.get('/sensors', (_req, res) => {
    res.json(store.getAllSensors());
  });

  // Get a single sensor's details
  router.get('/sensors/:id', (req, res) => {
    const sensor = store.getSensor(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(sensor);
  });

  // Get historical readings for a sensor
  router.get('/sensors/:id/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const history = store.getHistory(req.params.id, limit);
    res.json(history);
  });

  // Health check
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  return router;
}

module.exports = { createApiRoutes };
