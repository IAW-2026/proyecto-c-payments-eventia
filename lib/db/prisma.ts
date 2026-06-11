import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const stringConexion = process.env.DATABASE_URL;

if (!stringConexion) {
  throw new Error("DATABASE_URL no esta definido");
}

const adaptador = new PrismaPg({ connectionString: stringConexion });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: adaptador });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
