import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { createRouteLoader } from 'next/dist/client/route-loader'

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)"
])

const ARCJET_KEY = process.env.ARCJET_KEY;
if (!ARCJET_KEY) {
  throw new Error('ARCJET_KEY environment variable is required');
}

const aj = arcjet({
  key: ARCJET_KEY,
  rules:[
    shield({
      mode:"LIVE",
    }),
    detectBot({
      mode:"LIVE",
      allow:["CATEGORY:SEARCH_ENGINE","GO_HTTP"]
    })
  ]
});

 clerkMiddleware(async(auth,req)=>{
  const {userId}= await auth()
  if(!userId && isProtectedRoute(req)){
    const {redirectToSignIn} = await auth()
    return redirectToSignIn();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

export default createMiddleware(aj, clerkMiddleware);