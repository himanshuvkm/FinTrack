"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "./transaction-table";
import { useMemo, useState } from "react";
import { format, endOfDay, startOfDay, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};
type RangeKey = keyof typeof DATE_RANGES;

interface Totals {
  income: number;
  expense: number;
}

export default function AccountChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [dateRange, setDateRange] = useState<RangeKey>("1M");

  /* ---------------- Data processing ---------------- */

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) =>
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc: any, t) => {
      const date = format(new Date(t.date), "MMM dd");
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      t.type === "INCOME"
        ? (acc[date].income += Number(t.amount))
        : (acc[date].expense += Number(t.amount));
      return acc;
    }, {});

    return Object.values(grouped);
  }, [transactions, dateRange]);

  const totals = useMemo<Totals>(() => {
    return filteredData.reduce(
      (acc: Totals, d: any) => ({
        income: acc.income + d.income,
        expense: acc.expense + d.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const net = totals.income - totals.expense;

  /* ---------------- UI ---------------- */

  return (
    <section
      aria-labelledby="transaction-overview-title"
      className="w-full"
    >
      <Card className="rounded-2xl border border-white/5 bg-neutral-900 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle
              id="transaction-overview-title"
              className="text-lg font-medium tracking-wide text-white/90"
            >
              Transaction Overview
            </CardTitle>
            <p className="mt-1 text-sm text-white/50">
              Income vs expenses for the selected period
            </p>
          </div>

          <Select
            value={dateRange}
            onValueChange={(val) => setDateRange(val as RangeKey)}
          >
            <SelectTrigger
              aria-label="Select date range"
              className="
                w-[160px]
                bg-neutral-900
                border border-white/5
                text-white/70
                hover:bg-neutral-800
              "
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border border-white/5">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="focus:bg-neutral-800"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {/* ---------------- Summary (SEO-visible) ---------------- */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-neutral-950 p-4">
              <p className="text-xs text-white/40">Total Income</p>
              <p className="mt-1 text-xl font-semibold text-emerald-400">
                ${totals.income.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-950 p-4">
              <p className="text-xs text-white/40">Total Expenses</p>
              <p className="mt-1 text-xl font-semibold text-rose-400">
                ${totals.expense.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-950 p-4">
              <p className="text-xs text-white/40">Net Balance</p>
              <p
                className={`mt-1 text-xl font-semibold ${
                  net >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                ${net.toFixed(2)}
              </p>
            </div>
          </div>

          {/* ---------------- Chart ---------------- */}
          <div
            role="img"
            aria-label="Bar chart comparing income and expenses by day"
            className="
              h-[320px]
              rounded-xl
              bg-neutral-950
              ring-1 ring-white/5
              p-3
            "
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => `$${v}`}
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#34d399"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#fb7185"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
