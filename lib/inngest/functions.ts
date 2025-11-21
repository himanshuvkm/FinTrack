import { inngest } from "./client";
import prismaDb from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenAI } from "@google/genai";


type TransactionRow = {
  id: string;
  userId: string;
  date: Date;
  category: string;
  type: "EXPENSE" | "INCOME";
  // pris or number or object with toNumber()
  amount: number | { toNumber: () => number };
};

export type MonthlyStats = {
  totalIncome: number;
  totalExpenses: number;
  byCategory: Record<string, number>;
  transactionCount: number;
};

type BudgetAlertData = {
  percentageUsed: number;
  budgetAmount: number;
  totalExpenses: number;
};



/***** Helper runtime type guards *****/
function toNumber(amount: number | { toNumber: () => number }): number {
  if (typeof amount === "number") return amount;
  if (typeof (amount )?.toNumber === "function") {
  
    return (amount ).toNumber();
  }
  if (typeof (amount as { toNumber?: unknown })?.toNumber === "function") {
    return (amount as { toNumber: () => number }).toNumber();
  }
  throw new Error("Unsupported amount type");
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((v) => typeof v === "string")
  );
}


export const checkBudgetAlerts = inngest.createFunction(
   { id: "check-budget-alerts", name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Runs every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return prismaDb.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

        // ---- Fetch expenses only for default account ----
        const expenses = await prismaDb.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: { gte: startDate },
          },
          _sum: { amount: true },
        });

        const totalExpenses = Number(expenses._sum.amount ?? 0);
        const budgetAmount = Number(budget.amount);

        // Avoid division by zero
        if (budgetAmount === 0) return;

        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        // ---- Alert Conditions ----
        const thresholdCrossed = percentageUsed >= 80;
        const isNewAlertMonth =
          !budget.lastAlertSent ||
          new Date(budget.lastAlertSent).getMonth() !== now.getMonth();

        if (thresholdCrossed && isNewAlertMonth) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed: percentageUsed.toFixed(1),
                budgetAmount: budgetAmount.toFixed(1),
                totalExpenses: totalExpenses.toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          await prismaDb.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: now },
          });
        }
      });
    }
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", // Unique ID,
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await prismaDb.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      }
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await prismaDb.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      await prismaDb.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

function calculateNextRecurringDate(date : Date, interval: any) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

function isNewMonth(lastAlertDate:Date, currentDate:Date) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function isTransactionDue(transaction: any) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

export async function generateFinancialInsights(
  stats: MonthlyStats,
  month: string
){
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const expenseList =
    stats.byCategory && Object.keys(stats.byCategory).length > 0
      ? Object.entries(stats.byCategory)
          .map(([category, amount]) => `${category}: $${amount}`)
          .join(", ")
      : "No expense categories available";

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${expenseList}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
    Output purely the JSON array of strings.
  `;

 try {
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt, 
  });
   console.log(result)
   const text = await result.text || " " ;
   const cleanedText = text.match(/\[[\s\S]*\]/);

    return JSON.parse(cleanedText ? cleanedText[0] : '[]');
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }

}


export async function getMonthlyStats(userId: string, month: Date) {

  const startDate = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0, 0);

  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);

  const transactions = (await prismaDb.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })) as TransactionRow[]; // cast to our local type

  const initial: MonthlyStats = {
    totalExpenses: 0,
    totalIncome: 0,
    byCategory: {},
    transactionCount: transactions.length,
  };

  return transactions.reduce<MonthlyStats>((stats, t) => {
    let amountNum: number;
    try {
      amountNum = toNumber(t.amount);
    } catch (err) {
      // if amount parsing fails, skip this transaction but log it
      console.warn(`Skipping transaction ${t.id} due to unsupported amount type`, err);
      return stats;
    }

    if (t.type === "EXPENSE") {
      stats.totalExpenses += amountNum;
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + amountNum;
    } else {
      stats.totalIncome += amountNum;
    }
    return stats;
  }, initial);
}

/***** Inngest scheduled function (typed-ish) *****/
export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month at 00:00
  async ({ step }: { step: any }) => {
    const users = await step.run("fetch-users", async () => {
      return await prismaDb.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      // guard user.email and user.id existence
      if (!user?.id || !user?.email) {
        console.warn("Skipping user with missing id or email", user);
        continue;
      }

      await step.run(`generate-report-${user.id}`, async () => {
        const ref = new Date();
        ref.setMonth(ref.getMonth() - 1);
        // copy the date to avoid mutating shared Date object
        const lastMonth = new Date(ref.getTime());

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", { month: "long" });

        // Generate AI insights (safe)
        const insights = await generateFinancialInsights(stats, monthName);

        // Build the email react element — EmailTemplate should accept props typed earlier
        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name ?? "",
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });
      });
    }

    return { processed: users.length };
  }
);