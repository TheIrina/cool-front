import React from "react"
import Image from "next/image"

interface Review {
  id: string
  name: string
  avatarText: string
  avatarBg: string
  timeAgo: string
  rating: number
  text: string
}

const reviewsData: Review[] = [
  {
    id: "1",
    name: "Luz Carreño",
    avatarText: "L",
    avatarBg: "bg-[#5c4033]", // Brown
    timeAgo: "hace 1 semana",
    rating: 5,
    text: "Buen servicio. A pesar que tuvimos un error en el diseño del bordado lo corrigieron de inmediato y entregaron la gorra perfecta.",
  },
  {
    id: "2",
    name: "Danna Massiell",
    avatarText: "D",
    avatarBg: "bg-[#3f51b5]", // Indigo
    timeAgo: "hace 2 semanas",
    rating: 5,
    text: "Muy atentos al detalle y la comunicación es súper clara. Las gorras ganaderas que compré tienen una calidad y acabados espectaculares.",
  },
  {
    id: "3",
    name: "Juana Castillo",
    avatarText: "J",
    avatarBg: "bg-[#009688]", // Teal
    timeAgo: "hace 3 semanas",
    rating: 5,
    text: "¡Excelente! Compré dos gorras personalizadas para un regalo de cumpleaños y quedaron idénticas al diseño que les envié. Muy recomendados.",
  },
  {
    id: "4",
    name: "Diana Rojas",
    avatarText: "D",
    avatarBg: "bg-[#e06666]", // Coral red
    timeAgo: "hace 1 mes",
    rating: 5,
    text: "Excelente atención y productos. Las costuras del bordado en relieve son súper limpias. Volveré a mandar a hacer mis gorras con ellos sin duda.",
  },
  {
    id: "5",
    name: "Carlos Mendoza",
    avatarText: "C",
    avatarBg: "bg-[#607d8b]", // Slate
    timeAgo: "hace 1 mes",
    rating: 5,
    text: "La gorra en gamuza premium es súper cómoda y el bordado de mi marca quedó impecable. El envío me llegó al día siguiente de la confirmación.",
  },
]

// Star SVG Component
const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#fbbc05" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

// Verified Check SVG Component
const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4 shrink-0">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
)

// Google Single Letter "G" Logo
const GoogleGLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
)

// Google Wordmark Logo
const GoogleWordmark = () => (
  <svg viewBox="0 0 74 24" className="w-[74px] h-[24px]">
    <path fill="#4285F4" d="M10.24 19.38c-4.96 0-9-4.08-9-9.1s4.04-9.1 9-9.1c2.72 0 4.65 1.07 6.13 2.48l-2.17 2.17c-1.04-.98-2.4-1.74-3.96-1.74-3.56 0-6.42 2.87-6.42 6.39 0 3.52 2.86 6.39 6.42 6.39 3.42 0 4.67-1.39 5.3-2.07.28-.28.47-.68.54-1.2h-5.84V9.22h8.73c.09.47.14.93.14 1.43 0 2.22-.61 4.78-2.61 6.78-1.95 2.01-4.48 2.95-7.33 2.95z"/>
    <path fill="#EA4335" d="M28.09 19.38c-3.13 0-5.69-2.39-5.69-5.64s2.56-5.64 5.69-5.64 5.69 2.39 5.69 5.64-2.56 5.64-5.69 5.64zm0-2.31c1.78 0 3.29-1.46 3.29-3.33 0-1.89-1.51-3.33-3.29-3.33-1.79 0-3.3 1.44-3.3 3.33 0 1.87 1.51 3.33 3.3 3.33z"/>
    <path fill="#FBBC05" d="M40.48 19.38c-3.13 0-5.69-2.39-5.69-5.64s2.56-5.64 5.69-5.64 5.69 2.39 5.69 5.64-2.56 5.64-5.69 5.64zm0-2.31c1.78 0 3.29-1.46 3.29-3.33 0-1.89-1.51-3.33-3.29-3.33-1.79 0-3.3 1.44-3.3 3.33 0 1.87 1.51 3.33 3.3 3.33z"/>
    <path fill="#4285F4" d="M52.32 19.38c-3.03 0-5.5-2.39-5.5-5.57 0-3.2 2.47-5.71 5.5-5.71 1.76 0 3.02.77 3.86 1.57l-1.63 1.63c-.56-.53-1.3-.98-2.23-.98-1.92 0-3.34 1.59-3.34 3.49 0 1.9 1.42 3.49 3.34 3.49.97 0 1.66-.4 2.21-.95.53-.53.86-1.28.96-2.28h-3.17V9.72h5.36c.07.28.1.58.1.9 0 1.44-.39 3.27-1.63 4.51-1.21 1.25-2.76 1.91-4.5 1.91z"/>
    <path fill="#34A853" d="M59.39 1.5h2.38v17.38h-2.38z"/>
    <path fill="#EA4335" d="M69.09 19.38c-1.68 0-3.02-.77-3.79-2.24l7.63-3.15-.26-.64c-.36-.97-1.45-2.97-3.95-2.97-2.48 0-4.56 1.95-4.56 5.64 0 3.18 2.06 5.64 5.28 5.64 2.59 0 4.1-1.58 4.72-2.47l-1.91-1.27c-.64.95-1.51 1.46-2.55 1.46zm-.17-8.11c1.31 0 2.42.68 2.78 1.63l-5.38 2.22c0-2.35 1.67-3.85 2.6-3.85z"/>
  </svg>
)

