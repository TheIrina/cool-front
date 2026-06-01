# Mercado Pago Checkout Pro Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Mercado Pago Checkout Pro (Redirect Flow) into the storefront checkout flow, ensuring seamless payment redirection, transaction validation, callback handling, and backend synchronization.

**Architecture:** We transition from a local "bricks" payment layout to a native external redirection checkout. The storefront initializes the session passing the `session_id`, reads the active session redirect points returned by the backend, redirects the user to Mercado Pago, and handles return URLs using high-safety pages that check order creation or race conditions.

**Tech Stack:** Next.js (App Router), Medusa v2 JS SDK, Tailwind CSS, TypeScript.

---

### Task 1: Configure Environment Variables

**Files:**
- Modify: `.env`

- [ ] **Step 1: Append NEXT_PUBLIC_MERCADOPAGO_SANDBOX configuration**

Edit the `.env` file to ensure the sandbox flag is correctly initialized.

```env
NEXT_PUBLIC_MERCADOPAGO_SANDBOX=true
```

- [ ] **Step 2: Verify environment setup**

Ensure the server is running or restarted with the new environment variables.

---

### Task 2: Pass session_id on Payment Session Initiation

**Files:**
- Modify: `src/features/checkout/hooks/use-payment.ts:88-104`, `src/features/checkout/hooks/use-payment.ts:163-166`

- [ ] **Step 1: Update setPaymentMethodHandler to pass sessionData**

Replace lines 88-104 in `src/features/checkout/hooks/use-payment.ts` to include the `session_id` inside `data` when calling `initiatePaymentSession` for Mercado Pago.

```typescript
  const setPaymentMethodHandler = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (
      isStripeFunc(method) ||
      isMercadopago(method) ||
      isContraEntrega(method)
    ) {
      const sessionData = isMercadopago(method)
        ? { session_id: cart.id }
        : {}

      await initiatePaymentSession(cart, {
        provider_id: method,
        data: sessionData,
      }).catch(() => {
        setError(
          "Error al iniciar la sesión de pago. Por favor intenta nuevamente."
        )
      })
    }
  }
```

- [ ] **Step 2: Update handleSubmit to also pass sessionData during active session checks**

Modify lines 163-166 in `src/features/checkout/hooks/use-payment.ts`:

```typescript
      if (!checkActiveSession) {
        const sessionData = isMercadopago(selectedPaymentMethod)
          ? { session_id: cart.id }
          : {}

        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: sessionData,
        })
      }
```

- [ ] **Step 3: Remove unused brick handles from handleSubmit**

Clean up lines 180-196 in `src/features/checkout/hooks/use-payment.ts` which are related to local bricks:

```typescript
      // Remove or comment out bricks handling as we use redirect flow
```

Let's update the full function body or exact replacements in the final plan.

---

### Task 3: Simplify Payment Wrapper

**Files:**
- Modify: `src/modules/checkout/components/payment-wrapper/index.tsx`

- [ ] **Step 1: Simplify Mercado Pago session wrapping**

Modify `src/modules/checkout/components/payment-wrapper/index.tsx` to directly render children without calling `MercadopagoWrapper` (which triggers public key checks and React SDK initialization).

```typescript
  if (
    isMercadopago(paymentSession?.provider_id) &&
    paymentSession 
  ) {
    return (
      <PaymentFormProvider>
        <div>{children}</div>
      </PaymentFormProvider>
    )
  }
```

---

### Task 4: Clean up Payment Step UI

**Files:**
- Modify: `src/features/checkout/ui/payment-view.tsx`

- [ ] **Step 1: Remove `@mercadopago/sdk-react` and MpPaymentBrick**

Edit `src/features/checkout/ui/payment-view.tsx` to remove the import on line 19:
```typescript
// Remove: import { Payment as MpPaymentBrick } from "@mercadopago/sdk-react"
```

And replace the Mercado Pago Brick section (lines 130-151) with a beautiful static message:

```tsx
                        {/* MercadoPago Checkout Pro Banner */}
                        {isMercadopago(paymentMethod.id) &&
                          selectedPaymentMethod === paymentMethod.id && (
                            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col gap-y-3 mb-4">
                              <div className="flex items-center gap-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                <h4 className="text-sm font-semibold text-neutral-800">
                                  Mercado Pago (Checkout Pro)
                                </h4>
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                Al hacer clic en <strong>"Pagar con Mercado Pago"</strong> en el último paso, serás redirigido de forma 100% segura para completar tu compra. Podrás pagar usando tarjetas de crédito, débito, PSE, Efecty u otros medios locales disponibles.
                              </p>
                            </div>
                          )}
```

- [ ] **Step 2: Update action buttons condition**

Ensure that Mercado Pago is allowed to show the "Continuar a revisión" action button in this step by editing line 180:

```typescript
          {!isMp && !isCoEntrega && (
```
Change to:
```typescript
          {!isCoEntrega && (
```
Or allow Mercado Pago to go to review step using a general button.

---

### Task 5: Implement Redirection in Payment Button

**Files:**
- Modify: `src/modules/checkout/components/payment-button/index.tsx`

- [ ] **Step 1: Replace MercadopagoPaymentButton implementation**

Modify `MercadopagoPaymentButton` in `src/modules/checkout/components/payment-button/index.tsx` (lines 181-258) to read `init_point` or `sandbox_init_point` from session data and trigger redirect.

