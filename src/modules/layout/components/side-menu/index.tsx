"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Inicio: "/",
  Tienda: "/store",
  Cuenta: "/account",
  Carrito: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleState = useToggleState()

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          onClick={open}
          className="flex items-center gap-x-2 h-full transition-all duration-200 hover:text-gray-300 focus:outline-none"
          data-testid="nav-menu-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="uppercase font-medium tracking-wider text-[10px]">Menú</span>
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

          <div className="fixed inset-0 flex p-4 sm:p-6 pointer-events-none">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="relative flex w-full max-w-[320px] flex-col bg-black shadow-2xl overflow-hidden rounded-2xl h-full pointer-events-auto">
                <div className="flex flex-col h-full text-neutral-200">
                  {/* Header - Similar to CollectionsDropdown header */}
                  <div className="flex items-center justify-between p-5 bg-black">
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Menú</h3>
                    <button
                      onClick={close}
                      className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
                      data-testid="close-menu-button"
                    >
                      <XMark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation Links - Matching dropdown style */}
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 no-scrollbar">
                    {Object.entries(SideMenuItems).map(([name, href]) => (
                      <LocalizedClientLink
                        key={name}
                        href={href}
                        className="px-4 py-3 rounded-full hover:bg-neutral-800/80 hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-between group"
                        onClick={close}
                        data-testid={`${name.toLowerCase()}-link`}
                      >
                        {name}
                        <svg 
                          width="16" height="16" viewBox="0 0 24 24" fill="none" 
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        >
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </LocalizedClientLink>
                    ))}
                  </div>

                  {/* Footer - Minimal and integrated */}
                  <div className="p-4 bg-black space-y-4">
                    <div className="px-2">
                      {regions && (
                        <CountrySelect
                          toggleState={toggleState}
                          regions={regions}
                        />
                      )}
                    </div>
                    <div className="px-2 pt-4">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">
                        © {new Date().getFullYear()} Cool Bordados
                      </p>
                    </div>
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
