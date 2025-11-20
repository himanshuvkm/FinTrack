import { inngest } from "./client";
import prismaDb from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
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
