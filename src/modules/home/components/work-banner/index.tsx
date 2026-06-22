import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WorkBanner() {
  return (
    <div className="relative w-full h-[240px] small:h-[400px] medium:h-[480px] overflow-hidden select-none bg-zinc-950 rounded-large">
      {/* Mobile Image background */}
      <div className="block small:hidden absolute inset-0">
        <Image
          src="/HERO/BANNER PRINCIPAL MOVIL.webp"
          alt="Mira un poco de nuestro trabajo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Desktop Image background */}
      <div className="hidden small:block absolute inset-0">
        <Image
          src="/HERO/BANNER PRINCIPAL PC.webp"
          alt="Mira un poco de nuestro trabajo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay to ensure readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 small:p-12 md:p-16">
        {/* Title Top Left */}
        <div className="max-w-[85%] small:max-w-[70%]">
          <h2 className="text-white text-lg small:text-3xl md:text-4xl font-medium uppercase tracking-wide leading-tight drop-shadow-md">
            MIRA UN POCO DE NUESTRO TRABAJO
          </h2>
        </div>

        {/* Button Bottom Right */}
        <div className="self-end mt-auto">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-bold text-xs small:text-sm px-6 py-3 small:px-8 small:py-3.5 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
          >
            <span>Ver más</span>
            <span className="text-sm small:text-base">→</span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
