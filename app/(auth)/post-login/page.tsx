import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { obtenerRolDesdeClaims, obtenerRutaPorRol } from "@/lib/auth/roles";

export default async function PostLoginPage() {
  const { sessionClaims } = await auth();
  const rol = obtenerRolDesdeClaims(sessionClaims);

  redirect(obtenerRutaPorRol(rol));
}
