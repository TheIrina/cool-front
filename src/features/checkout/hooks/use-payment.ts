"use client"

import {
  isMercadopago,
  isContraEntrega,
  isStripe as isStripeFunc,
} from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { usePaymentFormData } from "@modules/checkout/components/payment-form-provider"
import type { HttpTypes } from "@medusajs/types"
import type { ExtendedCart, UsePaymentReturn } from "../types/payment.types"

/**
 * usePayment — "The Brain" of the Payment feature.
 *
 * Encapsulates ALL imperative logic: state management, payment session
 * initiation, contra-entrega validation, MercadoPago brick lifecycle,
 * and checkout navigation.
 */
export function usePayment(cart: HttpTypes.StoreCart): UsePaymentReturn {
  const extendedCart = cart as ExtendedCart

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  // ── State ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [termsAccepted, setTermsAccepted] = useState(false)

  // ── Context ──────────────────────────────────────────────────────────
  const { setFormData, setAdditionalData, contraEntregaData } =
    usePaymentFormData()

  // ── Routing ──────────────────────────────────────────────────────────
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  // ── Sync active session ──────────────────────────────────────────────
  useEffect(() => {
    if (activeSession?.provider_id) {
      setSelectedPaymentMethod(activeSession.provider_id)
    }
  }, [activeSession?.provider_id])

  // ── Derived flags ────────────────────────────────────────────────────
  const isCoEntrega = isContraEntrega(selectedPaymentMethod) ?? false
  const isMp = isMercadopago(selectedPaymentMethod) ?? false
  const isStripe = isStripeFunc(selectedPaymentMethod) ?? false

  const paidByGiftcard = Boolean(
    extendedCart.gift_cards &&
      extendedCart.gift_cards.length > 0 &&
      cart.total === 0
  )

  const paymentReady = Boolean(
    (activeSession &&
      cart.shipping_methods?.length !== undefined &&
      cart.shipping_methods?.length !== 0) ||
      paidByGiftcard
  )

  const mpInitAmount = extendedCart.amount ?? cart.total ?? 0

  // ── Actions ──────────────────────────────────────────────────────────

  const setPaymentMethodHandler = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (
      isStripeFunc(method) ||
      isMercadopago(method) ||
      isContraEntrega(method)
    ) {
      const sessionData = isMercadopago(method)
        ? { session_id: cart.id }
        : {}

      await initiatePaymentSession(cart, {
        provider_id: method,
        data: sessionData,
      })
        .then(() => {
          router.refresh()
        })
        .catch(() => {
          setError(
            "Error al iniciar la sesión de pago. Por favor intenta nuevamente."
          )
        })
    }
  }

  const validateContraEntrega = (): boolean => {
    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones para continuar.")
      return false
    }

    if (!contraEntregaData) {
      setError("Por favor completa el formulario de contra entrega.")
      return false
    }

    const { fullName, phone, email, address, postalCode, state } =
      contraEntregaData

    if (fullName.length < 5) {
      setError("El nombre completo debe tener al menos 5 caracteres")
      return false
    }
    if (!/^\d+$/.test(phone.replace(/\s/g, ""))) {
      setError("El teléfono debe contener solo números")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido")
      return false
    }
    if (!address) {
      setError("La dirección es obligatoria")
      return false
    }
    if (!/^\d+$/.test(postalCode)) {
      setError("El código postal debe ser numérico")
      return false
    }
    if (!state) {
      setError("El estado es obligatorio")
      return false
    }

    return true
  }

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        const sessionData = isMercadopago(selectedPaymentMethod)
          ? { session_id: cart.id }
          : {}

        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: sessionData,
        })
        router.refresh()
      }

      if (isCoEntrega) {
        const isValid = validateContraEntrega()
        if (!isValid) {
          setIsLoading(false)
          return
        }
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          { scroll: false }
        )
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          { scroll: false }
        )
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error desconocido"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // ── Public API ───────────────────────────────────────────────────────
  return {
    isOpen,
    isLoading,
    error,
    selectedPaymentMethod,
    cardBrand,
    cardComplete,
    termsAccepted,
    paidByGiftcard,
    paymentReady,
    activeSession,
    mpInitAmount,
    isCoEntrega,
    isMp,
    isStripe,
    setPaymentMethod: setPaymentMethodHandler,
    setError,
    setCardBrand,
    setCardComplete,
    setTermsAccepted,
    handleEdit,
    handleSubmit,
  }
}
