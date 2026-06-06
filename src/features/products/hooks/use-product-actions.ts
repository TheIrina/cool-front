"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import type { UseProductActionsReturn } from "../types/product-actions.types"

/**
 * Maps variant options array to a Record<optionId, value>.
 */
const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> => {
  return (variantOptions ?? []).reduce<Record<string, string>>(
    (acc, varopt) => {
      if (varopt.option_id) {
        acc[varopt.option_id] = varopt.value ?? ""
      }
      return acc
    },
    {}
  )
}

/**
 * useProductActions — "The Brain" of the ProductActions feature.
 *
 * Encapsulates variant selection, inventory checks, quantity management,
 * and add-to-cart logic.
 */
export function useProductActions(
  product: HttpTypes.StoreProduct
): UseProductActionsReturn {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // ── Auto-select when single variant ──────────────────────────────────
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  // ── Derived: selected variant ────────────────────────────────────────
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // ── Derived: valid variant check ─────────────────────────────────────
  const isValidVariant = useMemo(() => {
    return (
      product.variants?.some((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      }) ?? false
    )
  }, [product.variants, options])

  // ── Derived: stock check ─────────────────────────────────────────────
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    )
      return true
    return false
  }, [selectedVariant])

  // ── Derived: max quantity ────────────────────────────────────────────
  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return undefined
    if (!selectedVariant.manage_inventory) return undefined
    if (selectedVariant.allow_backorder) return undefined
    return selectedVariant.inventory_quantity || 0
  }, [selectedVariant])

  // ── Reset quantity when exceeds max ──────────────────────────────────
  useEffect(() => {
    if (maxQuantity !== undefined && quantity > maxQuantity) {
      setQuantity(Math.max(1, maxQuantity))
    }
  }, [maxQuantity, quantity])

  // ── Intersection observer ────────────────────────────────────────────
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // ── Actions ──────────────────────────────────────────────────────────
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    const price = selectedVariant.calculated_price?.calculated_amount 
      ? selectedVariant.calculated_price.calculated_amount / 100
      : 0
    const currency = selectedVariant.calculated_price?.currency_code?.toUpperCase() || "USD"

    if (typeof window.fbq === "function") {
      window.fbq('track', 'AddToCart', {
        content_type: 'product',
        content_ids: [selectedVariant.id],
        content_name: product.title,
        value: price * quantity,
        currency: currency
      }, { eventID: `add_${selectedVariant.id}_${Date.now()}` })
    }

    if (typeof window.gtag === "function") {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: price * quantity,
        items: [
          {
            item_id: selectedVariant.id,
            item_name: product.title,
            price: price,
            quantity: quantity
          }
        ]
      })
    }

    setIsAdding(false)
  }

  // ── Public API ───────────────────────────────────────────────────────
  return {
    options,
    isAdding,
    quantity,
    selectedVariant,
    isValidVariant,
    inStock,
    maxQuantity,
    inView,
    actionsRef,
    setOptionValue,
    setQuantity,
    handleAddToCart,
  }
}
