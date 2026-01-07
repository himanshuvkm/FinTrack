"use client";

import { memo, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Account } from "./accountCard";
import { Transaction } from "../../account/_components/transaction-table";

const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F97316", // orange
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#A855F7", // purple
];

interface Props {
  accounts: Account[];
  transactions: Transaction[];
}

export const DashboardOverview = memo(function DashboardOverview({
  accounts,
  transactions,
}: Props) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id ?? accounts[0]?.id
  );

  const accountTransactions = useMemo(
    () => transactions.filter((t) => t.accountId === selectedAccountId),
    [transactions, selectedAccountId]
  );

  const recentTransactions = useMemo(() => {
    return [...accountTransactions]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);
  }, [accountTransactions]);

  const pieChartData = useMemo(() => {
    const now = new Date();
    const map: Record<string, number> = {};

    for (const t of accountTransactions) {
      const d = new Date(t.date);
      if (
        t.type === "EXPENSE" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    }

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [accountTransactions]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
  {/* ================= RECENT TRANSACTIONS ================= */}
  <Card className="
    rounded-2xl
    border border-white/5
    bg-neutral-900
    shadow-none
  ">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <CardTitle className="text-sm font-medium tracking-wide text-white/85">
        Recent Transactions
      </CardTitle>

      <Select
        value={selectedAccountId}
        onValueChange={setSelectedAccountId}
      >
        <SelectTrigger
          className="
            h-8 w-[150px]
            bg-neutral-900
            border border-white/5
            text-white/70
            hover:bg-neutral-800
          "
        >
          <SelectValue placeholder="Select account" />
        </SelectTrigger>

        <SelectContent className="
          bg-neutral-900
          border border-white/5
          text-white/80
        ">
          {accounts.map((account) => (
            <SelectItem
              key={account.id}
              value={account.id}
              className="focus:bg-neutral-800"
            >
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardHeader>

    <CardContent className="space-y-2">
      {recentTransactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          No recent transactions
        </p>
      ) : (
        recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="
              flex items-center justify-between
              rounded-lg px-3 py-2
              transition-colors
              hover:bg-neutral-800
            "
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white/85">
                {transaction.description || "Untitled Transaction"}
              </p>
              <p className="text-xs text-white/40">
                {format(new Date(transaction.date), "PP")}
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                transaction.type === "EXPENSE"
                  ? "text-rose-400"
                  : "text-emerald-400"
              )}
            >
              {transaction.type === "EXPENSE" ? (
                <ArrowDownRight className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
              ${Number(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>

  {/* ================= EXPENSE BREAKDOWN ================= */}
  <Card className="
    rounded-2xl
    border border-white/5
    bg-neutral-900
    shadow-none
  ">
    <CardHeader>
      <CardTitle className="text-sm font-medium tracking-wide text-white/85">
        Monthly Expense Breakdown
      </CardTitle>
    </CardHeader>

    <CardContent>
      {pieChartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/40">
          No expenses this month
        </p>
      ) : (
        <div className="
          h-[300px]
          rounded-xl
          bg-neutral-950
          ring-1 ring-white/5
          p-4
        ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                dataKey="value"
                paddingAngle={2}
              >
                {pieChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `$${Number(value ?? 0).toFixed(2)}`
                }
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.85)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardContent>
  </Card>
</div>

  );
});
