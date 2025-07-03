import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Filter, Search } from 'lucide-react';

// Import extracted components
import Money from './Money';
import PreAuthKPIs from './PreAuthKPIs';
import RevenueCycleFunnel from './charts/RevenueCycleFunnel';
import ClaimStatusChart from './charts/ClaimStatusChart';
import DenialAnalysisChart from './charts/DenialAnalysisChart';
import PayerPerformanceTable from './tables/PayerPerformanceTable';
import FilteredClaimsTable from './tables/FilteredClaimsTable';

// Import new chart components
import ClaimAmountByStatusChart from './charts/ClaimAmountByStatusChart';
import DeptPaidDeniedChart from './charts/DeptPaidDeniedChart';
import MonthlyClaimsTrendChart from './charts/MonthlyClaimsTrendChart';
import DenialReasonsBreakdownChart from './charts/DenialReasonsBreakdownChart';
import ReimbursementTimeDistributionChart from './charts/ReimbursementTimeDistributionChart';
import ClaimsByPayerChart from './charts/ClaimsByPayerChart';
import PreAuthDenialsChart from './charts/PreAuthDenialsChart';
import AvgClaimByCPTChart from './charts/AvgClaimByCPTChart';
import PendingClaimsAgingChart from './charts/PendingClaimsAgingChart';

// Import constants and utilities
import { PRIMARY_COLOR } from '../constants/colors';

