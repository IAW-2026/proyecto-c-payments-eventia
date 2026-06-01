import { protegerRutaPorRol } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protegerRutaPorRol(["adminPayments"]);

  return children;
}
