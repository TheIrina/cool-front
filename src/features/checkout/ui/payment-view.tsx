"use client"

import { RadioGroup } from "@headlessui/react"
import {
  isStripe as isStripeFunc,
  isContraEntrega,
  isMercadopago,
  paymentInfoMap,
} from "@lib/constants"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import Checkbox from "@modules/common/components/checkbox"
import ContraEntregaForm from "@modules/checkout/components/payment/contra-entrega-form"
import type { PaymentViewProps } from "../types/payment.types"

/**
 * PaymentView — "The Face" of the Payment feature.
 *
 * A purely presentational component. Receives all state and callbacks
 * via props from the usePayment hook. Contains ZERO business logic,
 * ZERO useState/useEffect, and ZERO server calls.
 */
export const PaymentView = ({
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
  setPaymentMethod,
  setError,
  setCardBrand,
  setCardComplete,
  setTermsAccepted,
  handleEdit,
  handleSubmit,
  availablePaymentMethods,
  cart,
}: PaymentViewProps) => {
  return (
    <div className="bg-white">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Pago
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Editar
            </button>
          </Text>
        )}
      </div>

      <div>
        {/* ── Open state: payment method selection ────────────── */}
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <>
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />

                        {/* Contra Entrega form */}
                        {isContraEntrega(paymentMethod.id) &&
                          selectedPaymentMethod === paymentMethod.id && (
                            <div className="p-4 bg-ui-bg-subtle border border-t-0 rounded-b-rounded -mt-2 mb-4">
                              <ContraEntregaForm cart={cart} />
                              <div className="mt-4 flex items-center gap-x-2">
                                <Checkbox
                                  label="Acepto los términos y condiciones de pago contra entrega"
                                  checked={termsAccepted}
                                  onChange={() =>
                                    setTermsAccepted(!termsAccepted)
                                  }
                                />
                              </div>
                            </div>
                          )}

                        {/* MercadoPago Checkout Pro Banner */}
                        {isMercadopago(paymentMethod.id) &&
                          selectedPaymentMethod === paymentMethod.id && (
                            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col gap-y-3 mb-4 mt-2">
                              <div className="flex items-center gap-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                <h4 className="text-sm font-semibold text-neutral-800">
                                  Mercado Pago (Checkout Pro)
                                </h4>
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                Al hacer clic en <strong>"Pagar con Mercado Pago"</strong> en el último paso, serás redirigido de forma 100% segura para completar tu compra. Podrás pagar usando tarjetas de crédito, débito, PSE, Efecty u otros medios locales disponibles.
                              </p>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Tarjeta de regalo
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          {/* Action buttons */}
          {!isCoEntrega && (
            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                (isStripe && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripe
                ? " Ingresar datos de tarjeta"
                : "Continuar a revisión"}
            </Button>
          )}

          {isCoEntrega && (
            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              data-testid="submit-payment-button-contra-entrega"
            >
              Continuar a revisión
            </Button>
          )}
        </div>

        {/* ── Closed state: summary view ─────────────────────── */}
        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Método de pago
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Detalles de pago
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripe && cardBrand
                      ? cardBrand
                      : "Se mostrará otro paso"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Tarjeta de regalo
              </Text>
            </div>
          ) : null}
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}
