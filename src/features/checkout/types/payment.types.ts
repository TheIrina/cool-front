import type { HttpTypes } from "@medusajs/types"
import type {
  IPaymentFormData,
  IAdditionalData,
} from "@mercadopago/sdk-react/esm/bricks/payment/type"

// ---------------------------------------------------------------------------
// Window augmentation — MercadoPago Brick controller
// ---------------------------------------------------------------------------
export interface MercadoPagoBrickController {
  unmount: () => void
  getFormData: () => Promise<IPaymentFormData | null>
  getAdditionalData: () => Promise<IAdditionalData | null>
}

declare global {
  interface Window {
    paymentBrickController?: MercadoPagoBrickController
  }
}

// ---------------------------------------------------------------------------
// Extended cart — adds properties missing from base StoreCart
// ---------------------------------------------------------------------------
/** Wrapper over StoreCart that surfaces gift_cards and custom amount. */
export interface ExtendedCart extends HttpTypes.StoreCart {
  /** Gift cards applied to the cart. Shape TBD when gift-card module is fully typed. */
  gift_cards?: unknown[]
  /** Custom amount field sometimes set by the backend. */
  amount?: number
}

// ---------------------------------------------------------------------------
// Component-level contracts
// ---------------------------------------------------------------------------
/** Props for the Payment mediator (index.tsx). */
export interface PaymentProps {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: HttpTypes.StorePaymentProvider[]
}

/** Return type of `usePayment` — the contract between Brain (hook) and Face (view). */
export interface UsePaymentReturn {
  // State
  isOpen: boolean
  isLoading: boolean
  error: string | null
  selectedPaymentMethod: string
  cardBrand: string | null
  cardComplete: boolean
  termsAccepted: boolean
  paidByGiftcard: boolean
  paymentReady: boolean
  activeSession: HttpTypes.StorePaymentSession | undefined
  mpInitAmount: number

  // Payment type flags
  isCoEntrega: boolean
  isMp: boolean
  isStripe: boolean

  // Actions
  setPaymentMethod: (method: string) => Promise<void>
  setError: (error: string | null) => void
  setCardBrand: (brand: string | null) => void
  setCardComplete: (complete: boolean) => void
  setTermsAccepted: (accepted: boolean) => void
  handleEdit: () => void
  handleSubmit: () => Promise<void>
}

/** Props for the pure view component (payment-view.tsx). */
export type PaymentViewProps = UsePaymentReturn & {
  availablePaymentMethods: HttpTypes.StorePaymentProvider[]
  cart: HttpTypes.StoreCart
}
