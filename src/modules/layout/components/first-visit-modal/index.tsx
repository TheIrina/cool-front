"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { CONTACT_INFO } from "@lib/constants"

export default function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Set short delay to allow layout to settle before showing modal
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={handleClose}>
        {/* Backdrop background blur overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden bg-black text-white p-6 rounded-2xl shadow-2xl text-left flex flex-col gap-4 transition-all">
                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <Dialog.Title className="text-base font-bold text-white tracking-wide">
                    Productos Personalizados
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-white/60 font-light leading-relaxed">
                    Para bordados personalizados y productos a tu medida, contáctanos directamente por WhatsApp. Te ayudaremos a crear el diseño perfecto. ¿Deseas continuar?
                  </Dialog.Description>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-gray-100 text-black transition-colors duration-200 text-center cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 px-4 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-gray-100 text-black transition-colors duration-200 text-center cursor-pointer"
                  >
                    Contactar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
