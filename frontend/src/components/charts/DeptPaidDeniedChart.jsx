import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const DeptPaidDeniedChart = ({ deptPaidDeniedData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Paid vs Denied Amount by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {deptPaidDeniedData && deptPaidDeniedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart 
              data={deptPaidDeniedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <YAxis tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <Tooltip 
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
                        <p className="text-gray-600 font-medium">{label} Department</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-gray-900">
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
              <Bar dataKey="totalPaid" name="Paid Amount" fill="var(--chart-1)" isAnimationActive={true} />
              <Bar dataKey="totalDenied" name="Denied Amount" fill="var(--chart-2)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No department payment data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeptPaidDeniedChart;
