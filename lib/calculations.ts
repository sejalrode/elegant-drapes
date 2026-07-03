export function calculateProfit(sellingPrice: number, actualPrice: number) {
  return Math.max(0, sellingPrice - actualPrice);
}

export function calculateBalance(sellingPrice: number, advancePaid: number) {
  return Math.max(0, sellingPrice - advancePaid);
}
