"use client";

import { useState } from "react";
import { arizonia } from "@/app/ui/fonts";
import ResumenPedido from "@/app/ui/ResumenPedido";
import DesgloseCompra from "@/app/ui/DesgloseCompra";

export default function PaginaDePrueba() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const datosEvento = {
    titulo: "Taller de Cerámica",
    fecha: "Sábado, 24 de Mayo — 16:00 a 19:00",
    lugar: "Barrio Italia, Santiago",
    imagen: "https://images.unsplash.com/photo-1565192647048-f997ed87f5e2?q=80&w=600&auto=format&fit=crop", // Imagen cálida real
    items: [
      { nombre: "Entrada General", cantidad: 2, precio: 14000 },
      { nombre: "Entrada Amigo", cantidad: 2, precio: 25000 }
    ],
    total: 78000
  };

  const procesarIntencionDePago = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("/api/payments/nuevaTransaccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPedido: 30,
          idEvento: 145,
          monto: datosEvento.total,
          idComprador: "user_comprador_sandbox",
        }),
      });

      const tipoContenido = respuesta.headers.get("content-type");

      if (!tipoContenido?.includes("application/json")) {
        const texto = await respuesta.text();
        console.error("Respuesta inesperada del servidor:", texto);
        alert("El servidor no devolvio una respuesta JSON valida");
        return;
      }

      const data = await respuesta.json();

      if (respuesta.ok && data.preferenceId) {
        setPreferenceId(data.preferenceId);
      } else {
        alert("Error al obtener la preferencia");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    // 1. Fondo crema cálido con gradiente suave orgánico de fondo
    <div className="bg-[#EFF9F0]/60 bg-gradient-to-tr from-[#EFF9F0] via-white to-[#F7EBE8]/40 min-h-screen text-slate-700 antialiased selection:bg-[#6B4D57] selection:text-white px-6 py-10 relative overflow-hidden">
      
      {/* Blurs orgánicos de fondo de diseño aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#6B4D57]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Contenedor Principal Editorial */}
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header con el Logo */}
        <header className="flex flex-col items-center mb-10 text-center">
          <h1 className={`text-6xl md:text-7xl text-[#6B4D57] font-normal tracking-wide ${arizonia.className}`}>
            eventia
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B4D57]/60 font-semibold mt-1">Experiencias & Talleres</p>
        </header>

        {/* 6. STEPPER PREMIUM REESTRUCTURADO */}
        <nav className="flex items-center justify-center max-w-md mx-auto mb-14 relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200/70 z-0" />
          
          <div className="flex justify-between w-full relative z-10">
            <div className="flex flex-col items-center gap-2 bg-transparent">
              <div className="w-7 h-7 rounded-full bg-slate-300 text-white flex items-center justify-center text-xs font-bold shadow-sm">✓</div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Selección</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#6B4D57] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#6B4D57]/10 shadow-md">2</div>
              <span className="text-[11px] font-black tracking-wider uppercase text-[#6B4D57]">Pago Seguro</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">Confirmación</span>
            </div>
          </div>
        </nav>

        {/* Grid Principal más integrado */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ResumenPedido 
            titulo={datosEvento.titulo}
            fecha={datosEvento.fecha}
            lugar={datosEvento.lugar}
            items={datosEvento.items} imagen={"null"}          />

          <DesgloseCompra 
            total={datosEvento.total}
            preferenceId={preferenceId}
            cargando={cargando}
            alIniciarCompra={procesarIntencionDePago}
          />
        </main>
      </div>
    </div>
  );
}
