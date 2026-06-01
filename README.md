# Eventia - Payments App

## Deploy de produccion

https://proyecto-c-payments-eventia.vercel.app

## Usuarios de prueba

Todos los usuarios usan la misma contrasena:

```txt
iawuser#
```

| Rol | Email |
| --- | --- |
| Administrador | adminpayments+clerktest@iaw.com |
| Vendedor | seller+clerktest@iaw.com |
| Comprador | buyer+clerktest@iaw.com |

## Instrucciones de uso

- Iniciar sesion con alguno de los usuarios de prueba.
- El administrador puede ver metricas, buscar, filtrar y paginar transacciones desde `/admin`.
- El vendedor puede consultar sus transacciones, filtrar por estado y ver montos a acreditar desde `/vendedor`.
- El comprador puede iniciar un checkout de prueba desde `/comprador/checkout`.
- Para correr localmente, copiar `.env.example` como `.env` y completar las credenciales necesarias.
- La app usa Mercado Pago en modo sandbox. Para pagos aprobados, el webhook actualiza la transaccion y registra la venta.
- En el panel administrador se puede simular una cancelacion de Buyer ingresando el `idPedido` de una transaccion aprobada.

## Descripcion del proyecto

Eventia Payments App es el modulo encargado de gestionar pagos dentro del ecosistema Eventia. La aplicacion recibe solicitudes de compra desde Buyer, crea transacciones, genera preferencias de pago con Mercado Pago y actualiza el estado final mediante webhooks.

La app cuenta con base de datos PostgreSQL propia gestionada con Prisma. Registra transacciones, vendedores y ventas aprobadas, manteniendo el historial aun cuando una compra se cancela.

Tambien expone endpoints REST pensados para la integracion con otras apps del proyecto, incluyendo mocks de Buyer, Seller y Shipping para poder probar el flujo completo durante esta etapa.

## Notas para la correccion

- La base de datos de produccion contiene datos precargados para evaluar paneles, filtros, paginacion, metricas y estados de transaccion.
- Los roles se gestionan con Clerk. El rol interno del administrador es `adminPayments`.
- Las credenciales de Mercado Pago son de sandbox.
- En sandbox, Mercado Pago puede dejar algunos pagos de prueba como pendientes aunque se usen tarjetas/codigos esperados para rechazo. La app procesa `approved`, `rejected`, `cancelled` y estados pendientes segun lo informado por Mercado Pago.
- Las cancelaciones solo se permiten sobre transacciones aprobadas. No se elimina la venta; se conserva el registro historico y las metricas consideran solo transacciones aprobadas.
