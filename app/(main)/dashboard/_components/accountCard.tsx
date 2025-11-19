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
export default async function AccountCard({ account }: Props) {
  const { id, name, type, balance, isDefault } = account;

  const {
    data: updatedAccount,
    error,
    loading: updateAccountLoading,
    fn: updateDefaultFn,
  } = useFetch(updateDefaultAccount);

  const handledefaultChange = async (e: any) => {
    
    e.preventDefault();

    if (isDefault) {
      toast.warning("You need atleast one default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount) {
      toast.success("Account updated successfully");
    }
    if (error) {
      toast.error(error || "Failed to update account");
    }
  }, [error]);

  return (
    <Link href={`/account/${id}`} className="block group">
      <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg bg-white/50 backdrop-blur-sm min-h-[200px]">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <div >
            <Switch
              className="cursor-pointer"
              checked={isDefault}
              onClick={handledefaultChange}
              disabled={updateAccountLoading}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span>Expense</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
