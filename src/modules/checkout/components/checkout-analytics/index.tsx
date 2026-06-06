"use client"

import { useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"

export default function CheckoutAnalytics({ cart }: { cart: HttpTypes.StoreCart }) {
  const trackedCartId = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !cart) return
    if (trackedCartId.current === cart.id) return
    trackedCartId.current = cart.id

    const currency = cart.currency_code?.toUpperCase() || "USD"
    const value = cart.subtotal ? cart.subtotal / 100 : 0
    const items = cart.items || []

    if (typeof window.fbq === "function") {
      window.fbq('track', 'InitiateCheckout', {
        content_type: 'product',
        content_ids: items.map(item => item.variant_id),
        num_items: items.length,
        value: value,
        currency: currency
      }, { eventID: `checkout_${cart.id}` })
    }

    if (typeof window.gtag === "function") {
      window.gtag('event', 'begin_checkout', {
        currency: currency,
        value: value,
        items: items.map(item => ({
          item_id: item.variant_id,
          item_name: item.title,
          price: item.unit_price ? item.unit_price / 100 : 0,
          quantity: item.quantity
        }))
      })
    }
  }, [cart])

  return null
}
