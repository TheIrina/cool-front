import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-black text-white">
      <div className="content-container flex flex-col w-full px-6 py-16 md:px-12 md:py-20 lg:py-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-24">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center text-center max-w-sm">
            <LocalizedClientLink
              href="/"
              className="inline-block hover:opacity-80 transition-opacity mb-4"
            >
              <Image
                src="/webm/LOGO BLANCO COOLBORDADOS.webp"
                alt="Cool Bordados Logo"
                width={200}
                height={54}
                className="h-16 w-auto object-contain"
                priority
              />
            </LocalizedClientLink>
            <p className="text-white text-[11px] font-medium tracking-widest leading-normal uppercase max-w-[280px]">
              Ahora puedes comprar desde la comodidad de tu casa en todo momento,<br />mejoramos cada día por ti
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-12 md:gap-24 lg:ml-auto">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-4 min-w-[120px] text-center lg:text-left">
                <span className="text-sm font-medium uppercase tracking-wider text-white">
                  Categorias
                </span>
                <ul className="flex flex-col gap-3">
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) return null;
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-sm text-neutral-400 hover:text-white transition-colors"
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-4 min-w-[120px] text-center lg:text-left">
                <span className="text-sm font-medium uppercase tracking-wider text-white">
                  Colecciones
                </span>
                <ul className="flex flex-col gap-3">
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-y-4 min-w-[120px] text-center lg:text-left">
              <span className="text-sm font-medium uppercase tracking-wider text-white">
                Legal
              </span>
              <ul className="flex flex-col gap-3">
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Acerca de Nosotros
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/terms"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Términos y Condiciones
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/privacy"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Política de Privacidad
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-center items-center mt-16 w-full">
          <p className="text-xs text-neutral-500 tracking-wider text-center">
            © {new Date().getFullYear()} Cool Bordados. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
