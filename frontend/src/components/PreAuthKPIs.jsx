import React from 'react';
import { Card, CardContent } from './ui/card';
import { XCircle, AlertCircle, TrendingDown } from 'lucide-react';
import Money from './Money';
import { formatNumber } from '../utils/formatters';

const PreAuthKPIs = ({ preAuthKPIs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-destructive rounded-lg">
              <XCircle className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pre-Auth Denied Amount</p>
              <p className="text-2xl font-bold text-card-foreground"><Money value={preAuthKPIs.totalDeniedAmount} /></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-accent rounded-lg">
              <AlertCircle className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Denied Claims Count</p>
              <p className="text-2xl font-bold text-card-foreground">{formatNumber(preAuthKPIs.deniedClaimsCount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingDown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Denied Amount</p>
              <p className="text-2xl font-bold text-card-foreground"><Money value={preAuthKPIs.avgDeniedAmount} /></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreAuthKPIs;
