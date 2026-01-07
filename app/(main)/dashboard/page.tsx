import React, { Suspense } from "react";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, GetUserAccounts } from "@/actions/dashboard";
import AccountCard ,{Account}from "./_components/accountCard";
import { getBudgetData } from "@/actions/budjet";
import BudgetProgress from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/transaction-overview";
import { getAccountWithTransaction } from "@/actions/account";



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

 

  return (
  <div className="min-h-screen bg-neutral-950 px-6 py-8 rounded-sm">
  <div className="mx-auto max-w-7xl space-y-10 ">

    {/* ================= Budget ================= */}
    {defaultAccount && (
      <div className="space-y-4">
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      </div>
    )}

    {/* ================= Overview ================= */}
    <div className="space-y-4">
      <Suspense>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions}
        />
      </Suspense>
    </div>

    {/* ================= Accounts ================= */}
    <div className="space-y-6">
      <h2 className="text-lg font-medium tracking-wide text-white/85">
        Your Accounts
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Create Account */}
        <CreateAccountDrawer>
          <Card
            className="
              group cursor-pointer
              rounded-2xl
              border border-dashed border-white/10
              bg-neutral-900
              transition-colors
              hover:border-white/20
              hover:bg-neutral-800
            "
          >
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-full
                  border border-white/10
                  text-white/60
                  transition-colors
                  group-hover:text-white
                "
              >
                <Plus className="h-6 w-6" />
              </div>

              <p className="text-sm font-medium text-white/85">
                Create New Account
              </p>

              <p className="text-xs text-white/40">
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
