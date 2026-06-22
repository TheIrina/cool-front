import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  quantity = 1,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  quantity?: number
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Calculate total price
  const totalPrice = selectedPrice.calculated_price_number * quantity
  const totalPriceFormatted = convertToLocale({
    amount: totalPrice,
    currency_code: selectedPrice.currency_code,
  })

  // Calculate original total if on sale
  const originalTotalPrice = selectedPrice.original_price_number
    ? selectedPrice.original_price_number * quantity
    : null
  const originalTotalFormatted = originalTotalPrice
    ? convertToLocale({
      amount: originalTotalPrice,
      currency_code: selectedPrice.currency_code,
    })
    : null

  return (
    <div className="flex flex-col text-ui-fg-base gap-y-2">
      {/* Unit Price */}
      {variant && quantity > 1 && (
        <div className="flex items-center gap-x-2 text-sm text-ui-fg-subtle">
          <span>Precio unitario:</span>
          <span>{selectedPrice.calculated_price}</span>
        </div>
      )}

      {/* Total Price */}
      <div className="flex flex-col">
        {quantity > 1 && variant && (
          <span className="text-sm text-ui-fg-subtle">Total:</span>
        )}
        <span
          className={clx("text-4xl font-normal font-bebas text-black", {
            "text-ui-fg-interactive": selectedPrice.price_type === "sale",
          })}
        >
          <span
            data-testid="product-price"
            data-value={totalPrice}
          >
            {quantity > 1 && variant ? totalPriceFormatted : selectedPrice.calculated_price}
          </span>
        </span>
      </div>

      {/* Sale Info */}
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={originalTotalPrice}
            >
              {quantity > 1 && variant && originalTotalFormatted
                ? originalTotalFormatted
                : selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
