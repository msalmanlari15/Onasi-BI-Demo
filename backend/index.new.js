const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Adjust the path if needed
const dbPath = path.join(__dirname, '../healthcare_bi_demo.db');
let db;
try {
  db = new Database(dbPath);
  console.log('Connected to SQLite database.');
} catch (err) {
  console.error('Could not connect to database', err);
  process.exit(1);
}

// Example endpoint: Get all patients
app.get('/api/patients', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM PopulationAnalytics').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Financial Monitoring
app.get('/api/financial', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM FinancialMonitoring').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CDSS Alerts
app.get('/api/alerts', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM CDSSAlerts').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Performance Dashboard
app.get('/api/performance', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM PerformanceDashboard').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
