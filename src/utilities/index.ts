export const { v4: uuidv4 } = require('uuid');

type numerator = number;
type denominator = numerator;
export type fraction = [numerator, denominator];

export function approximateFraction(decimal: number, maxDenominator: number = 10000): fraction {
  // Handle special case where decimal is 0
  if (decimal === 0) return [0, 1];

  let numerator = 1;
  let denominator = 1;
  let bestNumerator = 0;
  let bestDenominator = 1;
  let minError = Math.abs(decimal);

  while (denominator <= maxDenominator) {
    numerator = Math.round(decimal * denominator);

    let error = Math.abs(decimal - numerator / denominator);

    if (error < minError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      minError = error;
    }

    // Increase the denominator to improve approximation
    denominator++;
  }

  return [bestNumerator, bestDenominator];
}
