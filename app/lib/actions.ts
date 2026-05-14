'use server';
import preference from '@/integraciones/mercadopago';

export async function crearPago() {
  try {
    const res = await preference.create({
      
      body: {
        items: [
          {
            id: 'codigo-entrada-1',
            title: 'Entrada Eventia Test',
            quantity: 1,
            unit_price: 100, 
          }
        ],
        back_urls: {
        success: process.env.NEXT_PUBLIC_BACK_URL_SUCCESS,
        failure: process.env.NEXT_PUBLIC_BACK_URL_FAILURE,
        pending: process.env.NEXT_PUBLIC_BACK_URL_PENDING,
    },
        //auto_return: "approved",
      }
    });

    console.log("¡URL Generada con éxito!", res.init_point);
    return res.init_point; 
    
  } catch (error) {
    console.error("Error detallado de MP:", error);
    return null;
  }
}