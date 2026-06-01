ALTER TABLE "Venta"
ADD COLUMN "monto_bruto" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "porcentaje_comision" DECIMAL(5,2) NOT NULL DEFAULT 12.00,
ADD COLUMN "monto_comision" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "monto_neto_vendedor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "moneda" TEXT NOT NULL DEFAULT 'ARS';

UPDATE "Venta" AS venta
SET
  "monto_bruto" = transaccion."monto",
  "porcentaje_comision" = 12.00,
  "monto_comision" = ROUND(transaccion."monto" * 0.12)::INTEGER,
  "monto_neto_vendedor" = transaccion."monto" - ROUND(transaccion."monto" * 0.12)::INTEGER,
  "moneda" = transaccion."moneda"
FROM "Transaccion" AS transaccion
WHERE venta."id_transaccion" = transaccion."id_transaccion";
