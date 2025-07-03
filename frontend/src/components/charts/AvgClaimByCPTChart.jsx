import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileCode } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const AvgClaimByCPTChart = ({ avgClaimByCPTData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCode className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Average Claim Amount by CPT Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        {avgClaimByCPTData && avgClaimByCPTData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart
              data={avgClaimByCPTData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cptCode" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[var(--card)] p-2 border border-[var(--card-foreground)] shadow-md rounded-md">
                        <p className="text-[var(--card-foreground)] font-medium">CPT Code: {label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-[var(--card-foreground)] flex items-center">
                            <span style={{ color: 'var(--chart-x)' }}>{entry.name}: </span>
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
              <Legend />
              <Bar dataKey="avgClaimAmount" name="Average Claim Amount" fill="var(--chart-1)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No CPT claim data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvgClaimByCPTChart;
