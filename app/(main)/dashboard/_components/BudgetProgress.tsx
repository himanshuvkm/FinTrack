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
 <Card className="relative rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-none">
  <CardHeader className="flex flex-row items-start justify-between pb-4">
    <div className="flex-1">
      <CardTitle className="text-sm font-medium tracking-wide text-white/90">
        Monthly Budget
      </CardTitle>

      <div className="mt-3 flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-1.5 ring-1 ring-white/10">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="
                h-8 w-32
                border-0 bg-transparent
                text-white placeholder:text-white/30
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
                border-white/10
                bg-emerald-500/10
                hover:bg-emerald-500/20
              "
              onClick={handleUpdateBudget}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 text-emerald-400" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="
                h-8 w-8
                border-white/10
                bg-rose-500/10
                hover:bg-rose-500/20
              "
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 text-rose-400" />
            </Button>
          </div>
        ) : (
          <>
            <CardDescription className="text-sm text-white/50">
              {initialBudget
                ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                : "No budget set"}
            </CardDescription>

            <Button
              variant="ghost"
              size="icon"
              className="
                h-7 w-7
                rounded-full
                text-white/50
                hover:bg-white/10 hover:text-white
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
        <div className="h-3 w-full rounded-full bg-white/10">
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
          <span className="text-white/40">Usage</span>
          <span
            className={
              percentUsed >= 80
                ? "font-medium text-rose-400"
                : percentUsed >= 60
                ? "font-medium text-amber-400"
                : "font-medium text-emerald-400"
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
