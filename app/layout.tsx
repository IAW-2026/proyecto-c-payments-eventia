// app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/componentes/NavBar";
import { bricolage, climateCrisis, manrope } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventia - Pagos",
  description:
    "Gestiona tus pagos de manera facil y segura con Eventia. Nuestra plataforma de pagos integrada te permite realizar transacciones rapidas y seguras para tus eventos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        layout: {
          hideExternalLinks: true,
        },
        elements: {
          footerAction: { display: "none" },
        },
      }}
    >
      <html
        lang="es"
        className={`${climateCrisis.variable} ${bricolage.variable} ${manrope.variable} h-full antialiased`}
      >
        <body>
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
