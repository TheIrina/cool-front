"use client"

import { isContraEntrega, isManual, isMercadopago, isStripe } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useMercadopagoFormData } from "../payment-form-provider"
import { confirmMercadopagoPayment } from "@lib/data/payment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
      case isMercadopago(paymentSession?.provider_id):
        return (
        <MercadopagoPaymentButton
          notReady={false}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isContraEntrega(paymentSession?.provider_id):
      return (
        <ContraEntregaPaymentButton notReady={notReady} data-testid={dataTestId} cart={cart} />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Seleccionar método de pago</Button>
  }
}

const StripePaymentButton = ({
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

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err: any) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    const clientSecret = (session?.data as Record<string, unknown> | undefined)?.client_secret

    if (!clientSecret || typeof clientSecret !== "string") {
      setErrorMessage("No se pudo obtener el client secret de Stripe.")
      setSubmitting(false)
      return
    }

    const billingName = [
      cart.billing_address?.first_name,
      cart.billing_address?.last_name,
    ]
      .filter(Boolean)
      .join(" ") || undefined

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: billingName,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email || undefined,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

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

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err: any) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

import { updateCart } from "@lib/data/cart"

const ContraEntregaPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
  cart,
}: {
  notReady: boolean
  "data-testid"?: string
  cart: HttpTypes.StoreCart
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { contraEntregaData } = useMercadopagoFormData()

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err: any) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)
    
    if (contraEntregaData) {
        // Update cart with data from form
        try {
            const names = contraEntregaData.fullName.split(" ")
            const firstName = names[0]
            const lastName = names.slice(1).join(" ") || "."

            await updateCart({
                email: contraEntregaData.email,
                shipping_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: contraEntregaData.phone,
                    address_1: contraEntregaData.address,
                    address_2: contraEntregaData.references,
                    postal_code: contraEntregaData.postalCode,
                    province: contraEntregaData.state,
                    city: cart.shipping_address?.city || "Default City", 
                    country_code: cart.shipping_address?.country_code || "co",
                },
                billing_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: contraEntregaData.phone,
                    address_1: contraEntregaData.address,
                    address_2: contraEntregaData.references,
                    postal_code: contraEntregaData.postalCode,
                    province: contraEntregaData.state,
                    city: cart.shipping_address?.city || "Default City",
                    country_code: cart.shipping_address?.country_code || "co",
                }
            })
            // Force revalidation or re-fetch of cart might be needed here if updateCart invalidates shipping methods
            // However, usually updating address *might* invalidate shipping methods if the region changes.
            // If we are just updating details within the same region/zip (mostly), it *should* be fine,
            // BUT Medusa might be strict.
            
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : String(e))
            setSubmitting(false)
            return
        }
    }
    
    onPaymentCompleted()
  }

  return (
    <>
      <div className="flex items-center gap-x-2 bg-ui-bg-subtle p-4 mb-4 rounded-md text-ui-fg-subtle">
        <Text>Pedido cobrado en el lugar de entrega</Text>
      </div>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Confirmar pedido
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
