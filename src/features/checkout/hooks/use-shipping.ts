"use client"

import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { HttpTypes } from "@medusajs/types"
import type {
  ExtendedShippingOption,
  UseShippingReturn,
} from "../types/shipping.types"
import { PICKUP_OPTION_OFF, PICKUP_OPTION_ON } from "../types/shipping.types"

/**
 * useShipping — "The Brain" of the Shipping feature.
 *
 * Encapsulates ALL imperative logic: shipping method selection,
 * price calculation for calculated options, pickup/shipping toggle,
 * and checkout navigation.
 */
export function useShipping(
  cart: HttpTypes.StoreCart,
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
): UseShippingReturn {
  // ── State ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  // ── Routing ──────────────────────────────────────────────────────────
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  // ── Derived data (typed without `as any`) ────────────────────────────
  const extendedMethods =
    (availableShippingMethods as ExtendedShippingOption[] | null) ?? []

  const shippingMethods = extendedMethods.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const pickupMethods = extendedMethods.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = pickupMethods.length > 0

  // ── Price calculation for "calculated" shipping options ───────────────
  useEffect(() => {
    setIsLoadingPrices(true)

    if (shippingMethods.length) {
      const promises = shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res.forEach((r) => {
            if (r.status === "fulfilled" && r.value?.id) {
              pricesMap[r.value.id] = r.value.amount!
            }
          })

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (pickupMethods.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  // ── Reset error on step change ───────────────────────────────────────
  useEffect(() => {
    setError(null)
  }, [isOpen])

  // ── Actions ──────────────────────────────────────────────────────────
  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .then(() => {
        router.refresh()
      })
      .catch((err: Error) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // ── Public API ───────────────────────────────────────────────────────
  return {
    isOpen,
    isLoading,
    isLoadingPrices,
    error,
    shippingMethodId,
    showPickupOptions,
    calculatedPricesMap,
    shippingMethods,
    pickupMethods,
    hasPickupOptions,
    handleEdit,
    handleSubmit,
    handleSetShippingMethod,
  }
}
