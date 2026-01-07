import { getAccountWithTransaction } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/AccountChart";

/* ---------------- SEO ---------------- */
export const metadata = {
  title: "Account Overview – Dashboard",
  description:
    "View account balance, transaction history, and income vs expense analytics.",
};

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
    <section
      aria-labelledby="account-title"
      className="space-y-10 px-5 pt-8"
    >
      {/* ================= Account Header ================= */}
      <header
        className="
          rounded-xl
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Account Info */}
          <div>
            <h1
              id="account-title"
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize"
            >
              {account.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              {account.type.charAt(0) +
                account.type.slice(1).toLowerCase()}{" "}
              account
            </p>
          </div>

          {/* Balance */}
          <div className="sm:text-right">
            <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${parseFloat(account.balance).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              {account._count.transactions} transaction
              {account._count.transactions !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      {/* ================= Chart ================= */}
      <section aria-labelledby="account-chart-title">
        <h2 id="account-chart-title" className="sr-only">
          Account analytics
        </h2>

        <Suspense
          fallback={
            <BarLoader
              width="100%"
              color="#a855f7"
              className="mt-4"
            />
          }
        >
          <AccountChart transactions={transactions} />
        </Suspense>
      </section>

      {/* ================= Transactions ================= */}
      <section aria-labelledby="transactions-title">
        <h2 id="transactions-title" className="sr-only">
          Transaction history
        </h2>

        <Suspense
          fallback={
            <BarLoader
              width="100%"
              color="#a855f7"
              className="mt-4"
            />
          }
        >
          <TransactionTable transactions={transactions} />
        </Suspense>
      </section>
    </section>
  );
}
