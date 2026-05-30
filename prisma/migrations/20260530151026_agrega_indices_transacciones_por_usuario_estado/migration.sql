-- CreateIndex
CREATE INDEX "Transaccion_id_comprador_estado_transaccion_creado_en_idx" ON "Transaccion"("id_comprador", "estado_transaccion", "creado_en");

-- CreateIndex
CREATE INDEX "Transaccion_id_vendedor_estado_transaccion_creado_en_idx" ON "Transaccion"("id_vendedor", "estado_transaccion", "creado_en");
