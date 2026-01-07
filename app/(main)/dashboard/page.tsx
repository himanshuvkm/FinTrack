import React, { Suspense } from "react";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";
import { getDashboardData, GetUserAccounts } from "@/actions/dashboard";
import AccountCard ,{Account}from "./_components/accountCard";
import { getBudgetData } from "@/actions/budjet";
import BudgetProgress from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/transaction-overview";
import { getAccountWithTransaction } from "@/actions/account";
import Link from "next/link";
import { Button } from "@/components/ui/button";



export default async function Dashboardpage() {

const accountsPromise = GetUserAccounts();
const dashboardPromise = getDashboardData();

const data = await accountsPromise;
const accounts: Account[] =
  data?.success && Array.isArray(data.data) ? data.data : [];

const defaultAccount = accounts.find(a => a.isDefault);

const budgetPromise = defaultAccount
  ? getBudgetData(defaultAccount.id)
  : Promise.resolve(null);

const [transactions, budgetData] = await Promise.all([
  dashboardPromise,
  budgetPromise,
]);

 

  // Calculate summary statistics
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || "0"), 0);
  
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = transactionsArray
    .filter(t => {
      if (!t || !t.date) return false;
      const tDate = new Date(t.date);
      return t.type === "INCOME" && 
             tDate.getMonth() === currentMonth && 
             tDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const monthlyExpenses = transactionsArray
    .filter(t => {
      if (!t || !t.date) return false;
      const tDate = new Date(t.date);
      return t.type === "EXPENSE" && 
             tDate.getMonth() === currentMonth && 
             tDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const netBalance = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ================= Header ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Overview of your financial activity
            </p>
          </div>
          <Link href="/transactions/create">
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* ================= Summary Stats ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Balance */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Balance
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${totalBalance.toFixed(2)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Income */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Monthly Income
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${monthlyIncome.toFixed(2)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Expenses */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Monthly Expenses
                  </p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    ${monthlyExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
                  <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Balance */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Net Balance
                  </p>
                  <p className={`text-2xl font-bold ${
                    netBalance >= 0 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    ${netBalance.toFixed(2)}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  netBalance >= 0
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-rose-100 dark:bg-rose-900/30"
                }`}>
                  <ArrowUpRight className={`h-6 w-6 ${
                    netBalance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= Budget ================= */}
        {defaultAccount && (
          <div>
            <BudgetProgress
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}
            />
          </div>
        )}

        {/* ================= Overview ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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

        {/* ================= Accounts ================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Accounts
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Manage and track your financial accounts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Create Account */}
            <CreateAccountDrawer>
              <Card
                className="
                  group cursor-pointer
                  rounded-xl
                  border-2 border-dashed border-slate-300 dark:border-slate-700
                  bg-white dark:bg-slate-900
                  transition-all
                  hover:border-indigo-400 dark:hover:border-indigo-600
                  hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20
                  hover:shadow-lg
                "
              >
                <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
                  <div
                    className="
                      flex h-14 w-14 items-center justify-center
                      rounded-xl
                      bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30
                      text-indigo-600 dark:text-indigo-400
                      transition-transform
                      group-hover:scale-110
                    "
                  >
                    <Plus className="h-6 w-6" />
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Create New Account
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add a new account to track
                  </p>
                </CardContent>
              </Card>
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
