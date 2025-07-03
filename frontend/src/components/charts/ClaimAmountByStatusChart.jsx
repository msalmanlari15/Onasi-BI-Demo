import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const ClaimAmountByStatusChart = ({ claimAmountByStatusData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Claim Amount by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {claimAmountByStatusData && claimAmountByStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart data={claimAmountByStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <YAxis tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <Tooltip 
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card p-2 border border-border shadow-md rounded-md">
                        <p className="text-muted-foreground font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-card-foreground">
                            <span style={{ color: entry.color }}>{entry.name}: </span>
                            <span className="flex items-center">
                              {formatCurrency(entry.value)}
                              <SaudiRiyalSymbol className="ml-1" size={14} />
                            </span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs" />
              <Bar dataKey="totalAmount" name="Total Amount" fill="var(--chart-1)" isAnimationActive={true} />
              <Bar dataKey="avgAmount" name="Average Amount" fill="var(--chart-2)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No claim amount data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimAmountByStatusChart;
