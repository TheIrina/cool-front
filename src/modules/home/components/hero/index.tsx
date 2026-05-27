import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Banner from "@modules/layout/components/banner"

const Hero = () => {
  return (
    <div className="h-screen w-full border-b border-ui-border-base relative bg-ui-bg-subtle -mt-16">
      {/* Preload de la imagen poster con alta prioridad para mejorar el LCP */}
      <link
        rel="preload"
        href="/hero-poster.avif"
        as="image"
        fetchPriority="high"
      />

      {/* Video de fondo con poster y pre-carga de metadatos */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero-poster.avif"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      

      {/* Overlay para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-white font-normal"
          >
            Cool Bordados
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-white font-normal"
          >
            Bordados personalizados de alta calidad
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary">
            Explorar productos
          </Button>
        </LocalizedClientLink>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-20">
        <Banner />
      </div>
    </div>
  )
}

export default Hero
