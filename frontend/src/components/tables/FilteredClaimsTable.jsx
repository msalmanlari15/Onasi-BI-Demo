import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Money from '../Money';
import { formatNumber } from '../../utils/formatters';

const FilteredClaimsTable = ({ selectedClaimStatus, filteredClaims, onClearFilter }) => {
  if (!selectedClaimStatus) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Claims with Status: {selectedClaimStatus}</span>
          <button 
            onClick={onClearFilter}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Filter
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Claim ID</th>
                <th className="text-left p-2">Payer</th>
                <th className="text-right p-2">Claim Amount</th>
                <th className="text-right p-2">Paid Amount</th>
                <th className="text-right p-2">Denied Amount</th>
                <th className="text-left p-2">Reason Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.slice(0, 10).map((claim, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{claim.ClaimID}</td>
                  <td className="p-2">{claim.Payer}</td>
                  <td className="p-2 text-right"><Money value={claim.ClaimAmount || 0} /></td>
                  <td className="p-2 text-right"><Money value={claim.PaidAmount || 0} /></td>
                  <td className="p-2 text-right"><Money value={claim.DeniedAmount || 0} /></td>
                  <td className="p-2">{claim.ReasonCode || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClaims.length > 10 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing first 10 of {filteredClaims.length} claims
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilteredClaimsTable;
