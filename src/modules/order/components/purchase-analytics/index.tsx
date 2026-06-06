"use client"

import { useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"

export default function PurchaseAnalytics({ order }: { order: HttpTypes.StoreOrder }) {
  const trackedOrderId = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !order) return
    if (trackedOrderId.current === order.id) return
    trackedOrderId.current = order.id

    const sessionKey = `tracked_order_${order.id}`
    if (sessionStorage.getItem(sessionKey)) return
    sessionStorage.setItem(sessionKey, "true")

    const currency = order.currency_code?.toUpperCase() || "USD"
    const value = order.total ? order.total / 100 : 0
    const items = order.items || []

    if (typeof window.fbq === "function") {
      window.fbq('track', 'Purchase', {
        content_type: 'product',
        content_ids: items.map(item => item.variant_id),
        value: value,
        currency: currency
      }, { eventID: `purchase_${order.id}` })
    }

    if (typeof window.gtag === "function") {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
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
  }, [order])

  return null
}
