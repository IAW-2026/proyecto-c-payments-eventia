import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/",
  "/sign-in(.*)",
  '/comprador/pago-exitoso(.*)', 
  '/comprador/pago-fallido(.*)',
  '/comprador/pago-pendiente(.*)',
  '/api/payments/nuevaTransaccion(.*)',
  '/api/payments/pedidoCancelado(.*)',
  '/api/payments/webhooks/mercadopago(.*)',
  '/api/payments/datos/(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)){
        await auth.protect()
    }
})

export const config = {
   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
 } 
