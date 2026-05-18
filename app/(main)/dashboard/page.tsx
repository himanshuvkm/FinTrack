import React, { Suspense } from "react";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";
import { getDashboardData, GetUserAccounts } from "@/actions/dashboard";
import AccountCard, { Account } from "./_components/accountCard";
import { getBudgetData } from "@/actions/budjet";
import BudgetProgress from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/transaction-overview";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboardpage() {
  const accountsPromise = GetUserAccounts();
  const dashboardPromise = getDashboardData();

  const data = await accountsPromise;
  const accounts: Account[] =
    data?.success && Array.isArray(data.data) ? data.data : [];

  const defaultAccount = accounts.find((a) => a.isDefault);

  const budgetPromise = defaultAccount
    ? getBudgetData(defaultAccount.id)
    : Promise.resolve(null);

  const [transactions, budgetData] = await Promise.all([
    dashboardPromise,
    budgetPromise,
  ]);

  // Calculate summary statistics
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || "0"),
    0
  );

  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = transactionsArray
    .filter((t) => {
      if (!t || !t.date) return false;
      const tDate = new Date(t.date);
      return (
        t.type === "INCOME" &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthlyExpenses = transactionsArray
    .filter((t) => {
      if (!t || !t.date) return false;
      const tDate = new Date(t.date);
      return (
        t.type === "EXPENSE" &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen bg-[#faf9f6] px-6 py-10">
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.2] -z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #c8c4bb 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl space-y-10 z-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#e4e1db] pb-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#5a7a52] uppercase tracking-widest">
              Overview
            </p>
            <h1
              className="text-5xl font-black leading-tight tracking-tighter text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Dashboard
            </h1>
            <p className="text-[#6b6860] text-sm mt-1">
              Your complete financial picture
            </p>
          </div>
          <Link href="/transactions/create">
            <Button className="bg-[#1a1a16] hover:bg-[#2e2e28] text-[#faf9f6] rounded-none border-0 text-sm font-semibold tracking-wide px-6 py-5 gap-2 transition-all">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Balance */}
          <div className="relative border border-[#e4e1db] bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52]" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest">
                Total Balance
              </p>
              <div className="w-9 h-9 flex items-center justify-center border border-[#5a7a52]/20 bg-[#e8f0e4]">
                <Wallet className="h-4 w-4 text-[#5a7a52]" />
              </div>
            </div>
            <p
              className="text-3xl font-black text-[#1a1a16] tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              ${totalBalance.toFixed(2)}
            </p>
          </div>

          {/* Monthly Income */}
          <div className="relative border border-[#e4e1db] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52]" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest">
                Monthly Income
              </p>
              <div className="w-9 h-9 flex items-center justify-center border border-[#5a7a52]/20 bg-[#e8f0e4]">
                <TrendingUp className="h-4 w-4 text-[#5a7a52]" />
              </div>
            </div>
            <p
              className="text-3xl font-black text-[#5a7a52] tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              ${monthlyIncome.toFixed(2)}
            </p>
          </div>

          {/* Monthly Expenses */}
          <div className="relative border border-[#e4e1db] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#c0714a]" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest">
                Monthly Expenses
              </p>
              <div className="w-9 h-9 flex items-center justify-center border border-[#c0714a]/20 bg-[#f5e8df]">
                <TrendingDown className="h-4 w-4 text-[#c0714a]" />
              </div>
            </div>
            <p
              className="text-3xl font-black text-[#c0714a] tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              ${monthlyExpenses.toFixed(2)}
            </p>
          </div>

          {/* Net Balance */}
          <div className="relative border border-[#e4e1db] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div
              className={`absolute top-0 left-0 w-full h-0.5 ${
                netBalance >= 0 ? "bg-[#5a7a52]" : "bg-[#c0714a]"
              }`}
            />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest">
                Net Balance
              </p>
              <div
                className={`w-9 h-9 flex items-center justify-center border ${
                  netBalance >= 0
                    ? "border-[#5a7a52]/20 bg-[#e8f0e4]"
                    : "border-[#c0714a]/20 bg-[#f5e8df]"
                }`}
              >
                <ArrowUpRight
                  className={`h-4 w-4 ${
                    netBalance >= 0 ? "text-[#5a7a52]" : "text-[#c0714a]"
                  }`}
                />
              </div>
            </div>
            <p
              className={`text-3xl font-black tracking-tight ${
                netBalance >= 0 ? "text-[#5a7a52]" : "text-[#c0714a]"
              }`}
              style={{ fontFamily: "'Georgia', serif" }}
            >
              ${netBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ── Budget ── */}
        {defaultAccount && (
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        )}

        {/* ── Transaction Overview ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#5a7a52] rounded-full" />
            <h2
              className="text-2xl font-black tracking-tight text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Transaction Overview
            </h2>
          </div>
          <Suspense>
            <DashboardOverview
              accounts={accounts}
              transactions={transactions}
            />
          </Suspense>
        </div>

        {/* ── Accounts ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#5a7a52] rounded-full" />
            <div>
              <h2
                className="text-2xl font-black tracking-tight text-[#1a1a16]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Your Accounts
              </h2>
              <p className="text-xs text-[#9a958e] mt-0.5">
                Manage and track your financial accounts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Create Account */}
            <CreateAccountDrawer>
              <div
                className="
                  group cursor-pointer
                  border-2 border-dashed border-[#c8c4bb]
                  bg-white
                  transition-all
                  hover:border-[#5a7a52]
                  hover:bg-[#e8f0e4]/30
                  hover:shadow-md
                  min-h-[200px]
                  flex flex-col items-center justify-center gap-3 p-8 text-center
                "
              >
                <div className="w-12 h-12 border border-[#5a7a52]/30 bg-[#e8f0e4] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="h-5 w-5 text-[#5a7a52]" />
                </div>
                <p className="text-sm font-semibold text-[#1a1a16]">
                  Create New Account
                </p>
                <p className="text-xs text-[#9a958e]">
                  Add a new account to track
                </p>
              </div>
            </CreateAccountDrawer>

            {/* Existing Accounts */}
            {Array.isArray(accounts) &&
              accounts.map((account: Account) => (
                <AccountCard key={account.id} account={account} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
