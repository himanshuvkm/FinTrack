"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryColors } from "@/data/category";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/usefetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: string;
  accountId: string;
  type: "INCOME" | "EXPENSE";
  isRecurring: boolean;
  recurringInterval?: string;
  nextRecurringDate?: string;
}

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const router = useRouter();

  const [seletedIds, setSeletedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  /* ---------------- Filtering + Sorting ---------------- */

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (recurringFilter && recurringFilter !== "all") {
      result = result.filter((t) =>
        recurringFilter === "recurring"
          ? t.isRecurring
          : !t.isRecurring
      );
    }

    result.sort((a, b) => {
      let c = 0;
      if (sortConfig.field === "date") {
        c = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortConfig.field === "amount") {
        c = Number(a.amount) - Number(b.amount);
      }
      if (sortConfig.field === "category") {
        c = a.category.localeCompare(b.category);
      }
      return sortConfig.direction === "asc" ? c : -c;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field: string) => {
    setSortConfig((c) => ({
      field,
      direction:
        c.field === field && c.direction === "asc" ? "desc" : "asc",
    }));
  };

  /* ---------------- Delete ---------------- */

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSeletedIds([]);
    }
  }, [deleted, deleteLoading]);

  /* ---------------- UI ---------------- */

  return (
    <section
      aria-labelledby="transactions-title"
      className="space-y-4 px-3"
    >
      {deleteLoading && (
        <BarLoader width="100%" color="#a855f7" />
      )}

      {/* ---------------- Controls ---------------- */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-neutral-900 p-4">
        <h2 id="transactions-title" className="sr-only">
          Transactions Table
        </h2>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            aria-label="Search transactions"
            placeholder="Search transactions…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 bg-neutral-950 border border-white/5 pl-9 text-white placeholder:text-white/40"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-10 w-[120px] bg-neutral-950 border-white/5 text-white/70">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/5">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={recurringFilter} onValueChange={setRecurringFilter}>
          <SelectTrigger className="h-10 w-[150px] bg-neutral-950 border-white/5 text-white/70">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/5">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
            <SelectItem value="non-recurring">One-time</SelectItem>
          </SelectContent>
        </Select>

        {(searchTerm || typeFilter || recurringFilter) && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear filters"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("");
              setRecurringFilter("");
            }}
            className="text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {seletedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteFn(seletedIds)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete ({seletedIds.length})
          </Button>
        )}
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                Date
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                Category
              </TableHead>
              <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                Amount
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-white/40">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-neutral-800">
                  <TableCell>
                    <Checkbox
                      checked={seletedIds.includes(t.id)}
                      onCheckedChange={() =>
                        setSeletedIds((c) =>
                          c.includes(t.id)
                            ? c.filter((i) => i !== t.id)
                            : [...c, t.id]
                        )
                      }
                    />
                  </TableCell>

                  <TableCell className="text-white/80">
                    {format(new Date(t.date), "PP")}
                  </TableCell>

                  <TableCell className="text-white/80">
                    {t.description}
                  </TableCell>

                  <TableCell>
                    <span
                      style={{ background: categoryColors[t.category] }}
                      className="rounded-full px-2 py-1 text-xs text-white"
                    >
                      {t.category}
                    </span>
                  </TableCell>

                  <TableCell
                    className={
                      t.type === "INCOME"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }
                  >
                    {t.type === "INCOME" ? "+" : "-"}${t.amount}
                  </TableCell>

                  <TableCell>
                    {t.isRecurring ? (
                      <Badge className="gap-1 bg-purple-500/10 text-purple-300">
                        <RefreshCw className="h-3 w-3" />
                        {
                          RECURRING_INTERVALS[
                            t.recurringInterval as keyof typeof RECURRING_INTERVALS
                          ]
                        }
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-white/60">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-neutral-900 border-white/5">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/transactions/create?edit=${t.id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteFn([t.id])}
                          className="text-rose-400"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
