"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { obtenerRolDesdeUsuario } from "@/lib/auth/roles";

const linksBase = [
  { href: "/home", label: "Inicio", icon: "grid" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const rol = obtenerRolDesdeUsuario(user);
  const links = [
    ...linksBase,
    ...(rol === "adminPayments"
      ? [{ href: "/admin", label: "Dashboard", icon: "calendar" }]
      : []),
    ...(rol === "seller"
      ? [{ href: "/vendedor", label: "Vendedor", icon: "calendar" }]
      : []),
    ...(rol === "buyer"
      ? [{ href: "/comprador", label: "Mis pagos", icon: "calendar" }]
      : []),
  ];
  const esAuth = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const esHome = pathname === "/" || pathname === "/home";

  if (esHome) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-primary/15 bg-background/95 backdrop-blur-md">
      <div className="grid min-h-20 grid-cols-[minmax(120px,1fr)_auto_minmax(120px,1fr)] items-center gap-6 px-mobile-padding md:px-desktop-padding">
        <Link
          href="/home"
          className="font-label text-3xl font-black text-primary no-underline"
        >
          Eventia
        </Link>

        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Navegacion principal"
        >
          {links.map((link) => {
            const activo =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-label text-sm font-black no-underline transition hover:-translate-y-px hover:bg-surface-container-low ${
                  activo
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span
                  className={`relative inline-block h-[18px] w-[18px] shrink-0 ${
                    link.icon === "grid"
                      ? "bg-[linear-gradient(currentColor_0_0),linear-gradient(currentColor_0_0),linear-gradient(currentColor_0_0),linear-gradient(currentColor_0_0)] bg-[length:6px_6px,6px_6px,6px_6px,6px_6px] bg-[position:1px_1px,11px_1px,1px_11px,11px_11px] bg-no-repeat"
                      : "rounded border-2 border-current before:absolute before:left-0.5 before:right-0.5 before:top-[5px] before:border-t-2 before:border-current after:absolute after:-top-[5px] after:left-1 after:h-1.5 after:w-2 after:border-x-2 after:border-current"
                  }`}
                  aria-hidden="true"
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-h-11 items-center justify-end">
          {!esAuth && (
            isSignedIn ? (
              <UserButton />
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary-container px-5 font-label text-sm font-black text-background no-underline shadow-soft-ambient transition hover:-translate-y-px hover:bg-primary"
              >
                Iniciar sesion
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
