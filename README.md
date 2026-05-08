# Eventia - Payments App

Aplicación web desarrollada con Next.js y App Router.

## Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS

## Metodología:
- Git Flow
- Pull Requests
- Releases con tags

## Desarrollo

Para ejecutar el proyecto localmente:

```bash
npm run dev 
```

## Base de Datos

El módulo de **Payments** utiliza una base de datos PostgreSQL hospedada en **Neon** y gestionada a través de **Prisma ORM**. El diseño está orientado a procesar cobros de terceros (vendedores) y mantener un historial de transacciones vinculado a la **Buyer App**.

### Entidad Relación 

La base de datos se compone de tres tablas principales:

1.  **Vendedor**: Almacena la información de los organizadores.
2.  **Transaccion**: Registra cada intento de pago. Se vincula con el resto de las apps mediante el campo `id_pedido`.
3.  **Venta**: Registro consolidado de los pagos aprobados. Una transacción exitosa genera una venta única.



### 🚀 Comandos de Prisma

Si realizas cambios en el esquema o necesitas sincronizar la base de datos localmente, utiliza los siguientes comandos:

* **Sincronizar cambios (Migraciones):**
    ```bash
    npx prisma migrate dev --name <nombre_del_cambio>
    ```
* **Abrir el explorador de base de datos (Visual):**
    ```bash
    npx prisma studio
    ```

