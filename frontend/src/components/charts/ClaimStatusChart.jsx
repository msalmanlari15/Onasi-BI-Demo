import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
// Use CSS variables from globals.css for colors instead of JS constants.

const ClaimStatusChart = ({ claimStatusData, onStatusClick }) => {
  return (
    <Card>
      <CardHeader className="p-2">
        <CardTitle className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Claim Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2">
        {claimStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <PieChart>
              <Pie
                data={claimStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={1}
                dataKey="count"
                nameKey="status"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                onClick={onStatusClick}
                isAnimationActive={true}
              >
                {claimStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 8) + 1})`} />
                ))} // Use up to 8 chart color variables, cycle as needed.
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No claim status data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimStatusChart;
