"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isMercadopago, isStripe } from "@lib/constants"
import MercadopagoWrapper from "./mercadopago-wrapper"
import PaymentFormProvider from "../payment-form-provider"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const mercadopagoKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

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

  if (
    isStripe(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <PaymentFormProvider>
        <StripeWrapper
          paymentSession={paymentSession}
          stripeKey={stripeKey}
          stripePromise={stripePromise}
        >
          {children}
        </StripeWrapper>
      </PaymentFormProvider>
    )
  }

  return (
    <PaymentFormProvider>
      <div>{children}</div>
    </PaymentFormProvider>
  )
}

export default PaymentWrapper