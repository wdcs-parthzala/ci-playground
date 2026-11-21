import { describe, expect, it } from "vitest";
import { parsePrices, simulateDca } from "./dca";

describe("simulateDca", () => {
  it("buys more units when the price is low", () => {
    // $100 at $100 → 1 unit, $100 at $50 → 2 units
    const result = simulateDca({ amountPerBuy: 100, prices: [100, 50] });

    expect(result.buys).toBe(2);
    expect(result.totalInvested).toBe(200);
    expect(result.unitsBought).toBe(3);
    expect(result.averageCost).toBeCloseTo(66.67, 2);
  });

  it("values the position at the last price", () => {
    // units = 1 + 2 + 1.25 = 4.25, value = 4.25 * 80 = 340
    const result = simulateDca({ amountPerBuy: 100, prices: [100, 50, 80] });

    expect(result.currentValue).toBeCloseTo(340);
    expect(result.pnl).toBeCloseTo(40);
    expect(result.pnlPercent).toBeCloseTo(13.33, 2);
  });

  it("rejects invalid input", () => {
    expect(() => simulateDca({ amountPerBuy: 0, prices: [100] })).toThrow();
    expect(() => simulateDca({ amountPerBuy: 100, prices: [] })).toThrow();
    expect(() => simulateDca({ amountPerBuy: 100, prices: [100, -5] })).toThrow();
  });
});

describe("parsePrices", () => {
  it("parses a comma-separated list", () => {
    expect(parsePrices("100, 80,120 ,")).toEqual([100, 80, 120]);
  });

  it("turns junk into NaN so validation can catch it", () => {
    expect(parsePrices("100, abc")[1]).toBeNaN();
  });
});