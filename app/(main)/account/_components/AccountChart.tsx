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
      <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle
              id="transaction-overview-title"
              className="text-xl font-bold tracking-wide text-slate-900 dark:text-white"
            >
              Transaction Overview
            </CardTitle>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-700
              "
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="focus:bg-slate-100 dark:focus:bg-slate-800"
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
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Income</p>
              <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totals.income.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Expenses</p>
              <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">
                ${totals.expense.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Balance</p>
              <p
                className={`mt-1 text-xl font-bold ${
                  net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
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
              bg-slate-50 dark:bg-slate-950
              ring-1 ring-slate-200 dark:ring-slate-800
              p-3
            "
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid
                  stroke="rgb(226 232 240)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => `$${v}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid rgb(226 232 240)",
                    borderRadius: "10px",
                    color: "rgb(15 23 42)",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#f43f5e"
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
