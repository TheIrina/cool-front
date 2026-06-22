"use client"

import { useState, useEffect } from "react"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Banner from "@modules/layout/components/banner"
import Image from "next/image"

const IMAGES = [
  {
    mobile: "/HERO/SLIDER 1 HERO MOVIL COOLBORDADOS.webp",
    desktop: "/HERO/SLIDER 1 HERO PC COOLBORDADOS.webp",
    alt: "Colección de bordados personalizados - Estilo 1",
  },
  {
    mobile: "/HERO/SLIDER 2 HERO MOVIL COOLBORDADOS.webp",
    desktop: "/HERO/SLIDER 2 HERO COOLBORDADOS.webp",
    alt: "Colección de bordados personalizados - Estilo 2",
  },
  {
    mobile: "/HERO/SLIDER 3 HERO MOVIL COOLBORDADOS.webp",
    desktop: "/HERO/SLIDER 3 HERO COOLBORDADOS.webp",
    alt: "Colección de bordados personalizados - Estilo 3",
  },
]

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length)
    }, 6000) // Cambiar imagen cada 6 segundos
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-screen w-full border-b border-ui-border-base relative bg-ui-bg-subtle -mt-16 overflow-hidden">
      {/* Imágenes de fondo con transición suave de opacidad */}
      {IMAGES.map((img, index) => {
        const isActive = index === currentIndex
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Versión para dispositivos móviles */}
            <div className="block small:hidden relative w-full h-full">
              <Image
                src={img.mobile}
                alt={img.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
            {/* Versión para PC/Escritorio */}
            <div className="hidden small:block relative w-full h-full">
              <Image
                src={img.desktop}
                alt={img.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        )
      })}

      {/* Overlay para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-4xl leading-10 text-white font-normal"
          >
            Supera tus límites con estilo
          </Heading>
          <Heading
            level="h2"
            className="text-xl leading-8 text-white font-light"
          >
            Ropa deportiva de alto rendimiento diseñada para moverse contigo
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary">
            Descubrir colección
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

