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

  // 1. Validar si ya existe una orden activa asociada a este id de carrito (Race Condition Handler)
  try {
    const { orders } = await sdk.store.order.list({
      cart_id: session_id
    } as any)

    if (orders && orders.length > 0) {
      const order = orders[0]
      const countryCode = order.shipping_address?.country_code?.toLowerCase() || "co"
      await removeCartId()
      redirect(`/${countryCode}/order/${order.id}/confirmed`)
    }
  } catch (error) {
    console.error("Error al buscar orden existente por cart_id:", error)
  }

  // 2. Si no se ha creado la orden por el Webhook aún, completamos el carrito manualmente
  try {
    await placeOrder(session_id)
  } catch (error) {
    console.error("Error al completar el pedido en confirmed page:", error)
    
    // Doble verificación: en caso de que se haya completado justo durante la llamada a placeOrder
    try {
      const { orders: retryOrders } = await sdk.store.order.list({
        cart_id: session_id
      } as any)

      if (retryOrders && retryOrders.length > 0) {
        const order = retryOrders[0]
        const countryCode = order.shipping_address?.country_code?.toLowerCase() || "co"
        await removeCartId()
        redirect(`/${countryCode}/order/${order.id}/confirmed`)
      }
    } catch (retryError) {
      console.error("Error en re-verificación de orden:", retryError)
    }

    // Si todo falla y la orden no se procesó
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

  // Visual en caso de que tarde un instante en redireccionar
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800 mb-4"></div>
      <h1 className="text-lg font-semibold text-neutral-800">Finalizando tu compra...</h1>
      <p className="text-sm text-neutral-500">Estamos validando tu pago y asegurando tu stock de productos.</p>
    </div>
  )
}
