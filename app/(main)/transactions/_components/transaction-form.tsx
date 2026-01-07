"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import useFetch from "@/hooks/usefetch";
import { transactionSchema } from "@/lib/schema";
import {
  createTransaction,
  updateTransaction,
  FormDataTransaction,
} from "@/actions/transaction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { cn } from "@/lib/utils";
import { ReceiptScanner } from "./recieptscanner";

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type Account = {
  id: string;
  name: string;
  balance: number | string;
  isDefault?: boolean;
};

type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

interface Props {
  accounts: Account[];
  category: Category[];
  editMode?: boolean;
  initialData?: any;
}

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

export default function AddTransactionForm({
  accounts = [],
  category = [],
  editMode = false,
  initialData = null,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormDataTransaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: String(initialData.amount),
            description: initialData.description ?? "",
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            recurringInterval: initialData.recurringInterval ?? undefined,
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId:
              accounts.find((a) => a.isDefault)?.id ?? accounts[0]?.id ?? "",
            category: "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    fn: transactionFn,
    loading: transactionLoading,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const handledRef = useRef(false);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const accountId = watch("accountId");

  const filteredCategories = category.filter((c) => c.type === type);

  /* ------------------------------------------------------------------ */
  /* SUBMIT */
  /* ------------------------------------------------------------------ */

  const onSubmit = (data: FormDataTransaction) => {
    const payload = {
      ...data,
      amount: data.amount.toString(),
    };

    if (editMode) {
      transactionFn(editId, payload);
    } else {
      transactionFn(payload);
    }
  };

  /* ------------------------------------------------------------------ */
  /* RECEIPT SCAN */
  /* ------------------------------------------------------------------ */

  const handleScanComplete = (scanned: any) => {
    if (!scanned) return;

    if (scanned.amount) setValue("amount", scanned.amount.toString());
    if (scanned.date) setValue("date", new Date(scanned.date));
    if (scanned.description) setValue("description", scanned.description);
    if (scanned.category) setValue("category", scanned.category);

    toast.success("Receipt scanned successfully");
  };

  /* ------------------------------------------------------------------ */
  /* SUCCESS HANDLING */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (handledRef.current) return;

    if (transactionResult && !transactionLoading) {
      handledRef.current = true;

      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );

      const nextAccountId =
        (transactionResult as any)?.data?.accountId ?? accountId;

      if (nextAccountId) {
        router.push(`/account/${nextAccountId}`);
      }
    }
  }, [
    transactionResult,
    transactionLoading,
    editMode,
    router,
    accountId,
  ]);

  /* ------------------------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------------------------ */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        rounded-xl
        border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900
        shadow-lg
      "
    >
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-6 text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editMode ? "Edit transaction" : "New transaction"}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Record income or expenses
        </p>
      </div>

      {!editMode && (
        <ReceiptScanner onScanComplete={handleScanComplete} />
      )}

      <div className="space-y-8 px-6 py-8">
        {/* Type */}
        <Field label="Transaction type" error={errors.type?.message}>
          <Select
            value={type}
            onValueChange={(v) =>
              setValue("type", v as "INCOME" | "EXPENSE")
            }
          >
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Amount + Account */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Amount" error={errors.amount?.message}>
            <Input
              type="number"
              step="0.01"
              className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              {...register("amount")}
            />
          </Field>

          <Field label="Account" error={errors.accountId?.message}>
            <Select
              value={accountId}
              onValueChange={(v) => setValue("accountId", v)}
            >
              <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} • ${Number(a.balance).toFixed(2)}
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-300">
                    + Create account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Category */}
        <Field label="Category" error={errors.category?.message}>
          <Select
            value={watch("category")}
            onValueChange={(v) => setValue("category", v)}
          >
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Date */}
        <Field label="Date" error={errors.date?.message}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 w-full justify-between bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white",
                  !date && "text-slate-400 dark:text-slate-500"
                )}
              >
                {date ? format(date, "PPP") : "Pick a date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => setValue("date", d ?? new Date())}
                disabled={(d) => d > new Date()}
              />
            </PopoverContent>
          </Popover>
        </Field>

        {/* Description */}
        <Field label="Description" error={errors.description?.message}>
          <Input
            className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            {...register("description")}
          />
        </Field>

        {/* Recurring */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 py-4">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Recurring transaction</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Repeat automatically
            </p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(v) => setValue("isRecurring", v)}
          />
        </div>

        {isRecurring && (
          <Field
            label="Recurring interval"
            error={errors.recurringInterval?.message}
          >
            <Select
              value={watch("recurringInterval")}
              onValueChange={(v) =>
                setValue("recurringInterval", v as any)
              }
            >
              <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-5">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-1/2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={transactionLoading}
          className="h-12 w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {editMode ? "Update" : "Create"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* FIELD */
/* ------------------------------------------------------------------ */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-900 dark:text-white">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
