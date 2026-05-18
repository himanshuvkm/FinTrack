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
import { Account } from "./accountCard";
import { Transaction } from "../../account/_components/transaction-table";

// Earthy palette that matches the hero
const COLORS = [
  "#5a7a52", // olive
  "#c0714a", // terracotta
  "#8b7355", // warm brown
  "#3d5c35", // dark olive
  "#a89880", // warm taupe
  "#6b6860", // muted
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
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [accountTransactions]);

  return (
    <div className="grid gap-6 md:grid-cols-2">

      {/* ── Recent Transactions ── */}
      <div className="relative border border-[#e4e1db] bg-white shadow-sm">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52]" />

        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
          <h3
            className="text-base font-bold text-[#1a1a16]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Recent Transactions
          </h3>

          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="h-8 w-[140px] border border-[#e4e1db] bg-[#faf9f6] text-[#6b6860] rounded-none text-xs">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#e4e1db] rounded-none">
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="text-[#1a1a16] focus:bg-[#e8f0e4] text-xs"
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="px-6 pb-6 space-y-1">
          {recentTransactions.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#9a958e]">
              No recent transactions
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-3 py-3 transition-colors hover:bg-[#faf9f6] border-b border-[#f0ede8] last:border-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-[#1a1a16]">
                    {transaction.description || "Untitled Transaction"}
                  </p>
                  <p className="text-xs text-[#9a958e]">
                    {format(new Date(transaction.date), "PP")}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-bold ${
                    transaction.type === "EXPENSE"
                      ? "text-[#c0714a]"
                      : "text-[#5a7a52]"
                  }`}
                >
                  {transaction.type === "EXPENSE" ? (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                  ${Number(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Expense Breakdown ── */}
      <div className="relative border border-[#e4e1db] bg-white shadow-sm">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#c0714a]" />

        <div className="px-6 pt-6 pb-4">
          <h3
            className="text-base font-bold text-[#1a1a16]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Monthly Expense Breakdown
          </h3>
        </div>

        <div className="px-6 pb-6">
          {pieChartData.length === 0 ? (
            <p className="py-20 text-center text-sm text-[#9a958e]">
              No expenses this month
            </p>
          ) : (
            <div className="h-[280px] bg-[#faf9f6] border border-[#f0ede8] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
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
                      backgroundColor: "#faf9f6",
                      border: "1px solid #e4e1db",
                      borderRadius: "0px",
                      fontSize: "12px",
                      color: "#1a1a16",
                      boxShadow: "0 4px 12px rgba(26,26,22,0.08)",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#6b6860",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

    </div>
  );
});
