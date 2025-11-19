"use server";
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

    export async function createAccount(data: any) {
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
    //convert the balance into the float

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance Ammount");
    }

    //check if this is the first account user is creating

    const existingAccount = await prismaDb.account.findMany({
      where: {
        userId: User.id,
      },
    });

    // if(existingAccount){
    //     throw new Error("Account already exists");
    // }

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference

    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isdefault;

    //it will check if any account is default if it is default make it false

    if (shouldBeDefault) {
      await prismaDb.account.updateMany({
        where: {
          userId: User.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await prismaDb.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: User.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

export async function GetUserAccounts(){
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

    const accounts = await prismaDb.account.findMany({
        where: {
            userId: User.id,
          },
        orderBy:{createdAt:"desc"},
        include:{
            _count:{
                select:{
                    transactions:true
                }
            }
        }
    })
     const serializedAccount = accounts.map(serializeTransaction);
    return  serializedAccount ;
    
} catch (error:any) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
}

}