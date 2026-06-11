import { protegerRutaPorRol } from "@/lib/auth/guards";

export default async function VendedorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protegerRutaPorRol(["seller"]);

  return children;
}
