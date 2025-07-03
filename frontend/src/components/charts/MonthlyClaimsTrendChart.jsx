import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { PRIMARY_COLOR } from '../../constants/colors';
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const MonthlyClaimsTrendChart = ({ data, trendType = 'monthly' }) => {
  console.log('MonthlyClaimsTrendChart received data:', data);
  console.log('Data type:', typeof data, 'Is array?', Array.isArray(data), 'Length:', data?.length);
  
  // Get the appropriate title based on trend type
  const chartTitle = trendType === 'daily' ? 'Daily Claims Trend' : 'Monthly Claims Trend';
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
          {chartTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
                        <p className="text-gray-600 font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-gray-900">
                            <span style={{ color: entry.color }}>{entry.name}: </span>
                            {entry.dataKey === 'totalAmount' ? (
                              <span className="flex items-center">
                                {formatCurrency(entry.value)}
                                <SaudiRiyalSymbol className="ml-1" size={14} />
                              </span>
                            ) : (
                              entry.value
                            )}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs" />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="totalAmount" 
                name="Total Claim Amount" 
                stroke={PRIMARY_COLOR} 
                activeDot={{ r: 8 }} 
                isAnimationActive={true} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="claimCount" 
                name="Number of Claims" 
                stroke="#82ca9d" 
                isAnimationActive={true} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
            <p className="text-gray-500">No monthly claims data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyClaimsTrendChart;
