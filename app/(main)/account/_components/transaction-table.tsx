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
import { format, set } from "date-fns";
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
  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter && recurringFilter !== "all") {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        if (recurringFilter === "non-recurring")
          return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a: Transaction, b: Transaction) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field: string) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${seletedIds.length} transactions?`
      )
    )
      return;

    deleteFn(seletedIds);
  };
  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleSelect = (id: string) => {
    setSeletedIds((current) =>
      current.includes(id)
        ? current.filter((items) => items !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSeletedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSeletedIds([]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 px-3">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
        {/* Search Input */}
        <div className="relative flex-1 ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10 border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px] h-10 border-gray-300">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="INCOME">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Income
                </div>
              </SelectItem>
              <SelectItem value="EXPENSE">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Expense
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Recurring Filter */}
          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-10 border-gray-300">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-10 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-1" />
            </Button>
          )}

          {/* Bulk Delete Button */}
          {seletedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="h-10 ml-2"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete ({seletedIds.length})
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                onCheckedChange={handleSelectAll}
                checked={
                  seletedIds.length === paginatedTransactions.length &&
                  paginatedTransactions.length > 0
                }
              />
            </TableHead>

            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date{" "}
                {sortConfig.field === "date" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>

            <TableHead>Description</TableHead>

            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">
                Category{" "}
                {sortConfig.field === "category" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>

            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center">
                Amount{" "}
                {sortConfig.field === "amount" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>

            <TableHead>Recurring</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => handleSelect(t.id)}
                    checked={seletedIds.includes(t.id)}
                  />
                </TableCell>

                <TableCell>{format(new Date(t.date), "PP")}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell className="capitalize">
                  <span
                    style={{
                      background: categoryColors[t.category],
                    }}
                    className="px-2 py-1 rounded-full text-white text-sm capitalize"
                  >
                    {t.category}{" "}
                  </span>
                </TableCell>
                <TableCell
                  className={
                    t.type === "INCOME" ? "text-green-500" : "text-red-500"
                  }
                >
                  {t.type === "INCOME" ? "+" : "-"}${t.amount}
                </TableCell>

                <TableCell>
                  {t.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {
                              RECURRING_INTERVALS[
                                t.recurringInterval as keyof typeof RECURRING_INTERVALS
                              ]
                            }
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {t.nextRecurringDate
                                ? format(new Date(t.nextRecurringDate), "PPP")
                                : "—"}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/transactions/create?edit=${t.id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteFn([t.id])}
                        className="text-destructive cursor-pointer"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