export function RevenueCycleDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [selectedClaimStatus, setSelectedClaimStatus] = useState(null);
  const [filteredClaims, setFilteredClaims] = useState([]);
  
  // Filter states
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedPayer, setSelectedPayer] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [payerOptions, setPayerOptions] = useState(['All']);
  const [deptOptions, setDeptOptions] = useState(['All']);

  // Processed data states
  const [funnelData, setFunnelData] = useState([]);
  const [denialData, setDenialData] = useState([]);
  const [payerData, setPayerData] = useState([]);
  const [claimStatusData, setClaimStatusData] = useState([]);
  const [preAuthKPIs, setPreAuthKPIs] = useState({});
  
  // New chart data states
  const [claimAmountByStatusData, setClaimAmountByStatusData] = useState([]);
  const [deptPaidDeniedData, setDeptPaidDeniedData] = useState([]);
  const [monthlyClaimsData, setMonthlyClaimsData] = useState([]);
  const [dailyClaimsData, setDailyClaimsData] = useState([]);
  const [denialReasonsData, setDenialReasonsData] = useState([]);
  const [reimbursementTimeData, setReimbursementTimeData] = useState([]);
  const [claimsByPayerData, setClaimsByPayerData] = useState([]);
  const [preAuthDenialsData, setPreAuthDenialsData] = useState([]);
  const [avgClaimByCPTData, setAvgClaimByCPTData] = useState([]);
  const [pendingClaimsAgingData, setPendingClaimsAgingData] = useState([]);
  const [trendType, setTrendType] = useState('daily'); // 'monthly' or 'daily'

  // Debug: inspect denial reasons data each render
  console.log('denialReasonsData', denialReasonsData);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (financialData.length > 0) {
      applyFilters();
    }
  }, [selectedPayer, selectedDept, dateRange, financialData]);
  
  // Filter data based on selected filters
  const applyFilters = () => {
    let filtered = [...financialData];
    
    // Filter by payer
    if (selectedPayer !== 'All') {
      filtered = filtered.filter(item => item.Payer === selectedPayer);
    }
    
    // Filter by department
    if (selectedDept !== 'All') {
      filtered = filtered.filter(item => item.Dept === selectedDept);
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day
      
      // Find the date field to use for filtering
      const dateField = findDateField(financialData[0]);
      
      if (dateField) {
        filtered = filtered.filter(item => {
          if (!item[dateField]) return false;
          
          const itemDate = new Date(item[dateField]);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
    }
    
    // Update filtered data
    setFilteredData(filtered);
    
    // Re-process data with filtered dataset
    processFinancialData(filtered);
    
    // If claim status was selected, update filtered claims
    if (selectedClaimStatus) {
      const filteredByStatus = filtered.filter(item => 
        (item.ClaimStatus || 'Unknown') === selectedClaimStatus
      );
      setFilteredClaims(filteredByStatus);
    }
  };
  
  // Helper function to find a date field in the data
  const findDateField = (dataItem) => {
    if (!dataItem) return null;
    
    const possibleDateFields = ['ServiceDate', 'ClaimDate', 'Date', 'TransactionDate'];
    
    // Try to find one of the known date fields
    for (const field of possibleDateFields) {
      if (field in dataItem && dataItem[field]) {
        return field;
      }
    }
    
    // If not found, try to find any field with 'date' in its name
    const fieldNames = Object.keys(dataItem);
    const dateField = fieldNames.find(field => 
      field.toLowerCase().includes('date'));
    
    return dateField || null;
  };

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/financial');
      const data = response.data;
      console.log('Raw API data sample:', data.slice(0, 3));
      console.log('API data fields:', data.length > 0 ? Object.keys(data[0]) : 'No data');
      
      // Check specifically for ServiceDate field
      const hasServiceDateField = data.length > 0 && 'ServiceDate' in data[0];
      console.log('Has ServiceDate field?', hasServiceDateField);
      
      // Check case sensitivity of field names
      if (data.length > 0) {
        const firstRecord = data[0];
        const fieldNames = Object.keys(firstRecord);
        console.log('All field names:', fieldNames);
        
        // Check for any date-related fields
        const dateFields = fieldNames.filter(field => 
          field.toLowerCase().includes('date') || 
          field.toLowerCase().includes('time'));
        console.log('Potential date fields:', dateFields);
      }
      if (!data || data.length === 0) {
        setFinancialData([]);
        setError('No data returned from API');
      } else {
        setFinancialData(data);
        setFilteredData(data);
        
        // Extract unique payers and departments for filters
        const payers = ['All', ...new Set(data.map(item => item.Payer).filter(Boolean))];
        const depts = ['All', ...new Set(data.map(item => item.Dept).filter(Boolean))];
        
        setPayerOptions(payers);
        setDeptOptions(depts);
        
        processFinancialData(data);
      }
    } catch (err) {
      setError('Failed to fetch financial data');
      console.error('Error fetching financial data:', err);
      setFinancialData([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create sample trend data
  const createSampleTrendData = (trendsObject) => {
    const currentDate = new Date();
    
    // For monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach((month, index) => {
      const date = new Date(currentDate.getFullYear(), index, 1);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      trendsObject[monthYear] = {
        month: monthYear,
        totalAmount: Math.random() * 100000 + 50000,
        claimCount: Math.floor(Math.random() * 50) + 10
      };
    });
    
    // For daily data (last 14 days)
    const dailyData = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayFormat = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      dailyData.push({
        month: dayFormat,
        totalAmount: Math.random() * 10000 + 5000,
        claimCount: Math.floor(Math.random() * 10) + 1
      });
    }
    
    // Set daily data
    setDailyClaimsData(dailyData);
  };

  const processFinancialData = (data) => {
    // Process Revenue Cycle Funnel Data
    const totalClaimed = data.reduce((sum, item) => sum + (item.ClaimAmount || 0), 0);
    const totalPaid = data.reduce((sum, item) => sum + (item.PaidAmount || 0), 0);
    const totalDenied = data.reduce((sum, item) => sum + (item.DeniedAmount || 0), 0);
    const totalPending = totalClaimed - totalPaid - totalDenied;

    setFunnelData([
      { name: 'Claims Submitted', value: totalClaimed, fill: PRIMARY_COLOR },
      { name: 'Claims Processed', value: totalClaimed - totalPending, fill: '#16a34a' },
      { name: 'Claims Paid', value: totalPaid, fill: '#22c55e' }
    ]);

    // Process Denial Analysis Data
    const denialByReason = {};
    data.forEach(item => {
      if (item.DeniedAmount > 0 && item.ReasonCode) {
        denialByReason[item.ReasonCode] = (denialByReason[item.ReasonCode] || 0) + item.DeniedAmount;
      }
    });

    const denialArray = Object.entries(denialByReason)
      .map(([code, amount]) => ({ reasonCode: code, deniedAmount: amount }))
      .sort((a, b) => b.deniedAmount - a.deniedAmount);

    let cumulativePercentage = 0;
    const totalDeniedForPareto = denialArray.reduce((sum, item) => sum + item.deniedAmount, 0);
    
    const denialWithCumulative = denialArray.map(item => {
      const percentage = (item.deniedAmount / totalDeniedForPareto) * 100;
      cumulativePercentage += percentage;
      return {
        ...item,
        percentage: percentage.toFixed(1),
        cumulative: cumulativePercentage.toFixed(1)
      };
    });

    setDenialData(denialWithCumulative);

    // Process Payer Performance Data
    const payerStats = {};
    data.forEach(item => {
      if (!payerStats[item.Payer]) {
        payerStats[item.Payer] = {
          payer: item.Payer,
          totalClaimed: 0,
          totalPaid: 0,
          totalDenied: 0,
          totalClaims: 0,
          totalReimbursementDays: 0,
          deniedClaims: 0
        };
      }
      
      const stats = payerStats[item.Payer];
      stats.totalClaimed += item.ClaimAmount || 0;
      stats.totalPaid += item.PaidAmount || 0;
      stats.totalDenied += item.DeniedAmount || 0;
      stats.totalClaims += 1;
      stats.totalReimbursementDays += item.ReimbursementDays || 0;
      
      if (item.ClaimStatus === 'Rejected') {
        stats.deniedClaims += 1;
      }
    });

    const payerArray = Object.values(payerStats).map(stats => ({
      ...stats,
      avgReimbursementDays: (stats.totalReimbursementDays / stats.totalClaims).toFixed(1),
      denialRate: ((stats.deniedClaims / stats.totalClaims) * 100).toFixed(1),
      paidToClaimedRatio: ((stats.totalPaid / stats.totalClaimed) * 100).toFixed(1)
    }));

    setPayerData(payerArray);

    // Process Claim Status Data
    const statusCounts = {};
    data.forEach(item => {
      const status = item.ClaimStatus || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusArray = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / data.length) * 100).toFixed(1)
    }));

    setClaimStatusData(statusArray);

    // Process Pre-Authorization Impact
    const preAuthDenied = data.filter(item => item.PreAuthorization === 'Denied');
    const preAuthDeniedAmount = preAuthDenied.reduce((sum, item) => sum + (item.DeniedAmount || 0), 0);
    const preAuthDeniedCount = preAuthDenied.length;
    const avgPreAuthDeniedAmount = preAuthDeniedCount > 0 ? preAuthDeniedAmount / preAuthDeniedCount : 0;

    setPreAuthKPIs({
      totalDeniedAmount: preAuthDeniedAmount,
      deniedClaimsCount: preAuthDeniedCount,
      avgDeniedAmount: avgPreAuthDeniedAmount
    });
    
    // Process Claim Amount by Status Data
    const claimAmountByStatus = {};
    data.forEach(item => {
      const status = item.ClaimStatus || 'Unknown';
      if (!claimAmountByStatus[status]) {
        claimAmountByStatus[status] = {
          status,
          totalAmount: 0,
          count: 0
        };
      }
      claimAmountByStatus[status].totalAmount += item.ClaimAmount || 0;
      claimAmountByStatus[status].count += 1;
    });

    const claimAmountArray = Object.values(claimAmountByStatus).map(item => ({
      ...item,
      avgAmount: item.count > 0 ? item.totalAmount / item.count : 0
    }));

    setClaimAmountByStatusData(claimAmountArray);
    
    // Process Department Paid vs Denied Data
    const deptPaymentData = {};
    data.forEach(item => {
      const dept = item.Dept || 'Unknown';
      if (!deptPaymentData[dept]) {
        deptPaymentData[dept] = {
          dept,
          totalPaid: 0,
          totalDenied: 0
        };
      }
      deptPaymentData[dept].totalPaid += item.PaidAmount || 0;
      deptPaymentData[dept].totalDenied += item.DeniedAmount || 0;
    });

    setDeptPaidDeniedData(Object.values(deptPaymentData));
    
    // Process Monthly Claims Trend Data
    const monthlyTrends = {};
    console.log('Processing monthly claims data from', data.length, 'records');
    
    // Find the date field - check for different possible names
    let dateFieldName = null;
    const possibleDateFields = ['ServiceDate', 'servicedate', 'service_date', 'Date', 'ClaimDate', 'claim_date'];
    
    if (data.length > 0) {
      const firstRecord = data[0];
      for (const field of possibleDateFields) {
        if (field in firstRecord && firstRecord[field]) {
          dateFieldName = field;
          break;
        }
      }
    }
    
    console.log('Found date field name:', dateFieldName);
    
    // If no date field found, try to find any field with 'date' in the name
    if (!dateFieldName && data.length > 0) {
      const firstRecord = data[0];
      const fieldNames = Object.keys(firstRecord);
      const dateField = fieldNames.find(field => 
        field.toLowerCase().includes('date'));
      
      if (dateField) {
        dateFieldName = dateField;
        console.log('Found alternative date field:', dateFieldName);
      }
    }
    
    // Process data with the found date field
    if (dateFieldName) {
      // Sample a few records to debug
      console.log('Sample records with date field:', 
        data.slice(0, 3).map(item => ({
          DateField: item[dateFieldName],
          ClaimAmount: item.ClaimAmount
        })));
      
      // Create some sample data if none exists
      if (data.length === 0 || !dateFieldName) {
        console.log('Creating sample trend data for demonstration');
        createSampleTrendData(monthlyTrends);
      } else {
        // Process actual data for both monthly and daily trends
        const dailyTrends = {}; // For daily trend data
        
        data.forEach(item => {
          if (item[dateFieldName]) {
            try {
              const date = new Date(item[dateFieldName]);
              
              // Check if date is valid
              if (!isNaN(date.getTime())) {
                // Format for monthly trend
                const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                
                if (!monthlyTrends[monthYear]) {
                  monthlyTrends[monthYear] = {
                    month: monthYear,
                    totalAmount: 0,
                    claimCount: 0
                  };
                }
                
                monthlyTrends[monthYear].totalAmount += item.ClaimAmount || 0;
                monthlyTrends[monthYear].claimCount += 1;
                
                // Format for daily trend
                const dayFormat = date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
                
                if (!dailyTrends[dayFormat]) {
                  dailyTrends[dayFormat] = {
                    month: dayFormat, // Using 'month' as the key for consistency with chart
                    totalAmount: 0,
                    claimCount: 0
                  };
                }
                
                dailyTrends[dayFormat].totalAmount += item.ClaimAmount || 0;
                dailyTrends[dayFormat].claimCount += 1;
              } else {
                console.log('Invalid date:', item[dateFieldName]);
              }
            } catch (error) {
              console.error('Error processing date:', error);
            }
          }
        });
        
        // Store daily trend data in state for later use
        const dailyTrendsArray = Object.values(dailyTrends);
        dailyTrendsArray.sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA - dateB;
        });
        
        // Store daily trend data in a separate state variable
        setDailyClaimsData(dailyTrendsArray);
      }
    } else {
      // Create sample data if no date field found
      console.log('No date field found. Creating sample data.');
      createSampleTrendData(monthlyTrends);
    }
    
    // Convert to array and sort by date
    const monthlyTrendsArray = Object.values(monthlyTrends);
    console.log('Monthly trends processed:', monthlyTrendsArray);
    
    monthlyTrendsArray.sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });
    
    console.log('Sorted monthly trends:', monthlyTrendsArray);
    setMonthlyClaimsData(monthlyTrendsArray);
    
    // Process Denial Reasons Breakdown Data
    const denialReasons = {};
    data.forEach(item => {
      if (item.DeniedAmount > 0 && item.ReasonCode) {
        const reason = item.ReasonCode;
        if (!denialReasons[reason]) {
          denialReasons[reason] = {
            reason,
            count: 0,
            amount: 0
          };
        }
        denialReasons[reason].count += 1;
        denialReasons[reason].amount += item.DeniedAmount || 0;
      }
    });
    
    // Convert to array and sort by count
    const denialReasonsArray = Object.values(denialReasons);
    denialReasonsArray.sort((a, b) => b.count - a.count);
    
    setDenialReasonsData(denialReasonsArray);
    
    // Process Reimbursement Time Distribution Data
    const reimbursementBuckets = {
      '0-15 days': { range: '0-15 days', count: 0 },
      '16-30 days': { range: '16-30 days', count: 0 },
      '31-45 days': { range: '31-45 days', count: 0 },
      '46-60 days': { range: '46-60 days', count: 0 },
      '61-90 days': { range: '61-90 days', count: 0 },
      '90+ days': { range: '90+ days', count: 0 }
    };
    
    data.forEach(item => {
      if (item.ReimbursementDays !== null && item.ReimbursementDays !== undefined) {
        const days = item.ReimbursementDays;
        
        if (days <= 15) {
          reimbursementBuckets['0-15 days'].count += 1;
        } else if (days <= 30) {
          reimbursementBuckets['16-30 days'].count += 1;
        } else if (days <= 45) {
          reimbursementBuckets['31-45 days'].count += 1;
        } else if (days <= 60) {
          reimbursementBuckets['46-60 days'].count += 1;
        } else if (days <= 90) {
          reimbursementBuckets['61-90 days'].count += 1;
        } else {
          reimbursementBuckets['90+ days'].count += 1;
        }
      }
    });
    
    setReimbursementTimeData(Object.values(reimbursementBuckets));
    
    // Process Claims by Payer Data
    const payerClaims = {};
    data.forEach(item => {
      const payer = item.Payer || 'Unknown';
      if (!payerClaims[payer]) {
        payerClaims[payer] = {
          name: payer,
          totalAmount: 0,
          count: 0
        };
      }
      payerClaims[payer].totalAmount += item.ClaimAmount || 0;
      payerClaims[payer].count += 1;
    });
    
    // Convert to array and sort by total amount
    const payerClaimsArray = Object.values(payerClaims);
    payerClaimsArray.sort((a, b) => b.totalAmount - a.totalAmount);
    
    setClaimsByPayerData(payerClaimsArray);
    
    // Process Pre-Auth Denials Data
    const preAuthData = [
      { category: 'With Pre-Auth', deniedAmount: 0, claimCount: 0 },
      { category: 'Without Pre-Auth', deniedAmount: 0, claimCount: 0 }
    ];
    
    data.forEach(item => {
      if (item.DeniedAmount > 0) {
        const hasPreAuth = item.PreAuthorization === 'Approved';
        const index = hasPreAuth ? 0 : 1;
        
        preAuthData[index].deniedAmount += item.DeniedAmount;
        preAuthData[index].claimCount += 1;
      }
    });
    
    setPreAuthDenialsData(preAuthData);
    
    // Process Average Claim by CPT Code Data
    const cptCodeData = {};
    data.forEach(item => {
      if (item.CPTCode) {
        const cptCode = item.CPTCode;
        if (!cptCodeData[cptCode]) {
          cptCodeData[cptCode] = {
            cptCode,
            totalAmount: 0,
            count: 0
          };
        }
        cptCodeData[cptCode].totalAmount += item.ClaimAmount || 0;
        cptCodeData[cptCode].count += 1;
      }
    });
    
    // Calculate average and convert to array
    const cptCodeArray = Object.values(cptCodeData).map(item => ({
      ...item,
      avgAmount: item.count > 0 ? item.totalAmount / item.count : 0
    }));
    
    // Sort by average amount
    cptCodeArray.sort((a, b) => b.avgAmount - a.avgAmount);
    
    // Limit to top 10 CPT codes
    setAvgClaimByCPTData(cptCodeArray.slice(0, 10));
    
    // Process Pending Claims Aging Data
    const pendingAgingBuckets = {
      '0-30 days': { name: '0-30 days', value: 0 },
      '31-60 days': { name: '31-60 days', value: 0 },
      '61-90 days': { name: '61-90 days', value: 0 },
      '91-120 days': { name: '91-120 days', value: 0 },
      '120+ days': { name: '120+ days', value: 0 }
    };
    
    // Filter for pending claims only
    const pendingClaims = data.filter(item => item.ClaimStatus === 'Pending');
    
    pendingClaims.forEach(item => {
      if (item.ReimbursementDays !== null && item.ReimbursementDays !== undefined) {
        const days = item.ReimbursementDays;
        
        if (days <= 30) {
          pendingAgingBuckets['0-30 days'].value += 1;
        } else if (days <= 60) {
          pendingAgingBuckets['31-60 days'].value += 1;
        } else if (days <= 90) {
          pendingAgingBuckets['61-90 days'].value += 1;
        } else if (days <= 120) {
          pendingAgingBuckets['91-120 days'].value += 1;
        } else {
          pendingAgingBuckets['120+ days'].value += 1;
        }
      }
    });
    
    setPendingClaimsAgingData(Object.values(pendingAgingBuckets));
  };

  const handleClaimStatusClick = (data) => {
    setSelectedClaimStatus(data.status);
    const filtered = filteredData.filter(item => 
      (item.ClaimStatus || 'Unknown') === data.status
    );
    setFilteredClaims(filtered);
  };
  
  // Handle date range change
  const handleDateChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };



  if (loading) return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-3 md:p-4 flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 mb-2 rounded-full bg-muted"></div>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 md:space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold dashboard-xs text-foreground">Revenue Cycle Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Comprehensive view of claims lifecycle and revenue optimization</p>
        </div>
      </div>
      
      {/* Subtle Filter Bar */}
      <div className="bg-card/40 backdrop-blur-sm border-t border-b border-border/30 -mx-3 md:-mx-4 px-3 md:px-4 py-2 mb-2 flex items-center overflow-x-auto">
        <div className="flex items-center space-x-4 text-xs">
          {/* Date Range Filter */}
          <div className="flex items-center space-x-1.5 min-w-fit">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <input 
                type="date" 
                className="bg-transparent text-xs w-[6.5rem] outline-none border-b border-transparent hover:border-border/50 focus:border-primary transition-colors" 
                onChange={(e) => handleDateChange('start', e.target.value)}
                placeholder="Start"
              />
              <span className="text-muted-foreground">-</span>
              <input 
                type="date" 
                className="bg-transparent text-xs w-[6.5rem] outline-none border-b border-transparent hover:border-border/50 focus:border-primary transition-colors" 
                onChange={(e) => handleDateChange('end', e.target.value)}
                placeholder="End"
              />
            </div>
          </div>
          
          <div className="h-4 border-r border-border/30"></div>
          
          {/* Payer Filter */}
          <div className="flex items-center space-x-1.5 min-w-fit">
            <span className="text-muted-foreground">Payer:</span>
            <select 
              className="bg-transparent text-xs outline-none border-b border-transparent hover:border-border/50 focus:border-primary transition-colors pr-4" 
              value={selectedPayer}
              onChange={(e) => setSelectedPayer(e.target.value)}
            >
              {payerOptions.map((payer, index) => (
                <option key={index} value={payer}>{payer}</option>
              ))}
            </select>
          </div>
          
          <div className="h-4 border-r border-border/30"></div>
          
          {/* Department Filter */}
          <div className="flex items-center space-x-1.5 min-w-fit">
            <span className="text-muted-foreground">Dept:</span>
            <select 
              className="bg-transparent text-xs outline-none border-b border-transparent hover:border-border/50 focus:border-primary transition-colors pr-4" 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {deptOptions.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {/* Clear Filters */}
          {(selectedPayer !== 'All' || selectedDept !== 'All' || dateRange.start || dateRange.end) && (
            <>
              <div className="h-4 border-r border-border/30"></div>
              <button 
                onClick={() => {
                  setSelectedPayer('All');
                  setSelectedDept('All');
                  setDateRange({ start: null, end: null });
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pre-Authorization Impact KPIs */}
      <PreAuthKPIs preAuthKPIs={preAuthKPIs} />

      {/* Funnel & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <RevenueCycleFunnel funnelData={funnelData} />
        <ClaimStatusChart 
          claimStatusData={claimStatusData} 
          onStatusClick={handleClaimStatusClick} 
        />
        <ClaimAmountByStatusChart claimAmountByStatusData={claimAmountByStatusData} />
      </div>

      {/* Claims Trend */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-sm md:text-base font-medium dashboard-xs">Claims Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center rounded-md border border-border shadow-sm">
                <button
                  onClick={() => setTrendType('monthly')}
                  className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium ${trendType === 'monthly' ? 'bg-primary text-white' : 'bg-card text-muted-foreground'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTrendType('daily')}
                  className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium ${trendType === 'daily' ? 'bg-primary text-white' : 'bg-card text-muted-foreground'}`}
                >
                  Daily
                </button>
              </div>
            </div>
          </div>
          <MonthlyClaimsTrendChart 
            data={trendType === 'daily' ? dailyClaimsData : monthlyClaimsData} 
            trendType={trendType} 
          />
        </div>
      </div>

      {/* Middle Row: Paid vs Denied, Denial Reasons, Pre-Auth Denials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <DeptPaidDeniedChart deptPaidDeniedData={deptPaidDeniedData} />
        <DenialReasonsBreakdownChart data={denialReasonsData} />
        <PreAuthDenialsChart preAuthDenialsData={preAuthDenialsData} />
      </div>

      {/* Denial Analysis Pareto Chart */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <DenialAnalysisChart data={denialData} />
      </div>

      {/* Bottom Row: Claims by Payer, Reimbursement Time, Pending Claims Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <ClaimsByPayerChart claimsByPayerData={claimsByPayerData} />
        <ReimbursementTimeDistributionChart reimbursementTimeData={reimbursementTimeData} />
        <PendingClaimsAgingChart pendingClaimsAgingData={pendingClaimsAgingData} />
      </div>

      {/* Payer Performance Table */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <PayerPerformanceTable payerData={payerData} />
      </div>

      {/* Filtered Claims Table */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <FilteredClaimsTable claims={filteredClaims} />
      </div>
    </div>
  );
}

