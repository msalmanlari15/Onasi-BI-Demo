import React from 'react';
import SaudiRiyalSymbol from './SaudiRiyalSymbol';
import { formatCurrency } from '../utils/formatters';

// Reusable inline money display with the SAR symbol
const Money = ({ value, className }) => (
  <span className={className}>
    {formatCurrency(value)} <SaudiRiyalSymbol className="inline-block ml-1" />
  </span>
);

export default Money;
