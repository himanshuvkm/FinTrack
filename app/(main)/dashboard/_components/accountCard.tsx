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
      rounded-2xl
      border border-white/10
      bg-neutral-900
      transition-colors
      hover:bg-neutral-800
      hover:border-white/20
    "
  >
    <CardHeader className="flex flex-row items-start justify-between pb-2">
      <CardTitle className="text-base font-medium text-white/85">
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
      <div className="mb-4 text-3xl font-semibold tracking-tight text-white">
        ${parseFloat(balance).toFixed(2)}
      </div>

      <p className="text-sm text-white/40">
        {type.charAt(0) + type.slice(1).toLowerCase()} account
      </p>
    </CardContent>

    <CardFooter className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
      <div className="flex items-center gap-1 text-emerald-400">
        <ArrowUpRight className="h-4 w-4" />
        <span>Income</span>
      </div>

      <div className="flex items-center gap-1 text-rose-400">
        <ArrowDownRight className="h-4 w-4" />
        <span>Expense</span>
      </div>
    </CardFooter>
  </Card>
</Link>

  );
}
