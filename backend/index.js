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

// Only serve static files if the build directory exists
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

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

// API endpoint to get all table names in the database
app.get('/api/tables', (req, res) => {
  try {
    const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    res.json(result[0]?.values.map(row => row[0]) || []);
  } catch (err) {
    console.error('Error fetching table names:', err);
    res.status(500).json({ error: 'Failed to fetch table names' });
  }
});

// API endpoint to get data from any table
app.get('/api/table/:tableName', (req, res) => {
  try {
    const tableName = req.params.tableName;
    // Validate table name to prevent SQL injection
    const validTableResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name = ?;", [tableName]);
    
    if (!validTableResult[0] || validTableResult[0].values.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    const result = db.exec(`SELECT * FROM ${tableName}`);
    res.json(result[0]?.values.map((row, index) => {
      const obj = {};
      result[0].columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    }) || []);
  } catch (err) {
    console.error(`Error fetching data from table:`, err);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
});

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

// Catch-all handler to serve the React app in production only if the build directory exists
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If the build directory doesn't exist, return a 404 for non-API routes
    if (!req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'Not found' });
    }
  }
});

// Initialize the database and start the server
loadDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
