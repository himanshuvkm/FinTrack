"use client";

import { updateDefaultAccount } from "@/actions/account";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/usefetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: string;
  isDefault: boolean;
}
interface Props {
  account: Account;
}
export default function AccountCard({ account }: Props) {
  const { id, name, type, balance, isDefault } = account;

  const {
    data: updatedAccount,
    error,
    loading: updateAccountLoading,
    fn: updateDefaultFn,
  } = useFetch(updateDefaultAccount);

const handledefaultChange = async (e: any) => {
  e.preventDefault();
  e.stopPropagation();

  if (isDefault) {
    toast.warning("You need atleast one default account");
    return;
  }
  await updateDefaultFn(id);
};


useEffect(() => {
  if (updatedAccount) toast.success("Account updated successfully");
  if (error) toast.error(error || "Failed to update account");
}, [updatedAccount, error]);
;

  return (
    <Link href={`/account/${id}`} className="group block">
      <Card
        className="
          min-h-[200px]
          rounded-xl
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          transition-all
          hover:shadow-lg
          hover:border-indigo-300 dark:hover:border-indigo-700
          hover:-translate-y-1
        "
      >
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
            {name}
          </CardTitle>

          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              className="cursor-pointer"
              checked={isDefault}
              onClick={handledefaultChange}
              disabled={updateAccountLoading}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="mb-4 text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ${parseFloat(balance).toFixed(2)}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {type.charAt(0) + type.slice(1).toLowerCase()} account
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="h-4 w-4" />
            <span>Income</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <ArrowDownRight className="h-4 w-4" />
            <span>Expense</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
