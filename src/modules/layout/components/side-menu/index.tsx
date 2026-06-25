"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

import { CONTACT_INFO } from "@lib/constants"

const SideMenuItems = [
  { name: "INICIO", href: "/" },
  { name: "COLECCIONES", href: "/store" },
  { name: "PERSONALIZAR", href: `https://wa.me/${CONTACT_INFO.whatsapp}?text=Hola!%20Quiero%20personalizar%20un%20producto.` },
  { name: "TIENDA", href: "/store" },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          onClick={open}
          className="flex items-center h-full transition-all duration-200 hover:text-gray-300 focus:outline-none"
          data-testid="nav-menu-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[100]">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex pointer-events-none">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="relative flex w-full max-w-[280px] flex-col bg-black shadow-2xl overflow-hidden h-full pointer-events-auto">
                <div className="flex flex-col h-full text-white">
                  {/* Header: MENU | X */}
                  <div className="flex items-center justify-between px-6 py-5 bg-[#151515] border-b border-neutral-900">
                    <h3 className="text-2xl font-normal text-white uppercase font-bebas tracking-widest">
                      MENU
                    </h3>
                    <button
                      onClick={close}
                      className="text-2xl font-normal text-white uppercase font-bebas tracking-widest hover:opacity-80 transition-opacity"
                      data-testid="close-menu-button"
                    >
                      X
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 no-scrollbar bg-black">
                    {SideMenuItems.map((item) => {
                      const isExternal = item.href.startsWith("http")
                      if (isExternal) {
                        return (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-normal text-white uppercase tracking-wider font-bebas hover:text-[#ff3131] transition-colors duration-200 text-left"
                            onClick={close}
                          >
                            {item.name}
                          </a>
                        )
                      }
                      return (
                        <LocalizedClientLink
                          key={item.name}
                          href={item.href}
                          className="text-2xl font-normal text-white uppercase tracking-wider font-bebas hover:text-[#ff3131] transition-colors duration-200 text-left"
                          onClick={close}
                        >
                          {item.name}
                        </LocalizedClientLink>
                      )
                    })}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default SideMenu
