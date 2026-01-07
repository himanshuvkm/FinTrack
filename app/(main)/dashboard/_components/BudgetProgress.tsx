"use client";
import { updateBudget } from "@/actions/budjet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    if (error) {
      toast.error("Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold tracking-wide text-slate-900 dark:text-white">
            Monthly Budget
          </CardTitle>

          <div className="mt-3 flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-1.5 ring-1 ring-slate-200 dark:ring-slate-700">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="
                    h-8 w-32
                    border-0 bg-transparent
                    text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus-visible:ring-0
                  "
                  placeholder="Amount"
                  autoFocus
                  disabled={isLoading}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="
                    h-8 w-8
                    border-emerald-200 dark:border-emerald-900
                    bg-emerald-50 dark:bg-emerald-950/30
                    hover:bg-emerald-100 dark:hover:bg-emerald-950/50
                  "
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="
                    h-8 w-8
                    border-rose-200 dark:border-rose-900
                    bg-rose-50 dark:bg-rose-950/30
                    hover:bg-rose-100 dark:hover:bg-rose-950/50
                  "
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    h-7 w-7
                    rounded-lg
                    text-slate-500 dark:text-slate-400
                    hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white
                  "
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {initialBudget && (
          <div className="space-y-3">
            {/* Progress track */}
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <Progress
                value={percentUsed}
                className="h-3 rounded-full bg-transparent"
                indicatorClassName={
                  percentUsed >= 80
                    ? "bg-rose-500"
                    : percentUsed >= 60
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                }
              />
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Usage</span>
              <span
                className={
                  percentUsed >= 80
                    ? "font-semibold text-rose-600 dark:text-rose-400"
                    : percentUsed >= 60
                    ? "font-semibold text-amber-600 dark:text-amber-400"
                    : "font-semibold text-emerald-600 dark:text-emerald-400"
                }
              >
                {percentUsed.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
