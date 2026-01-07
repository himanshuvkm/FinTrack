import { cache } from "react";
import { currentUser } from "@clerk/nextjs/server";
import prismaDb from "./prisma";

export const checkUser = cache(async () => {
  const user = await currentUser();
  if (!user) return null;

  const loggedInUser = await prismaDb.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (loggedInUser) return loggedInUser;

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return prismaDb.user.create({
    data: {
      clerkUserId: user.id,
      name: fullName || user.username || "Unnamed User",
      imageUrl: user.imageUrl ?? "",
      email: user.emailAddresses[0]?.emailAddress ?? "",
    },
  });
});
