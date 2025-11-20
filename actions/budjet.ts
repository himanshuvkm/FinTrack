"use server"

import prismaDb from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function getBudgetData(accountId: any) {
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
    
    const budget = await prismaDb.budget.findFirst({
        where:{
            userId:User.id
        }
    });
     
    const currDate = new Date();
    const startOfMonth = new Date(
        currDate.getFullYear(),
        currDate.getMonth(),
        1
    );
    const endOfMonth = new Date(
        currDate.getFullYear(),
        currDate.getMonth() + 1,
        0
    );

    const expenses = await prismaDb.transaction.aggregate({
        where:{
            userId:User.id,
            type:'EXPENSE',
            date:{
                gte:startOfMonth,
                lte:endOfMonth
            },accountId,
        },
        _sum:{
            amount:true
        }
    });

     return{

        budget:budget?{...budget,amount:budget.amount.toNumber()}:null,
        currentExpenses : expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        :0,
     }


}catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

export async function updateBudget(amount: any) {
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
    
    const budget = await prismaDb.budget.upsert({
        where:{
            userId:User.id
        },
        update:{
            amount,
        },
        create:{
            userId:User.id,
            amount
        },
    })

    revalidatePath("/dashboard");
    return {
        success:true,
        data:{...budget,amount:budget.amount.toNumber() }
 }

    }catch (error: unknown) {
    console.log("Error updating budget",error)
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}