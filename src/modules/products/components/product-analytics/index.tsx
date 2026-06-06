"use client"

import { useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductAnalyticsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductAnalytics({ product, region }: ProductAnalyticsProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !product) return

    const variant = product.variants?.[0]
    const price = variant?.calculated_price?.calculated_amount 
      ? variant.calculated_price.calculated_amount / 100 
      : 0
    const currency = region.currency_code.toUpperCase()

    // 1. Meta Pixel ViewContent
    if (typeof window.fbq === "function") {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [variant?.id || product.id],
        content_name: product.title,
        value: price,
        currency: currency
      }, { eventID: `view_${variant?.id || product.id}` })
    }

    // 2. Google Analytics view_item
    if (typeof window.gtag === "function") {
      window.gtag('event', 'view_item', {
        currency: currency,
        value: price,
        items: [
          {
            item_id: variant?.id || product.id,
            item_name: product.title,
            price: price,
            quantity: 1
          }
        ]
      })
    }
  }, [product, region])

  return null
}
