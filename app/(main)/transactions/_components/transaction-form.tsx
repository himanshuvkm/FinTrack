"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/usefetch";
import { transactionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTransaction, FormDataTransaction } from "@/actions/transaction";
import { toast } from "sonner";

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
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { cn } from "@/lib/utils";

import { format } from "date-fns";

// ------------------------
// TYPES
// ------------------------
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

// ------------------------
// COMPONENT
// ------------------------
export default function AddTransactionForm({
  accounts = [],
  category = [],
  editMode = false,
  initialData = null,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? "";

  // ------------------------
  // REACT HOOK FORM
  // ------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<FormDataTransaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type ?? "EXPENSE",
            amount: String(initialData.amount ?? ""),
            description: initialData.description ?? "",
            accountId: initialData.accountId ?? "",
            category: initialData.category ?? "",
            date: initialData.date ? new Date(initialData.date) : new Date(),
            isRecurring: initialData.isRecurring ?? false,
            recurringInterval: initialData.recurringInterval ?? undefined,
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId:
              accounts.find((ac) => ac.isDefault)?.id ?? accounts[0]?.id ?? "",
            category: "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = category.filter((c) => c.type === type);

  // ------------------------
  // API
  // ------------------------
  const { loading: transactionLoading, fn: transactionFn } =
    useFetch(createTransaction);

  const onSubmit = (data: FormDataTransaction) => {
    const formData = {
      ...data,
      amount: data.amount.toString(),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }

    router.push(`/account/${data.accountId}`)
  };

  // ------------------------
  // UI
  // ------------------------
  return (
 <div className="w-full"> 
  <form
  className="space-y-10 rounded-xl border bg-white shadow-sm"
  onSubmit={handleSubmit(onSubmit)}
>

  {/* HEADER */}
  <div className="rounded-t-xl bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-8">
    <h2 className="text-xl font-semibold text-center">Create New Transaction</h2>
    <p className="text-sm text-muted-foreground text-center">
      Add a new income or expense to your account
    </p>
  </div>

  <div className="px-6 space-y-8">

    {/* TYPE */}
    <div className="space-y-3">
      <label className="text-sm font-medium">Transaction Type</label>

      <Select
        onValueChange={(value) =>
          setValue("type", value as "INCOME" | "EXPENSE")
        }
        defaultValue={type}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EXPENSE">Expense</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
        </SelectContent>
      </Select>

      {errors.type && (
        <p className="text-xs text-red-500">{errors.type.message}</p>
      )}
    </div>

    {/* AMOUNT + ACCOUNT */}
    <div className="grid gap-8 md:grid-cols-2">

      {/* Amount */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Amount</label>

        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="h-12"
          {...register("amount")}
        />

        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Account */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Account</label>

        <Select
          onValueChange={(value) => setValue("accountId", value)}
          defaultValue={getValues("accountId") || ""}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>

          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name} • {Number(account.balance).toFixed(2)}
              </SelectItem>
            ))}

            <CreateAccountDrawer>
              <Button
                type="button"
                variant="ghost"
                className="relative flex w-full cursor-pointer rounded-md py-2 text-sm hover:bg-accent"
              >
                + Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectContent>
        </Select>

        {errors.accountId && (
          <p className="text-xs text-red-500">{errors.accountId.message}</p>
        )}
      </div>
    </div>

    {/* CATEGORY */}
    <div className="space-y-3">
      <label className="text-sm font-medium">Category</label>

      <Select
        onValueChange={(value) => setValue("category", value)}
        defaultValue={getValues("category") || ""}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>

        <SelectContent>
          {filteredCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errors.category && (
        <p className="text-xs text-red-500">{errors.category.message}</p>
      )}
    </div>

    {/* DATE */}
    <div className="space-y-3">
      <label className="text-sm font-medium">Date</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-12 w-full pl-3 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : "Pick date"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setValue("date", d || new Date())}
            disabled={(d) => d > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {errors.date && (
        <p className="text-xs text-red-500">{errors.date.message}</p>
      )}
    </div>

    {/* DESCRIPTION */}
    <div className="space-y-3">
      <label className="text-sm font-medium">Description</label>
      <Input className="h-12" placeholder="Description" {...register("description")} />
      {errors.description && (
        <p className="text-xs text-red-500">{errors.description.message}</p>
      )}
    </div>

    {/* RECURRING */}
    <div className="rounded-lg border bg-gradient-to-r from-blue-50/40 to-emerald-50/40 p-5 flex items-center justify-between">
      <div>
        <label className="font-medium">Recurring Transaction</label>
        <p className="text-xs text-muted-foreground">
          Automatically repeats on a schedule
        </p>
      </div>

      <Switch
        checked={isRecurring}
        onCheckedChange={(v) => setValue("isRecurring", v)}
      />
    </div>

    {/* Interval */}
    {isRecurring && (
      <div className="space-y-3">
        <label className="text-sm font-medium">Recurring Interval</label>

        <Select
          onValueChange={(v) => setValue("recurringInterval", v as any)}
          defaultValue={getValues("recurringInterval") || ""}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
          </SelectContent>
        </Select>

        {errors.recurringInterval && (
          <p className="text-xs text-red-500">
            {errors.recurringInterval.message}
          </p>
        )}
      </div>
    )}
  </div>

  {/* FOOTER BUTTONS */}
  <div className="flex gap-3  rounded-b-xl border-t bg-muted/40 px-6 py-6">

    <Button
      type="button"
      variant="outline"
      className="w-1/2 h-12"
      onClick={() => router.back()}
    >
      Cancel
    </Button>

    <Button
      type="submit"
      className="w-1/2 h-12  bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:opacity-90"
      disabled={transactionLoading}
    >
      {transactionLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {editMode ? "Updating..." : "Creating..."}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          {editMode ? "Update Transaction" : "Create Transaction"}
        </span>
      )}
    </Button>
  </div>

</form>

</div>
  );
}
