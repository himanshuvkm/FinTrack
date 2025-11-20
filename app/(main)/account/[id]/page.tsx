import { getAccountWithTransaction } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/AccountChart";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accountData = await getAccountWithTransaction(id);

  if (!accountData) return notFound();

  const { transactions, ...account } = accountData;
  return (
    <div className="space-y-8 px-5">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-end justify-between bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-6 border border-gray-200">
        {/* Account Info */}
        <div className="flex-1">
          <h1 className="text-4xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent capitalize mb-2">
            {account.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        {/* Balance & Stats */}
        <div className="text-left sm:text-right">
          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent mb-1">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {account._count.transactions} Transaction
            {account._count.transactions !== 1 ? "s" : ""}
          </p>
        </div>
      </div>



      {/* chart area */}

       <Suspense
        fallback={<BarLoader color="#00ACB6" width={"100%"} className="mt-4" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>



      {/* Transactions details  */}

      <Suspense
        fallback={<BarLoader color="#00ACB6" width={"100%"} className="mt-4" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
