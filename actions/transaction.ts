"use server";

import { auth } from "@clerk/nextjs/server";
import  prismaDb  from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {request} from "@arcjet/next"
import { aj } from "@/lib/arcjet";
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export type FormDataTransaction = {
  type: "INCOME" | "EXPENSE";
  amount: string; 
  date: Date;
  accountId: string;
  category: string;
  description?: string;
  isRecurring?: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
};


const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const serializeAmount = (obj: any) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// Create Transaction
export async function createTransaction(data: FormDataTransaction) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

//Arcjet logic
    const req = await request()

const decision = await aj.protect(req, {
  userId,
  requested: 1
});  

    if(decision.isDenied()){
     if(decision.reason.isRateLimit()){
      const {remaining ,reset}=decision.reason;
      console.error ({
        code:"RATE_LIMIT_EXCEEDED", 
        details:{
          remaining,
          resetInSeconds : reset,
        }
      })
      throw new Error("Rate limit exceeded. Please try again later.");
     }
      throw new Error("Request denied.");
    }



    const user = await prismaDb.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await prismaDb.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -parseFloat(data.amount) : parseFloat(data.amount);
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await prismaDb.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate({startDate: data.date, interval: data.recurringInterval})
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}


function calculateNextRecurringDate({startDate, interval}:{startDate:Date,interval:"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"}) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

export async function scanReceipt(file: Blob) {
  try {
    // Convert file → base64
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (number only)
      - Date (ISO string)
      - Description (short summary)
      - Merchant/store name
      - Suggested category from: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense

      Respond ONLY with JSON:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64String,
                mimeType: file.type,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    console.log(result);
    const responseText = result.text;

    // Remove markdown ```json blocks etc.
    const cleanedText = responseText
      .replace(/```json|```/g, "")
      .trim();

    const json = JSON.parse(cleanedText);

    return {
      amount: Number(json.amount),
      date: new Date(json.date),
      description: json.description,
      category: json.category,
      merchantName: json.merchantName,
    };
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}
