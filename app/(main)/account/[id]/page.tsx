import { getAccountWithTransaction } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/AccountChart";

export const metadata = {
  title: "Account Overview – Fintrack",
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
    <section className="min-h-screen bg-[#faf9f6]">
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.2] -z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #c8c4bb 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ── Account Header ── */}
        <header className="relative border border-[#e4e1db] bg-white shadow-sm">
          {/* Top stripe */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52]" />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#5a7a52]" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#c0714a]" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between p-8">
            {/* Account Info */}
            <div>
              <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest mb-1">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()} account
              </p>
              <h1
                id="account-title"
                className="text-4xl font-black tracking-tighter text-[#1a1a16] capitalize"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                {account.name}
              </h1>
            </div>

            {/* Balance */}
            <div className="sm:text-right">
              <p
                className="text-4xl font-black tracking-tighter text-[#1a1a16]"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                ${parseFloat(account.balance).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-[#9a958e] font-medium">
                {account._count.transactions} transaction
                {account._count.transactions !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </header>

        {/* ── Chart ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-[#5a7a52] rounded-full" />
            <h2
              className="text-xl font-black tracking-tight text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Income vs Expenses
            </h2>
          </div>
          <Suspense
            fallback={<BarLoader width="100%" color="#5a7a52" className="mt-2" />}
          >
            <AccountChart transactions={transactions} />
          </Suspense>
        </div>

        {/* ── Transactions ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-[#c0714a] rounded-full" />
            <h2
              className="text-xl font-black tracking-tight text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Transaction History
            </h2>
          </div>
          <Suspense
            fallback={<BarLoader width="100%" color="#5a7a52" className="mt-2" />}
          >
            <TransactionTable transactions={transactions} />
          </Suspense>
        </div>

      </div>
    </section>
  );
}
