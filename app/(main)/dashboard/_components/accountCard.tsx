"use client";

import { updateDefaultAccount } from "@/actions/account";
import {
  Card,
  CardContent,
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
      toast.warning("You need at least one default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount) toast.success("Account updated successfully");
    if (error) toast.error(error || "Failed to update account");
  }, [updatedAccount, error]);

  return (
    <Link href={`/account/${id}`} className="group block">
      <div
        className="
          relative min-h-[200px]
          border border-[#e4e1db] bg-white
          transition-all
          hover:shadow-lg hover:border-[#5a7a52]/50
          hover:-translate-y-0.5
          flex flex-col
        "
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5a7a52]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c0714a]" />

        {/* Header */}
        <div className="flex flex-row items-start justify-between px-6 pt-6 pb-2">
          <div>
            <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest mb-1">
              {type.charAt(0) + type.slice(1).toLowerCase()} account
            </p>
            <h3 className="text-base font-bold text-[#1a1a16]">{name}</h3>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="pt-1">
            <Switch
              className="cursor-pointer data-[state=checked]:bg-[#5a7a52]"
              checked={isDefault}
              onClick={handledefaultChange}
              disabled={updateAccountLoading}
            />
          </div>
        </div>

        {/* Balance */}
        <div className="flex-1 px-6 py-4">
          <p
            className="text-3xl font-black text-[#1a1a16] tracking-tight"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            ${parseFloat(balance).toFixed(2)}
          </p>
          {isDefault && (
            <span className="inline-block mt-2 border border-[#5a7a52]/30 bg-[#e8f0e4] px-2 py-0.5 text-[10px] font-semibold text-[#3d5c35] uppercase tracking-widest">
              Default
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e4e1db] px-6 py-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#5a7a52] font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c0714a] font-semibold">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>Expense</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
