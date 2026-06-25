/*
  Warnings:

  - The `estado_transaccion` column on the `Transaccion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[referencia_pago]` on the table `Transaccion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_comprador` to the `Transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_vendedor` to the `Transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `Transaccion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoTransaccion" AS ENUM ('PENDIENTE', 'APROBADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Transaccion" ADD COLUMN     "estado_proveedor" TEXT,
ADD COLUMN     "id_comprador" TEXT NOT NULL,
ADD COLUMN     "id_pago_proveedor" TEXT,
ADD COLUMN     "id_preferencia_pago" TEXT,
ADD COLUMN     "id_vendedor" TEXT NOT NULL,
ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'ARS',
ADD COLUMN     "monto" INTEGER NOT NULL,
ADD COLUMN     "referencia_pago" TEXT,
DROP COLUMN "estado_transaccion",
ADD COLUMN     "estado_transaccion" "EstadoTransaccion" NOT NULL DEFAULT 'PENDIENTE';

-- CreateTable
CREATE TABLE "Vendedor" (
    "id_vendedor" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("id_vendedor")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id_venta" SERIAL NOT NULL,
    "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_transaccion" INTEGER NOT NULL,
    "id_vendedor" TEXT NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id_venta")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendedor_email_key" ON "Vendedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Venta_id_transaccion_key" ON "Venta"("id_transaccion");

-- CreateIndex
CREATE UNIQUE INDEX "Transaccion_referencia_pago_key" ON "Transaccion"("referencia_pago");

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_transaccion_fkey" FOREIGN KEY ("id_transaccion") REFERENCES "Transaccion"("id_transaccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_vendedor_fkey" FOREIGN KEY ("id_vendedor") REFERENCES "Vendedor"("id_vendedor") ON DELETE RESTRICT ON UPDATE CASCADE;
