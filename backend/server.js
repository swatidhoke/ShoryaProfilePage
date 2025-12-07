const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files from ../frontend
const path = require('path');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Fallback to index.html for root / SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// // simple API route
// app.get('/api/welcome', (req, res) => {
//   res.json({ message: `Hello Swati from backend! ${PORT}` });
// });

// health check for uptime monitors
app.get('/health', (req, res) => res.sendStatus(200));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});
