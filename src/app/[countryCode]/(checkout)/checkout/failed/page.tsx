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
