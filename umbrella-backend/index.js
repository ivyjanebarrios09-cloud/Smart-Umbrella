const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow cross-origin requests (for testing)
app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive umbrella alerts
app.post('/umbrella-alert', (req, res) => {
  const alert = req.body;

  console.log('=== Umbrella Alert Received ===');
  console.log('User ID:', alert.userId);
  console.log('Umbrella ID:', alert.umbrellaId);
  console.log('Message:', alert.message);
  console.log('Type:', alert.type);
  console.log('==============================');

  // Respond to ESP32
  res.status(200).json({ status: 'success', received: alert });
});

// Health check
app.get('/', (req, res) => {
  res.send('Umbrella Alert Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
