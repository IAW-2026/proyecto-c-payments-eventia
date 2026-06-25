"use client";

import DesgloseCompra from "@/componentes/ui/DesgloseCompra";

type CheckoutClientProps = {
  preferenceId: string;
  comision: number;
  total: number;
  totalConComision: number;
};

export default function CheckoutClient({
  preferenceId,
  comision,
  total,
  totalConComision,
}: CheckoutClientProps) {
  return (
    <div>
      <DesgloseCompra
        total={total}
        comision={comision}
        totalConComision={totalConComision}
        preferenceId={preferenceId}
      />
    </div>
  );
}
