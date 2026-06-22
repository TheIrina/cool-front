import React from "react"

export default function MapEmbed() {
  // Free Google Maps iframe embed using place search parameters
  const query = encodeURIComponent("Cool Bordados, Roldanillo, Cl. 9 #7-26")
  const src = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="content-container pb-16">
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
