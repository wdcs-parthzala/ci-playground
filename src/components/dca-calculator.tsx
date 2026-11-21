"use client";

import { useState } from "react";
import { parsePrices, simulateDca, type DcaResult } from "@/lib/dca";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function calculate(amount: string, prices: string): { result?: DcaResult; error?: string } {
  try {
    return { result: simulateDca({ amountPerBuy: Number(amount), prices: parsePrices(prices) }) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid input" };
  }
}

export function DcaCalculator() {
  const [amount, setAmount] = useState("100");
  const [prices, setPrices] = useState("100, 80, 60, 90, 120");
  const { result, error } = calculate(amount, prices);

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h1 className="text-2xl font-semibold">DCA Calculator</h1>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-500">Amount per buy (USD)</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-500">Price at each buy (comma-separated)</span>
        <input
          value={prices}
          onChange={(e) => setPrices(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-zinc-500">Total invested</dt>
          <dd className="text-right">{usd.format(result.totalInvested)}</dd>
          <dt className="text-zinc-500">Units bought</dt>
          <dd className="text-right">{result.unitsBought.toFixed(4)}</dd>
          <dt className="text-zinc-500">Average cost</dt>
          <dd className="text-right">{usd.format(result.averageCost)}</dd>
          <dt className="text-zinc-500">Current value</dt>
          <dd className="text-right">{usd.format(result.currentValue)}</dd>
          <dt className="text-zinc-500">P&amp;L</dt>
          <dd className={`text-right ${result.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
            {usd.format(result.pnl)} ({result.pnlPercent.toFixed(2)}%)
          </dd>
        </dl>
      )}
    </div>
  );
}