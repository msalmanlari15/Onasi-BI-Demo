import React from 'react';
import { 
  FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { PRIMARY_COLOR } from '../../constants/colors';
import SaudiRiyalSymbol from '../SaudiRiyalSymbol';

const RevenueCycleFunnel = ({ funnelData }) => {
  return (
    <Card>
      <CardHeader className="p-2">
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
          Revenue Cycle Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2">
        {funnelData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={180}>
            <FunnelChart>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card p-2 border border-border shadow-md rounded-md">
                        <p className="text-muted-foreground">{payload[0].name}</p>
                        <p className="text-card-foreground font-medium flex items-center">
                          {formatCurrency(payload[0].value)}
                          <SaudiRiyalSymbol className="ml-1" size={14} />
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Funnel 
                data={funnelData} 
                dataKey="value" 
                nameKey="name" 
                fill={PRIMARY_COLOR}
                isAnimationActive={true}
              >
                <LabelList 
                  position="center" 
                  fill="#fff" 
                  stroke="none" 
                  formatter={(value) => formatCurrency(value)}
                  content={(props) => {
                    const { x, y, width, height, value } = props;
                    return (
                      <text 
                        x={x + width / 2} 
                        y={y + height / 2} 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="#fff"
                      >
                        {formatCurrency(value)}
                      </text>
                    );
                  }}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
            <p className="text-gray-500">No funnel data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueCycleFunnel;
