export type DcaInput = {
  /** USD spent on each buy. */
  amountPerBuy: number;
  /** Asset price at each buy, in order. */
  prices: number[];
};

export type DcaResult = {
  buys: number;
  totalInvested: number;
  unitsBought: number;
  averageCost: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
};

export function simulateDca({ amountPerBuy, prices }: DcaInput): DcaResult {
  if (!Number.isFinite(amountPerBuy) || amountPerBuy <= 0) {
    throw new Error("Amount per buy must be a positive number");
  }
  if (prices.length === 0) {
    throw new Error("Enter at least one price");
  }
  if (prices.some((p) => !Number.isFinite(p) || p <= 0)) {
    throw new Error("All prices must be positive numbers");
  }

  const buys = prices.length;
  const totalInvested = amountPerBuy * buys;
  const unitsBought = prices.reduce((units, price) => units + amountPerBuy / price, 0);
  const averageCost = totalInvested / unitsBought;
  const currentValue = unitsBought * prices[prices.length - 1];
  const pnl = currentValue - totalInvested;
  const pnlPercent = (pnl / totalInvested) * 100;

  return { buys, totalInvested, unitsBought, averageCost, currentValue, pnl, pnlPercent };
}

/** Parses "100, 80, 120" into [100, 80, 120]. Invalid entries become NaN. */
export function parsePrices(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number);
}