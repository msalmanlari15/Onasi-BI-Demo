import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreditCard } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const ClaimsByPayerChart = ({ claimsByPayerData, dataKey = 'totalClaimAmount' }) => {
  const renderLabel = ({ name, percent }) => `${name.substring(0, 12)}${name.length > 12 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Claims by Payer
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {claimsByPayerData && claimsByPayerData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <PieChart>
              <Pie
                data={claimsByPayerData}
                cx="50%"
                cy="50%"
                labelLine={true}
                dataKey="totalAmount"
                nameKey="name"
                outerRadius={60}
                fill="#8884d8"
                label={renderLabel}
                isAnimationActive={true}
              >
                {claimsByPayerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 8) + 1})`} />
                ))} // Use up to 8 chart color variables, cycle as needed.
              </Pie>
              <Tooltip 
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[var(--card)] p-2 border border-[var(--card-foreground)] shadow-md rounded-md dashboard-xs compact">
                        <p className="text-[var(--card-foreground)] font-medium">{data.payer}</p>
                        <p className="text-[var(--card-foreground)]">
                          <span>Total Claims: </span>
                          {formatNumber(data.numClaims)}
                        </p>
                        <p className="text-[var(--card-foreground)] flex items-center">
                          <span>Total Amount: </span>
                          {formatCurrency(data.totalClaimAmount)}
                          <SaudiRiyalSymbol className="ml-1" size={14} />
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No claims by payer data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimsByPayerChart;
