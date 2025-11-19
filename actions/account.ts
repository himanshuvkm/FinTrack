"use server"
import prismaDb from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj: any) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.ammount) {
    serialized.ammount = obj.ammount.toNumber();
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

    const account =await prismaDb.account.update({
      where: {
        id: accountId,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard")
    const serializedAccount = serializeTransaction(account);
    return { success: true, data: serializedAccount };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}
