import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock4 } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { PRIMARY_COLOR, COLORS } from '../../constants/colors';

const PendingClaimsAgingChart = ({ pendingClaimsAgingData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock4 className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
          Pending Claims Aging
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-xs">
        {pendingClaimsAgingData && pendingClaimsAgingData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <BarChart
              data={pendingClaimsAgingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: '0.5rem', className: 'dashboard-tick-xs compact' }} />
              <YAxis tick={{ fontSize: '0.5rem', className: 'dashboard-tick-xs compact' }} />
              <Tooltip
                wrapperStyle={{ fontSize: '0.5rem' }}
                formatter={(value) => [value, 'Claims']}
              />
              <Legend wrapperStyle={{ fontSize: '0.5rem' }} className="dashboard-legend-xs compact" />
              <Bar dataKey="value" name="Claims" fill="var(--chart-1)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-md">
            <p className="text-[var(--card-foreground)]">No pending claims aging data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingClaimsAgingChart;
