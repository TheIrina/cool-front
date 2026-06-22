import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import WorkBanner from "@modules/home/components/work-banner"
import GoogleReviews from "@modules/home/components/reviews"
import MapEmbed from "@modules/home/components/map-embed"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cool Bordados - Bordados personalizados de alta calidad",
  description:
    "Descubre nuestra amplia gama de bordados personalizados. Calidad premium, diseños únicos y servicio excepcional en Cool Bordados.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  let region = null
  let collections = null

  try {
    region = await getRegion(countryCode)
    const collectionsData = await listCollections({
      fields: "id, handle, title",
    })
    collections = collectionsData.collections
  } catch (error) {
    console.error("Failed to fetch region or collections for homepage:", error)
  }

  if (!collections || !region) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl-semi text-ui-fg-base">Página no disponible</h1>
        <p className="text-small-regular text-ui-fg-base">
          Actualmente no podemos cargar la tienda. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    )
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <div className="content-container pb-16">
        <WorkBanner />
      </div>
      <GoogleReviews />
      <MapEmbed />
    </>
  )
}
