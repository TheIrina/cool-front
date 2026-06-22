import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchModal from "@modules/search/components/search-modal"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import CollectionsDropdown from "@modules/layout/components/collections-dropdown"
import Image from "next/image"
import Banner from "@modules/layout/components/banner"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 mx-auto duration-200 bg-black text-white">
        <nav className="content-container txt-xsmall-plus text-white flex items-center justify-between w-full h-20 text-small-regular">
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex items-center gap-x-4">
            <div className="h-full flex items-center">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-logo-link"
            >
              <Image
                src="/webm/LOGO BLANCO COOLBORDADOS.webp"
                alt="Cool Bordados Logo"
                width={150}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Center Section: Navigation Links (Desktop) */}
          <div className="hidden small:flex items-center gap-x-8 h-full">
            <LocalizedClientLink
              href="/"
              className="hover:text-gray-300 uppercase font-medium tracking-wider"
            >
              Inicio
            </LocalizedClientLink>
            <CollectionsDropdown />
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center gap-x-6 h-full justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <SearchModal />
              <LocalizedClientLink
                className="hidden small:flex hover:text-gray-300"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-gray-300 flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
        <Banner />
      </header>
    </>
  )
}
