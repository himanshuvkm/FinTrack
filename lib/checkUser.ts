import { currentUser } from "@clerk/nextjs/server";
import  prismaDb  from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    // Check if user already exists
    const loggedInUser = await prismaDb.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Create a new user
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const newUser = await prismaDb.user.create({
      data: {
        clerkUserId: user.id,
        name: fullName || user.username || "Unnamed User",
        imageUrl: user.imageUrl ?? "",
        email: user.emailAddresses[0]?.emailAddress ?? "",
      },          
    });

    return newUser;
  } catch (err) {
    console.error("❌ checkUser error:", err);
    return null;
  }
};
