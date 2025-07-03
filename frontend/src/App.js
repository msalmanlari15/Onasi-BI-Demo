import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { Menu, X, LayoutDashboard, TableIcon } from 'lucide-react';

// Import Shadcn UI components
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { AdvancedSidebar } from './components/ui/advanced-sidebar';
import { RevenueCycleDashboard } from './components/RevenueCycleDashboard';

// Import Tailwind CSS
import './index.css';
import './globals.css';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']; // Used only for demo/patients chart. All theme tokens are in globals.css.

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [financial, setFinancial] = useState([]);
  
  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  // State variables for tables functionality
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [view, setView] = useState('revenue-cycle'); // 'dashboard', 'table', or 'revenue-cycle'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Match sidebar's default collapsed state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, alertsRes, performanceRes, financialRes, tablesRes] = await Promise.all([
          axios.get(`${API_URL}/api/patients`),
          axios.get(`${API_URL}/api/alerts`),
          axios.get(`${API_URL}/api/performance`),
          axios.get(`${API_URL}/api/financial`),
          axios.get(`${API_URL}/api/tables`)
        ]);
        
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
        setPerformance(performanceRes.data);
        setFinancial(financialRes.data);
        setTables(tablesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check if the backend server is running.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch data for a specific table when selected
  useEffect(() => {
    if (selectedTable) {
      const fetchTableData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/table/${selectedTable}`);
          setTableData(response.data);
        } catch (err) {
          console.error(`Error fetching data for table ${selectedTable}:`, err);
          setTableData([]);
        }
      };
      
      fetchTableData();
    }
  }, [selectedTable]);

  // Handle table selection
  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    setView('table');
  };

  // Sort financial data by month
  const sortedFinancial = [...financial].sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });



  // Toggle between dashboard and table view
  const toggleView = (newView) => {
    setView(newView);
  };
  
  // Handle sidebar collapse state change
  const handleSidebarCollapseChange = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-destructive text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Advanced Sidebar - Fixed position */}
        <div className="fixed left-0 top-0 md:block h-screen overflow-hidden">
          <AdvancedSidebar 
            tables={tables} 
            selectedTable={selectedTable} 
            onTableSelect={handleTableSelect} 
            onViewChange={toggleView} 
            currentView={view} 
            onCollapseChange={handleSidebarCollapseChange}
          />
        </div>

        {/* Main content - With left margin to accommodate the fixed sidebar */}
        <main className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} flex-1 p-4 overflow-auto rounded-lg`}>
          {view === 'revenue-cycle' ? (
            <RevenueCycleDashboard />
          ) : view === 'dashboard' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Patient Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={patients}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="age"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {patients.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Financial Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sortedFinancial}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Clinical Decision Support Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>CDSS Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alerts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="efficiency" fill="#8884d8" />
                      <Bar dataKey="satisfaction" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTable ? `Table: ${selectedTable}` : 'Select a table'}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  tableData.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(tableData[0]).map((key) => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, i) => (
                            <TableRow key={i}>
                              {Object.values(row).map((value, j) => (
                                <TableCell key={j}>{value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">No data available for this table</div>
                  )
                ) : (
                  <div className="text-center py-4">Please select a table from the sidebar</div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
