import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// /sign-in(.*)
const isPublicRoute = createRouteMatcher(['/', '/calorie-calculator','/sign-in(.*)','/sign-up(.*)', '/api/webhooks(.*)', '/goal'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}