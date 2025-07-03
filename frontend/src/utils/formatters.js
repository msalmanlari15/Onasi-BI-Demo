// Utility helpers for formatted numbers & currency
export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

// Format number with thousand separators and two decimal places (no symbol)
export const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(value);
