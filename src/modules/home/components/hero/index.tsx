"use client"

import { useState, useEffect } from "react"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
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
    <div className="h-[calc(100vh-116px)] w-full border-b border-ui-border-base relative bg-ui-bg-subtle overflow-hidden">
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

      <div className="absolute inset-0 z-10 flex flex-col justify-between items-center small:items-start text-center small:text-left content-container py-12 small:py-24">
        <h1 className="text-3xl small:text-6xl md:text-7xl font-bold uppercase tracking-wider text-white select-none font-bebas leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center w-full small:w-auto mt-4 small:mt-8">
          TEN UN DISEÑO <span className="text-[#ff3131]">EXCLUSIVO</span> CON<br /> COOL <span className="text-[#ff3131]">BORDADOS</span>
        </h1>
        
        <div className="flex flex-row gap-3 small:gap-6 w-full max-w-[340px] small:max-w-[540px] mb-4 small:mb-8">
          {/* Button 1: DISEÑAR AHORA */}
          <a
            href="https://wa.me/573114330332?text=Hola!%20Quiero%20dise%C3%B1ar%20un%20bordado%20personalizado."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 small:py-3.5 small:px-8 bg-[#c31f1f] text-white font-bebas font-bold tracking-wider text-sm small:text-xl rounded-md transition-all duration-200 uppercase text-center border-2 border-transparent hover:bg-[#a11818] shadow-lg select-none cursor-pointer"
          >
            Diseñar Ahora
          </a>

          {/* Button 2: VER CATALOGO */}
          <LocalizedClientLink
            href="/store"
            className="flex-1 py-2.5 px-4 small:py-3.5 small:px-8 bg-black text-white font-bebas font-bold tracking-wider text-sm small:text-xl rounded-md border-2 border-[#939393] transition-all duration-200 uppercase text-center hover:bg-zinc-900 shadow-lg select-none cursor-pointer"
          >
            Ver Catalogo
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero

