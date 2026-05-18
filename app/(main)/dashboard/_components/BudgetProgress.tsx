"use client";
import { updateBudget } from "@/actions/budjet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import useFetch from "@/hooks/usefetch";
import { Check, Pencil, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function BudgetProgress({
  initialBudget,
  currentExpenses,
}: {
  initialBudget: any;
  currentExpenses: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = useMemo(() => {
    if (!initialBudget) return 0;
    return (currentExpenses / initialBudget.amount) * 100;
  }, [initialBudget, currentExpenses]);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) toast.error("Failed to update budget");
  }, [error]);

  const barColor =
    percentUsed >= 80
      ? "bg-[#c0714a]"
      : percentUsed >= 60
      ? "bg-[#8b7355]"
      : "bg-[#5a7a52]";

  const textColor =
    percentUsed >= 80
      ? "text-[#c0714a]"
      : percentUsed >= 60
      ? "text-[#8b7355]"
      : "text-[#5a7a52]";

  return (
    <div className="relative border border-[#e4e1db] bg-white shadow-sm">
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52]" />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#9a958e] uppercase tracking-widest mb-1">
              Budget Tracker
            </p>
            <h3
              className="text-xl font-black text-[#1a1a16] tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Monthly Budget
            </h3>
          </div>

          {/* Edit Controls */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2 border border-[#e4e1db] bg-[#faf9f6] px-3 py-1.5">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="h-8 w-32 border-0 bg-transparent text-[#1a1a16] placeholder:text-[#9a958e] focus-visible:ring-0 text-sm font-semibold"
                  placeholder="Amount"
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="w-7 h-7 bg-[#5a7a52] text-white hover:bg-[#3d5c35] transition-colors flex items-center justify-center"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-7 h-7 border border-[#e4e1db] text-[#6b6860] hover:border-[#c0714a] hover:text-[#c0714a] transition-colors flex items-center justify-center"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-[#6b6860]">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-7 h-7 border border-[#e4e1db] text-[#9a958e] hover:border-[#5a7a52] hover:text-[#5a7a52] transition-colors flex items-center justify-center"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {initialBudget && (
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="h-2 w-full bg-[#f0ede8] rounded-none overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-500`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9a958e] font-medium">Usage</span>
              <span className={`font-bold ${textColor}`}>
                {percentUsed.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
