"use client"

import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import QuantitySelector from "@modules/products/components/product-actions/quantity-selector"
import ProductPrice from "@modules/products/components/product-price"
import MobileActions from "@modules/products/components/product-actions/mobile-actions"
import type { ProductActionsViewProps } from "../types/product-actions.types"
import { CONTACT_INFO } from "@lib/constants"

/**
 * ProductActionsView — "The Face" of the ProductActions feature.
 *
 * Purely presentational. Renders variant options, quantity selector,
 * price display, and add-to-cart button. Zero business logic.
 */
export const ProductActionsView = ({
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
  product,
  disabled,
}: ProductActionsViewProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-4" ref={actionsRef}>
        {/* Quantity Selector */}
        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          max={maxQuantity}
          disabled={!!disabled || isAdding}
        />

        {/* Options/Sizes */}
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {/* Row: Price & Add to Cart Button */}
        <div className="flex flex-row items-center gap-x-6 w-full justify-between mt-4">
          <ProductPrice
            product={product}
            variant={selectedVariant}
            quantity={quantity}
          />

          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="h-12 bg-black hover:bg-zinc-900 border border-[#939393] text-white px-4 rounded-md font-bebas text-lg font-normal tracking-wider uppercase flex items-center justify-center flex-1"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options
              ? "Seleccionar variante"
              : !inStock || !isValidVariant
                ? "Agotado"
                : "Añadir al carrito"}
          </Button>
        </div>

        {/* WhatsApp Customization Button */}
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hola!%20Quiero%20personalizar%20este%20producto:%20${encodeURIComponent(product.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 bg-[#22c55e] hover:bg-[#1eab52] text-white font-bebas text-lg font-normal tracking-wider uppercase flex items-center justify-center rounded-md transition-colors shadow-sm select-none cursor-pointer mt-2"
        >
          Personalizar este producto
        </a>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
