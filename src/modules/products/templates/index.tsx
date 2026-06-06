import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import ProductAnalytics from "@modules/products/components/product-analytics"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <ProductAnalytics product={product} region={region} />
      <div
        className="content-container flex flex-col small:grid small:grid-cols-2 gap-8 py-6 relative"
        data-testid="product-container"
      >
        {/* Left Column: Image Gallery */}
        <div className="block w-full relative small:sticky small:top-24 h-fit">
          <ImageGallery images={product?.images || []} />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col w-full py-8 small:py-0 gap-y-12 pl-0 small:pl-12">
          <div className="flex flex-col gap-y-6">
            <ProductInfo product={product} />
            <ProductTabs product={product} />
          </div>
          <div className="flex flex-col gap-y-12">
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
