const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const app = express();
const PORT = 4000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Serve static files from the React app build directory in production
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Initialize the database
let db;
const dbFilePath = path.join(__dirname, '../healthcare_bi_demo.db');

// Load the database asynchronously
async function loadDatabase() {
  try {
    // Read the database file
    const filebuffer = fs.readFileSync(dbFilePath);
    
    // Initialize SQL.js
    const SQL = await initSqlJs();
    
    // Create a database instance from the file content
    db = new SQL.Database(filebuffer);
    
    console.log('Database loaded successfully');
  } catch (err) {
    console.error('Error loading database:', err);
    process.exit(1);
  }
}

// API endpoint for patients data
app.get('/api/patients', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM PopulationAnalytics');
    res.json(result[0]?.values.map((row, index) => {
      const obj = {};
      result[0].columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    }) || []);
  } catch (err) {
    console.error('Error fetching patients data:', err);
    res.status(500).json({ error: 'Failed to fetch patients data' });
  }
});

// API endpoint for financial data
app.get('/api/financial', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM FinancialMonitoring');
    res.json(result[0]?.values.map((row, index) => {
      const obj = {};
      result[0].columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    }) || []);
  } catch (err) {
    console.error('Error fetching financial data:', err);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// API endpoint for alerts data
app.get('/api/alerts', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM CDSSAlerts');
    res.json(result[0]?.values.map((row, index) => {
      const obj = {};
      result[0].columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    }) || []);
  } catch (err) {
    console.error('Error fetching alerts data:', err);
    res.status(500).json({ error: 'Failed to fetch alerts data' });
  }
});

// API endpoint for performance data
app.get('/api/performance', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM PerformanceDashboard');
    res.json(result[0]?.values.map((row, index) => {
      const obj = {};
      result[0].columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    }) || []);
  } catch (err) {
    console.error('Error fetching performance data:', err);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// Catch-all handler to serve the React app in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Initialize the database and start the server
loadDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
