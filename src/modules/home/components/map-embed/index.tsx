import React from "react"
import Image from "next/image"

const features = [
  { src: "/ICONOS/ENVIOS GRATIS.webp", alt: "Envíos Gratis" },
  { src: "/ICONOS/ENTREGAS EL MISMO DIA.webp", alt: "Entregas el Mismo Día" },
  { src: "/ICONOS/ENVIOS NACIONALES.webp", alt: "Envíos Nacionales" },
  { src: "/ICONOS/PAGOS SEGUROS.webp", alt: "Pagos Seguros" },
  { src: "/ICONOS/GORRAS PREMIUM.webp", alt: "Gorras Premium" },
]

export default function MapEmbed() {
  // Free Google Maps iframe embed using place search parameters
  const query = encodeURIComponent("Cool Bordados, Roldanillo, Cra. 5 #9-09")
  const src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.990348778319!2d-76.15271649999997!3d4.412894599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38376affc5dee7%3A0x7458ba4eed87aa4b!2sCra.%205%20%239-9%2C%20Roldanillo%2C%20Valle%20del%20Cauca!5e0!3m2!1sen!2sco!4v1782332633089!5m2!1sen!2sco`

  return (
    <div className="content-container pb-16">
      {/* Banner de iconos */}
      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-4 gap-y-2 small:gap-8 pb-12 pt-8 border-t border-zinc-100">
        {features.map((feature, idx) => (
          <div key={idx} className={`flex items-center justify-center ${idx === 4 ? "col-span-2 small:col-span-1" : ""}`}>
            <div className="relative w-full h-28 small:h-36">
              <Image
                src={feature.src}
                alt={feature.alt}
                fill
                sizes="(max-width: 850px) 50vw, 20vw"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mapa de ubicación */}
      <div className="w-full h-[300px] small:h-[450px] overflow-hidden rounded-large border border-zinc-100 shadow-sm relative bg-zinc-100">
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Cool Bordados en Roldanillo"
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}