```tsx
const MercadopagoPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id === "mercadopago" || s.provider_id.startsWith("pp_mercadopago")
  )

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!cart || !session) {
      setErrorMessage("No se encontró una sesión de pago activa para Mercado Pago.")
      setSubmitting(false)
      return
    }

    try {
      const { init_point, sandbox_init_point } = session.data as {
        init_point?: string
        sandbox_init_point?: string
      }

      const isSandbox = process.env.NEXT_PUBLIC_MERCADOPAGO_SANDBOX === "true"
      const redirectUrl = isSandbox ? sandbox_init_point : init_point

      if (!redirectUrl) {
        throw new Error("No se pudo obtener la URL de redirección del servidor de pago.")
      }

      window.location.href = redirectUrl
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : "Error al inicializar la pasarela.")
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady}
        onClick={handlePayment}
        className="w-full"
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Pagar con Mercado Pago
      </Button>
      {errorMessage && (
        <ErrorMessage
          error={errorMessage}
          data-testid="mercadopago-payment-error-message"
        />
      )}
    </>
  )
}
```

---

### Task 6: Create Checkout Return Routes

**Files:**
- Create: `src/app/[countryCode]/(checkout)/checkout/confirmed/page.tsx`
- Create: `src/app/[countryCode]/(checkout)/checkout/failed/page.tsx`
- Create: `src/app/[countryCode]/(checkout)/checkout/pending/page.tsx`

- [ ] **Step 1: Create Confirmed (Success) page**

Write `src/app/[countryCode]/(checkout)/checkout/confirmed/page.tsx` as optimized page with double verification (Race Conditions).

```tsx
import { placeOrder } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { removeCartId } from "@lib/data/cookies"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CheckoutConfirmedPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect("/")
  }

  try {
    const { orders } = await sdk.store.order.list({
      cart_id: session_id
    })

    if (orders && orders.length > 0) {
      const order = orders[0]
      const countryCode = order.shipping_address?.country_code?.toLowerCase() || "co"
      await removeCartId()
      redirect(`/${countryCode}/order/${order.id}/confirmed`)
    }
  } catch (error) {
    console.error("Error al buscar orden existente por cart_id:", error)
  }

  try {
    await placeOrder(session_id)
  } catch (error) {
    console.error("Error al completar el pedido en confirmed page:", error)
    
    try {
      const { orders: retryOrders } = await sdk.store.order.list({
        cart_id: session_id
      })

      if (retryOrders && retryOrders.length > 0) {
        const order = retryOrders[0]
        const countryCode = order.shipping_address?.country_code?.toLowerCase() || "co"
        await removeCartId()
        redirect(`/${countryCode}/order/${order.id}/confirmed`)
      }
    } catch (retryError) {
      console.error("Error en re-verificación de orden:", retryError)
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 text-2xl font-bold">
          ✕
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Inconveniente al Registrar el Pedido</h1>
        <p className="text-neutral-600 mb-6 text-sm">
          Mercado Pago procesó tu pago correctamente, pero tuvimos un retraso en la sincronización con el sistema de inventarios. No te preocupes, el cobro ya fue registrado y nuestro soporte lo validará de inmediato.
        </p>
        <div className="flex gap-x-4">
          <a href="/" className="px-6 py-3 bg-black text-white rounded-md text-sm font-semibold hover:bg-neutral-800 transition">
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800 mb-4"></div>
      <h1 className="text-lg font-semibold text-neutral-800">Finalizando tu compra...</h1>
      <p className="text-sm text-neutral-500">Estamos validando tu pago y asegurando tu stock de productos.</p>
    </div>
  )
}
```

- [ ] **Step 2: Create Failed page**

Write `src/app/[countryCode]/(checkout)/checkout/failed/page.tsx`:

```tsx
import Link from "next/link"

export default async function CheckoutFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 text-2xl font-bold">
        ✕
      </div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">Pago No Completado</h1>
      <p className="text-neutral-600 mb-6 text-sm">
        No se pudo completar el cobro a través de Mercado Pago. Es posible que los datos de la tarjeta sean incorrectos, que no cuentes con saldo suficiente o que hayas decidido cancelar el proceso.
      </p>
      <div className="flex gap-x-4">
        <Link 
          href="/checkout?step=payment" 
          className="px-6 py-3 bg-black text-white rounded-md text-sm font-semibold hover:bg-neutral-800 transition"
        >
          Reintentar con otro medio
        </Link>
        <Link 
          href="/cart" 
          className="px-6 py-3 border border-neutral-300 rounded-md text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
        >
          Revisar Carrito
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Pending page**

Write `src/app/[countryCode]/(checkout)/checkout/pending/page.tsx`:

```tsx
import { placeOrder } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { removeCartId } from "@lib/data/cookies"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CheckoutPendingPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect("/")
  }

  try {
    await placeOrder(session_id)
  } catch (error) {
    console.error("Error al completar el pedido pendiente:", error)
    
    try {
      const { orders } = await sdk.store.order.list({
        cart_id: session_id
      })

      if (orders && orders.length > 0) {
        const order = orders[0]
        const countryCode = order.shipping_address?.country_code?.toLowerCase() || "co"
        await removeCartId()
        redirect(`/${countryCode}/order/${order.id}/confirmed`)
      }
    } catch (retryError) {
      console.error("Error en retry de búsqueda en pending page:", retryError)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 text-2xl font-bold">
        !
      </div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">Pago en Proceso de Sincronización</h1>
      <p className="text-neutral-600 mb-6 text-sm leading-relaxed">
        Mercado Pago está procesando tu transacción. Si seleccionaste un método de pago en efectivo (como Efecty), recuerda realizar el abono antes de la fecha límite indicada en el boleto de pago. 
        <br/><br/>
        <strong>Tu inventario ya ha sido reservado.</strong> Te enviaremos un correo electrónico de confirmación tan pronto el pago sea acreditado.
      </p>
      <a 
        href="/" 
        className="px-6 py-3 bg-black text-white rounded-md text-sm font-semibold hover:bg-neutral-800 transition"
      >
        Volver a la tienda
      </a>
    </div>
  )
}
```
