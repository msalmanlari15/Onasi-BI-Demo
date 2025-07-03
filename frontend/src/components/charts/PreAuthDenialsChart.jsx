import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const PreAuthDenialsChart = ({ preAuthDenialsData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Impact of Pre-Authorization on Denials
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {preAuthDenialsData && preAuthDenialsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart
              data={preAuthDenialsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="preAuthorization" tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs compact' }} />
              <YAxis tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs compact' }} />
              <Tooltip
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
                        <p className="text-gray-600 font-medium">Pre-Authorization: {label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-gray-900 flex items-center">
                            <span style={{ color: entry.color }}>{entry.name}: </span>
                            {formatCurrency(entry.value)}
                            <SaudiRiyalSymbol className="ml-1" size={14} />
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs" />
              <Bar dataKey="deniedAmount" name="Denied Amount" fill="var(--chart-1)" isAnimationActive={true} />
              <Bar dataKey="claimCount" name="Total Claims" fill="var(--chart-2)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No pre-authorization data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreAuthDenialsChart;
