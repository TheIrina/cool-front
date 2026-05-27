<h1 align="center">
  Cool Bordados
</h1>

<p align="center">
Tienda online de bordados personalizados de alta calidad. Construida con Next.js 15 y Medusa para una experiencia de compra excepcional.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerrequisitos

Para usar Cool Bordados, necesitas tener un servidor Medusa ejecutándose localmente en el puerto 9000.
Para una configuración rápida, ejecuta:

```shell
npx create-medusa-app@latest
```

Consulta la [documentación de create-medusa-app](https://docs.medusajs.com/learn/installation) para más detalles y solución de problemas.

# Descripción General

Cool Bordados está construido con:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Características incluidas:

- Soporte completo de ecommerce:
  - Página de Detalle de Producto
  - Página de Vista General de Productos
  - Colecciones de Productos
  - Carrito de Compras
  - Checkout con Stripe
  - Cuentas de Usuario
  - Detalles de Órdenes
- Soporte completo de Next.js 15:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering

# Inicio Rápido

### Configurando las variables de entorno

Navega al directorio de tu proyecto y prepara tus variables de entorno:

```shell
cd cool-bordados-storefront/
mv .env.template .env.local
```

### Instalar dependencias

Usa Yarn para instalar todas las dependencias.

```shell
yarn
```

### Comenzar a desarrollar

Ahora estás listo para iniciar tu proyecto.

```shell
yarn dev
```

### Abre el código y comienza a personalizar

¡Tu sitio ahora está ejecutándose en http://localhost:8000!

# Integraciones de Pago

Por defecto, Cool Bordados soporta las siguientes integraciones de pago:

- [Stripe](https://stripe.com/)

Para habilitar las integraciones necesitas agregar lo siguiente a tu archivo `.env.local`:

```shell
NEXT_PUBLIC_STRIPE_KEY=<tu-clave-publica-de-stripe>
```

También necesitarás configurar las integraciones en tu servidor Medusa. Consulta la [documentación de Medusa](https://docs.medusajs.com) para más información sobre cómo configurar [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Recursos

## Aprende más sobre Medusa

- [Sitio Web](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentación](https://docs.medusajs.com/)

## Aprende más sobre Next.js

- [Sitio Web](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentación](https://nextjs.org/docs)

---

## Cool Bordados

Cool Bordados es una tienda especializada en bordados personalizados de alta calidad. Ofrecemos una amplia gama de productos bordados para satisfacer todas tus necesidades de personalización.
