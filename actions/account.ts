"use server";
import prismaDb from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj: any) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function updateDefaultAccount(accountId: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const User = await prismaDb.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!User) {
      throw new Error("User not found");
    }

    await prismaDb.account.updateMany({
      where: {
        userId: User.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const account = await prismaDb.account.update({
      where: {
        id: accountId,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard");
    const serializedAccount = serializeTransaction(account);
    return { success: true, data: serializedAccount };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

export async function getAccountWithTransaction(accountId: any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const User = await prismaDb.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!User) {
    throw new Error("User not found");
  }

  const account = await prismaDb.account.findUnique({
    where: {
      id: accountId,
      userId: User.id,
    },
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!account) {
    return null;
  }
  return {
    ...serializeTransaction(account),
    transactions: account.transactions.map(serializeTransaction),
  };
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const User = await prismaDb.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!User) throw new Error("User not found");

    const transactions = await prismaDb.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: User.id,
      },
    });

    // Calculate balance changes safely
    const accountBalanceChanges: Record<string, number> = {};

    for (const t of transactions) {
      // Safe conversion of Decimal → number
      const amount =
        typeof t.amount === "object" && t.amount !== null && "toNumber" in t.amount
          ? t.amount.toNumber()
          : Number(t.amount);

      const change = t.type === "INCOME" ? -amount : amount;

      accountBalanceChanges[t.accountId] =
        (accountBalanceChanges[t.accountId] || 0) + change;
    }

    // Perform everything in ONE DB transaction
    await prismaDb.$transaction(async (tx) => {
      // 1. Delete all selected transactions
      await tx.transaction.deleteMany({
        where: { id: { in: transactionIds }, userId: User.id },
      });

      // 2. Update every affected account balance
      for (const [accountId, change] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: { increment: change },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/[id]`);

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
