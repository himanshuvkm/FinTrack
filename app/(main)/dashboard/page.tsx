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

const [data, transactions] = await Promise.all([
    GetUserAccounts(),
    getDashboardData(),
  ]);

const accounts: Account[] = data && data.success && Array.isArray(data.data) ? (data.data as Account[]) : [];

const defaultAccount = accounts.find((account: Account) => account.isDefault);
 let budgetData = null;
 if(defaultAccount){
  budgetData = await getBudgetData(defaultAccount.id);
 }
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
  <div className="max-w-7xl mx-auto space-y-8">
    

    {/* Budget Progress Section */}
    <div className="space-y-4">
     {
      defaultAccount && (
        <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses||0}
        />
      )
     }
    </div>

    {/* Overview Section */}
    <div className="space-y-4">
     <Suspense>
      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
      />
     </Suspense>
    </div>

    {/* Account Grid */}
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Your Accounts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Account Card */}
        <CreateAccountDrawer>
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all cursor-pointer group hover:shadow-lg bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                Create New Account
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Add a new account to track
              </p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Account Cards */}
        {Array.isArray(accounts) && accounts?.map((account: Account) => {
          return <AccountCard key={account.id} account={account} />
        })}
      </div>
    </div>
  </div>
</div>
  );
}
