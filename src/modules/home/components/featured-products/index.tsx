import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function FeaturedProducts({
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 10,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+collection,+type",
    },
  })

  if (!products || products.length === 0) {
    return null
  }

  return (
    <li className="w-full list-none">
      <div className="content-container py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-5">
          <div className="flex items-start gap-4">
            {/* Red circle dot */}
            <span className="w-5 h-5 bg-[#cc1a1a] rounded-full mt-1.5 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-black uppercase tracking-wider leading-tight">
                PRODUCTOS DESTACADOS
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Calidad Premium, listas para llevar
              </p>
            </div>
          </div>
          <LocalizedClientLink
            href="/store"
            className="text-[#cc1a1a] hover:text-[#b01717] flex items-center gap-1 font-medium transition-colors text-base group/link"
          >
            <span className="underline decoration-2 underline-offset-4">Ver todo el catalogo</span>
            <span className="text-lg transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </LocalizedClientLink>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-5 gap-x-6 gap-y-12">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

