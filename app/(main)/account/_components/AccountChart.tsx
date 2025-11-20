"use client";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "./transaction-table";
import { use, useMemo, useState } from "react";
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

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc: any, transaction: Transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += Number(transaction.amount);
      } else {
        acc[date].expense += Number(transaction.amount);
      }
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, dateRange]);

  const totals = useMemo<Totals>(() => {
    return filteredData.reduce(
      (acc: Totals, day: any) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div>
      <Card className="bg-white/60 backdrop-blur-xl border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transaction Overview
          </CardTitle>

          <Select
            defaultValue={dateRange}
            onValueChange={(val) => setDateRange(val as RangeKey)}
          >
            <SelectTrigger className="w-[150px] bg-white/60 backdrop-blur border-gray-300 rounded-lg">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="cursor-pointer hover:bg-gray-100 transition"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-xl font-bold text-green-600">
                ${totals.income.toFixed(2)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">
                ${totals.expense.toFixed(2)}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                totals.income - totals.expense >= 0
                  ? "bg-green-50 border-green-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              <p className="text-sm text-gray-500">Net</p>
              <p
                className={`text-xl font-bold ${
                  totals.income - totals.expense >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${(totals.income - totals.expense).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px] bg-white/70 rounded-xl shadow-inner border border-gray-200 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, undefined]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