export default function GoogleReviews() {
  // Google Maps Review Link
  const writeReviewUrl = "https://maps.app.goo.gl/hQa1QuLeZtG1CCUK9"

  return (
    <div className="content-container py-12 border-t border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 pb-4">
        <div className="flex items-start gap-4">
          {/* Red circle dot */}
          <span className="w-5 h-5 bg-[#cc1a1a] rounded-full mt-1.5 shrink-0" />
          <div>
            <h2 className="text-2xl font-medium text-black uppercase tracking-wider leading-tight">
              DESCUBRE PORQUE NUESTROS CLIENTES NOS ELIGEN
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Una calificacion habla mas que mil palabras
            </p>
          </div>
        </div>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#cc1a1a] hover:text-[#b01717] flex items-center gap-1 font-semibold transition-colors text-base group/link"
        >
          <span className="underline decoration-2 underline-offset-4">Calificar</span>
          <span className="text-lg transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </a>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Side: Score Summary (1/4 width on large screen) */}
        <div className="flex flex-col items-center lg:items-start justify-center p-6 bg-zinc-50 border border-zinc-100 rounded-2xl w-full lg:w-[260px] shrink-0 text-center lg:text-left gap-y-3">
          <span className="text-xl font-bold text-black tracking-wide">EXCELENTE</span>
          <div className="flex gap-x-0.5">
            <StarIcon className="w-6 h-6" />
            <StarIcon className="w-6 h-6" />
            <StarIcon className="w-6 h-6" />
            <StarIcon className="w-6 h-6" />
            <StarIcon className="w-6 h-6" />
          </div>
          <span className="text-xs text-zinc-500 font-medium">A base de 309 reseñas</span>
          <div className="mt-1">
            <Image
              src="/ICONOS/Google-logo.webp"
              alt="Google Logo"
              width={90}
              height={30}
              className="object-contain h-7 w-auto"
            />
          </div>
        </div>

        {/* Right Side: Horizontal Scroll Container of Reviews (3/4 width) */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar scrollbar-none">
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="snap-start shrink-0 w-[290px] small:w-[320px] bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Top info: Avatar, Name, Time, G Logo */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${review.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                        {review.avatarText}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-black text-xs small:text-sm truncate">
                          {review.name}
                        </span>
                        <span className="text-[10px] small:text-xs text-gray-400 font-medium">
                          {review.timeAgo}
                        </span>
                      </div>
                    </div>
                    <GoogleGLogo />
                  </div>

                  {/* Rating Stars and Verified Icon */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5" />
                      ))}
                    </div>
                    <VerifiedIcon />
                  </div>

                  {/* Comment text */}
                  <p className="text-xs small:text-sm text-zinc-700 font-medium leading-relaxed line-clamp-4">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
