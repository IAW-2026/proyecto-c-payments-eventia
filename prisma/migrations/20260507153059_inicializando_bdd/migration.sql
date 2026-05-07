-- CreateTable
CREATE TABLE "Transaccion" (
    "id_transaccion" SERIAL NOT NULL,
    "estado_transaccion" TEXT NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id_transaccion")
);
