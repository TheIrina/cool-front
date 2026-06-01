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

  // 1. Completar el carrito de compra de inmediato para crear la orden con estado "awaiting payment"
  try {
    await placeOrder(session_id)
  } catch (error) {
    console.error("Error al completar el pedido pendiente:", error)
    
    // Verificar si se completó paralelamente vía Webhook
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
