import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, DollarSign } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { PRIMARY_COLOR } from '../../constants/colors';

const PayerPerformanceTable = ({ payerData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
          Payer Performance Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Payer</th>
                <th className="text-right p-3 font-medium">Avg Reimbursement Days</th>
                <th className="text-right p-3 font-medium">Denial Rate</th>
                <th className="text-right p-3 font-medium">Paid-to-Claimed Ratio</th>
                <th className="text-right p-3 font-medium">Total Claims</th>
              </tr>
            </thead>
            <tbody>
              {payerData.map((payer, index) => (
                <tr key={index} className="border-b border-border hover:bg-gray-50">
                  <td className="p-3 font-medium">{payer.payer}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {payer.avgReimbursementDays} days
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <Badge
                      variant={parseFloat(payer.denialRate) > 15 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {payer.denialRate}%
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Badge
                      variant={parseFloat(payer.paidToClaimedRatio) > 80 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {payer.paidToClaimedRatio}%
                    </Badge>
                  </td>
                  <td className="p-3 text-right">{formatNumber(payer.totalClaims)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayerPerformanceTable;
