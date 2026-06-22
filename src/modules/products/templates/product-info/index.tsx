import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row items-baseline gap-x-4 flex-wrap">
          <h1 className="text-3xl small:text-4xl md:text-5xl font-bold uppercase text-black font-bebas tracking-wider" data-testid="product-title">
            {product.title}
          </h1>
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-xl small:text-2xl md:text-3xl font-normal text-zinc-400 hover:text-zinc-600 uppercase font-bebas tracking-wider"
            >
              {product.collection.title}
            </LocalizedClientLink>
          )}
        </div>

        <Text
          className="text-base text-ui-fg-subtle whitespace-pre-line font-sans leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
