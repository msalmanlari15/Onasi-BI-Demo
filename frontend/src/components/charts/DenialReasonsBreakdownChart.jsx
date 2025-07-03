import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const DenialReasonsBreakdownChart = ({ data, sortBy = 'amount' }) => {
  // Sort data based on sortBy parameter (amount or count)
  const sortedData = data && data.length ? [...data].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return b.count - a.count;
  }) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Denial Reasons Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {sortedData && sortedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <LineChart
              data={sortedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="reason"
                type="category"
                interval={0}
                tick={{ fontSize: '0.65rem', className: 'dashboard-tick-xs', angle: -40, textAnchor: 'end' }}
                height={70}
                className="dashboard-label-xs"
              />
              <YAxis type="number" tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} className="dashboard-label-xs" />
              <Tooltip 
                wrapperStyle={{ fontSize: '0.7rem', className: 'dashboard-xs' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
                        <p className="text-gray-600 font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-gray-900">
                            <span style={{ color: entry.color }}>{entry.name}: </span>
                            {formatNumber(entry.value)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs" />
              
              <Line type="monotone" dataKey="count" name="Count" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No denial reasons data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DenialReasonsBreakdownChart;
