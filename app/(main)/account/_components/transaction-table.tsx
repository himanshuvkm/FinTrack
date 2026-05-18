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

  /* ── Filtering + Sorting ── */
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
        recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
      );
    }

    result.sort((a, b) => {
      let c = 0;
      if (sortConfig.field === "date")
        c = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortConfig.field === "amount")
        c = Number(a.amount) - Number(b.amount);
      if (sortConfig.field === "category")
        c = a.category.localeCompare(b.category);
      return sortConfig.direction === "asc" ? c : -c;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field: string) => {
    setSortConfig((c) => ({
      field,
      direction: c.field === field && c.direction === "asc" ? "desc" : "asc",
    }));
  };

  /* ── Delete ── */
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

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field)
      return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[#5a7a52]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[#5a7a52]" />
    );
  };

  /* ── UI ── */
  return (
    <section aria-labelledby="transactions-title" className="space-y-4">
      {deleteLoading && <BarLoader width="100%" color="#5a7a52" />}

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-3 border border-[#e4e1db] bg-white p-4 shadow-sm">
        <h2 id="transactions-title" className="sr-only">
          Transactions Table
        </h2>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9a958e]" />
          <Input
            aria-label="Search transactions"
            placeholder="Search transactions…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 border border-[#e4e1db] bg-[#faf9f6] rounded-none pl-9 text-[#1a1a16] placeholder:text-[#9a958e] text-sm focus-visible:ring-[#5a7a52]/30"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[120px] border-[#e4e1db] bg-[#faf9f6] rounded-none text-[#6b6860] text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#e4e1db] rounded-none">
            <SelectItem value="all" className="text-[#1a1a16] focus:bg-[#e8f0e4] text-sm">All</SelectItem>
            <SelectItem value="INCOME" className="text-[#5a7a52] focus:bg-[#e8f0e4] text-sm">Income</SelectItem>
            <SelectItem value="EXPENSE" className="text-[#c0714a] focus:bg-[#f5e8df] text-sm">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Recurring Filter */}
        <Select value={recurringFilter} onValueChange={setRecurringFilter}>
          <SelectTrigger className="h-9 w-[150px] border-[#e4e1db] bg-[#faf9f6] rounded-none text-[#6b6860] text-sm">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#e4e1db] rounded-none">
            <SelectItem value="all" className="text-[#1a1a16] focus:bg-[#e8f0e4] text-sm">All</SelectItem>
            <SelectItem value="recurring" className="text-[#1a1a16] focus:bg-[#e8f0e4] text-sm">Recurring</SelectItem>
            <SelectItem value="non-recurring" className="text-[#1a1a16] focus:bg-[#e8f0e4] text-sm">One-time</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {(searchTerm || typeFilter || recurringFilter) && (
          <button
            aria-label="Clear filters"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("");
              setRecurringFilter("");
            }}
            className="w-9 h-9 border border-[#e4e1db] text-[#9a958e] hover:border-[#c0714a] hover:text-[#c0714a] transition-colors flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Bulk Delete */}
        {seletedIds.length > 0 && (
          <button
            onClick={() => deleteFn(seletedIds)}
            className="flex items-center gap-2 bg-[#c0714a] hover:bg-[#a85e3a] text-white text-sm font-semibold px-4 h-9 transition-colors"
          >
            <Trash className="h-3.5 w-3.5" />
            Delete ({seletedIds.length})
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto border border-[#e4e1db] bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e4e1db] bg-[#faf9f6] hover:bg-[#faf9f6]">
              <TableHead className="w-10" />
              <TableHead
                onClick={() => handleSort("date")}
                className="cursor-pointer text-[#9a958e] text-xs font-semibold uppercase tracking-wider hover:text-[#1a1a16] transition-colors"
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon field="date" />
                </span>
              </TableHead>
              <TableHead className="text-[#9a958e] text-xs font-semibold uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead
                onClick={() => handleSort("category")}
                className="cursor-pointer text-[#9a958e] text-xs font-semibold uppercase tracking-wider hover:text-[#1a1a16] transition-colors"
              >
                <span className="flex items-center gap-1">
                  Category <SortIcon field="category" />
                </span>
              </TableHead>
              <TableHead
                onClick={() => handleSort("amount")}
                className="cursor-pointer text-[#9a958e] text-xs font-semibold uppercase tracking-wider hover:text-[#1a1a16] transition-colors"
              >
                <span className="flex items-center gap-1">
                  Amount <SortIcon field="amount" />
                </span>
              </TableHead>
              <TableHead className="text-[#9a958e] text-xs font-semibold uppercase tracking-wider">
                Recurring
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-[#9a958e]"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((t) => (
                <TableRow
                  key={t.id}
                  className="border-b border-[#f0ede8] hover:bg-[#faf9f6] transition-colors"
                >
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
                      className="border-[#c8c4bb] data-[state=checked]:bg-[#5a7a52] data-[state=checked]:border-[#5a7a52]"
                    />
                  </TableCell>

                  <TableCell className="text-[#6b6860] text-sm font-medium">
                    {format(new Date(t.date), "PP")}
                  </TableCell>

                  <TableCell className="text-[#1a1a16] text-sm font-medium">
                    {t.description}
                  </TableCell>

                  <TableCell>
                    <span
                      style={{ background: categoryColors[t.category] }}
                      className="px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      {t.category}
                    </span>
                  </TableCell>

                  <TableCell
                    className={`text-sm font-bold ${
                      t.type === "INCOME"
                        ? "text-[#5a7a52]"
                        : "text-[#c0714a]"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "−"}${t.amount}
                  </TableCell>

                  <TableCell>
                    {t.isRecurring ? (
                      <span className="inline-flex items-center gap-1 border border-[#5a7a52]/30 bg-[#e8f0e4] px-2 py-0.5 text-[10px] font-semibold text-[#3d5c35] uppercase tracking-wider">
                        <RefreshCw className="h-2.5 w-2.5" />
                        {
                          RECURRING_INTERVALS[
                            t.recurringInterval as keyof typeof RECURRING_INTERVALS
                          ]
                        }
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-[#e4e1db] px-2 py-0.5 text-[10px] font-semibold text-[#9a958e] uppercase tracking-wider">
                        <Clock className="h-2.5 w-2.5" />
                        One-time
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 border border-transparent hover:border-[#e4e1db] text-[#9a958e] hover:text-[#1a1a16] transition-all flex items-center justify-center">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-[#e4e1db] rounded-none shadow-md">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/transactions/create?edit=${t.id}`)
                          }
                          className="text-[#1a1a16] text-sm focus:bg-[#e8f0e4] focus:text-[#3d5c35]"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#f0ede8]" />
                        <DropdownMenuItem
                          onClick={() => deleteFn([t.id])}
                          className="text-[#c0714a] text-sm focus:bg-[#f5e8df]"
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

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-[#6b6860]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-9 h-9 border border-[#e4e1db] text-[#6b6860] hover:border-[#5a7a52] hover:text-[#5a7a52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm font-semibold text-[#1a1a16]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-9 h-9 border border-[#e4e1db] text-[#6b6860] hover:border-[#5a7a52] hover:text-[#5a7a52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
