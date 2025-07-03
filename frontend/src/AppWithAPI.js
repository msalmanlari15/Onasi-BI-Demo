import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Paper, Typography, AppBar, Toolbar, 
  CssBaseline, ThemeProvider, createTheme, CircularProgress 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
  },
});

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [financial, setFinancial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, alertsRes, performanceRes, financialRes] = await Promise.all([
          axios.get('http://localhost:4000/api/patients'),
          axios.get('http://localhost:4000/api/alerts'),
          axios.get('http://localhost:4000/api/performance'),
          axios.get('http://localhost:4000/api/financial')
        ]);
        
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
        setPerformance(performanceRes.data);
        setFinancial(financialRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check if the backend server is running.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Process data for charts
  const ageData = patients.reduce((acc, p) => {
    const age = p.Age;
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});
  const ageChartData = Object.entries(ageData).map(([age, count]) => ({ age, count }));

  // Alerts by priority
  const priorityData = alerts.reduce((acc, a) => {
    const pr = a.Priority || 'Unknown';
    acc[pr] = (acc[pr] || 0) + 1;
    return acc;
  }, {});
  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({ priority, count }));

  // Average Wait Time by Department
  const waitTimeByDept = performance.reduce((acc, p) => {
    const dept = p.Department || 'Unknown';
    acc[dept] = acc[dept] || { total: 0, count: 0 };
    acc[dept].total += p.WaitTimeMin || 0;
    acc[dept].count += 1;
    return acc;
  }, {});
  const waitTimeChartData = Object.entries(waitTimeByDept).map(([dept, { total, count }]) => ({
    dept,
    avgWait: count ? (total / count).toFixed(1) : 0
  }));

  // Financial data by month
  const financialByMonth = financial.reduce((acc, f) => {
    const month = f.Month || 'Unknown';
    if (!acc[month]) {
      acc[month] = {
        month,
        revenue: 0,
        expenses: 0
      };
    }
    acc[month].revenue += f.Revenue || 0;
    acc[month].expenses += f.Expenses || 0;
    return acc;
  }, {});
  const financialChartData = Object.values(financialByMonth).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Healthcare BI Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Patient Demographics */}
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 340,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Patient Age Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Alerts by Priority */}
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 340,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Alerts by Priority
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="priority"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Wait Time by Department */}
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 340,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Average Wait Time by Department (min)
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waitTimeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dept" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgWait" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Financial Trends */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 340,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Financial Trends
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
