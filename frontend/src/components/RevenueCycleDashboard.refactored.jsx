import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from './ui/badge';
import { FileText } from 'lucide-react';

// Import extracted components
import Money from './Money';
import PreAuthKPIs from './PreAuthKPIs';
import RevenueCycleFunnel from './charts/RevenueCycleFunnel';
import ClaimStatusChart from './charts/ClaimStatusChart';
import DenialAnalysisChart from './charts/DenialAnalysisChart';
import PayerPerformanceTable from './tables/PayerPerformanceTable';
import FilteredClaimsTable from './tables/FilteredClaimsTable';

// Import constants and utilities
import { PRIMARY_COLOR } from '../constants/colors';

export function RevenueCycleDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [selectedClaimStatus, setSelectedClaimStatus] = useState(null);
  const [filteredClaims, setFilteredClaims] = useState([]);

  // Processed data states
  const [funnelData, setFunnelData] = useState([]);
  const [denialData, setDenialData] = useState([]);
  const [payerData, setPayerData] = useState([]);
  const [claimStatusData, setClaimStatusData] = useState([]);
  const [preAuthKPIs, setPreAuthKPIs] = useState({});

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/financial');
      const data = response.data;
      if (!data || data.length === 0) {
        setFinancialData([]);
        setError('No data returned from API');
      } else {
        setFinancialData(data);
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
  };

  const handleClaimStatusClick = (data) => {
    setSelectedClaimStatus(data.status);
    const filtered = financialData.filter(item => 
      (item.ClaimStatus || 'Unknown') === data.status
    );
    setFilteredClaims(filtered);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 mb-2 rounded-full bg-gray-200"></div>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    </div>
  );
  
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Cycle Intelligence</h1>
          <p className="text-gray-500 mt-1">Comprehensive view of claims lifecycle and revenue optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <FileText className="w-4 h-4 mr-1" />
            CFO Dashboard
          </Badge>
        </div>
      </div>

      {/* Pre-Authorization Impact KPIs */}
      <PreAuthKPIs preAuthKPIs={preAuthKPIs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Cycle Funnel */}
        <RevenueCycleFunnel funnelData={funnelData} />

        {/* Interactive Claim Status Tracker */}
        <ClaimStatusChart 
          claimStatusData={claimStatusData} 
          onStatusClick={handleClaimStatusClick} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denial Analysis - Pareto Chart */}
        <DenialAnalysisChart denialData={denialData} />

        {/* Payer Performance Scorecard */}
        <PayerPerformanceTable payerData={payerData} />
      </div>

      {/* Filtered Claims Table */}
      <FilteredClaimsTable 
        selectedClaimStatus={selectedClaimStatus}
        filteredClaims={filteredClaims}
        onClearFilter={() => setSelectedClaimStatus(null)}
      />
    </div>
  );
}
