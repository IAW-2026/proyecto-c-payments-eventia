# Eventia - Payments App

## Deploy de produccion

https://proyecto-c-payments-eventia.vercel.app

## Usuarios de prueba

| Rol | Email |
| --- | --- |
| Administrador | admin+clerk_test@iaw.com |
| Vendedor | seller+clerk_test@iaw.com |
| Comprador | buyer+clerk_test@iaw.com |

Todos los usuarios usan la misma contrasena:

```txt
iawuser#
```

## Instrucciones de uso

- Iniciar sesion con alguno de los usuarios de prueba. La app redirige automaticamente segun el rol del usuario.
- El administrador puede ver metricas, buscar, filtrar y paginar transacciones desde `/admin`.
- El vendedor puede consultar sus transacciones, filtrar por estado y ver montos a acreditar desde `/vendedor`.
- El comprador puede consultar sus pagos y continuar checkouts pendientes desde `/comprador`.
- La app usa Mercado Pago en modo sandbox. Para pagos aprobados, el webhook actualiza la transaccion y registra la venta.

## Descripcion del proyecto

Eventia Payments App es el modulo encargado de gestionar pagos dentro de Eventia. La aplicacion recibe solicitudes de compra desde Buyer, crea transacciones, genera preferencias de pago con Mercado Pago y actualiza el estado final mediante webhooks.

La app cuenta con base de datos PostgreSQL propia gestionada con Prisma. Registra transacciones, vendedores y ventas aprobadas, manteniendo el historial aun cuando una compra se cancela.

Tambien expone endpoints REST pensados para la integracion con otras apps del proyecto. En esta version, Payments se comunica con los deploys reales de Buyer, Seller y Shipping mediante URLs y API keys configuradas por variables de entorno.

## Notas para la correccion

- La base de datos de produccion contiene datos precargados para evaluar paneles, filtros, paginacion, metricas y estados de transaccion.
- Los roles se gestionan con Clerk. El rol interno del administrador es `adminPayments`.
- En pruebas con Mercado Pago sandbox se observo que, ocasionalmente, algunos pagos quedan temporalmente en procesamiento o las notificaciones se demoran. Al reanudarse el servicio, los webhooks pendientes llegan a la aplicacion y las transacciones se actualizan correctamente en la base de datos.
- Las cancelaciones solo se permiten sobre transacciones aprobadas. No se elimina la venta; se conserva el registro historico y las metricas consideran solo transacciones aprobadas.
- La tabla de vendedores conserva campos `nombre` y `email` como datos auxiliares historicos. En la integracion real entre aplicaciones, Payments solo necesita persistir el `id_vendedor` recibido desde Seller, por lo que esos campos podrian eliminarse en una migracion posterior.
- Sobre el rendimiento: las paginas de panel son vistas dinamicas protegidas que consultan la base de datos en tiempo real. Por ese motivo, su rendimiento puede depender de la respuesta de Neon/Vercel y no se optimizaron como paginas estaticas publicas.
- Sobre SEO: las paginas protegidas (`/admin`, `/vendedor`, `/comprador`) requieren autenticacion y fueron excluidas del rastreo mediante `robots.txt`. En una integracion completa, la indexacion tendria mas sentido en las paginas publicas de la plataforma, que pertenecen principalmente a las apps de Buyer/Seller.

## Pruebas con Mercado Pago sandbox

Al redireccionar a Mercado Pago, ingresar con la siguiente cuenta de prueba:

| Dato | Valor |
| --- | --- |
| Usuario | TESTUSER8159514561346274810 |
| Contrasena | jIwVXXz1jW |
| Codigo de verificacion | 582778 |

Tarjetas de prueba sugeridas:

| Tipo | Numero | Codigo | Vencimiento | DNI |
| --- | --- | --- | --- | --- |
| Mastercard credito | 5031 7557 3453 0604 | 123 | 11/30 | 1234567 |
| Mastercard debito | 5287 3383 1025 3304 | 123 | 11/30 | 1234567 |

Para probar resultados, completar el nombre del titular con:

| Resultado esperado | Nombre del titular |
| --- | --- |
| Aprobado | APRO |
| Rechazado | OTHE, FUND o EXPI |
| Pendiente | CONT |
