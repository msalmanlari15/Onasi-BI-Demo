import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { PRIMARY_COLOR } from '../../constants/colors';

const ReimbursementTimeDistributionChart = ({ reimbursementTimeData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
          Reimbursement Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {reimbursementTimeData && reimbursementTimeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart
              data={reimbursementTimeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }} tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <YAxis label={{ value: 'Number of Claims', angle: -90, position: 'insideLeft' }} tick={{ fontSize: '0.7rem', className: 'dashboard-tick-xs' }} />
              <Tooltip
                wrapperStyle={{ fontSize: '0.7rem' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="dashboard-legend-xs compact">
                        {payload.map((item, index) => (
                          <div key={index} className="dashboard-label-xs">
                            <span className="dashboard-label-xs">{item.name}: </span>
                            <span className="dashboard-label-xs">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} className="dashboard-legend-xs compact" />
              <Bar dataKey="count" name="Number of Claims" fill="var(--chart-1)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
            <p className="text-gray-500">No reimbursement time data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReimbursementTimeDistributionChart;
