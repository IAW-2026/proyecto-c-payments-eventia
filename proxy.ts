import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  '/pago-exitoso(.*)', 
  '/pago-fallido(.*)',
  '/api/payments/nuevaTransaccion(.*)',
  '/api/seller(.*)',
  '/api/payments/webhooks/mercadopago(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)){
        await auth.protect()
    }
})

export const config = {
   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
 } 
