import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

const ARCJET_KEY = process.env.ARCJET_KEY;
if (!ARCJET_KEY) {
  throw new Error("ARCJET_KEY environment variable is required");
}

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

// 1️⃣ Clerk FIRST
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return (await auth()).redirectToSignIn();
  }

  return NextResponse.next();
});

// 2️⃣ Arcjet AFTER
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
