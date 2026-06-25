"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { CONTACT_INFO } from "@lib/constants"

export default function InstagramFAB() {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* FAB Button - Static hover transition (only bg-zinc-900, no scale effect) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-md bg-black hover:bg-zinc-900 transition-colors shadow-lg border border-white/10 cursor-pointer"
        aria-label="WhatsApp"
      >
        <svg fill="none" viewBox="0 0 360 362" className="w-9 h-9">
          <path fill="#25D366" fillRule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Warning Dialog Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[150]" onClose={handleCancel}>
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
                  <div className="flex flex-col gap-1.5">
                    <Dialog.Title className="text-base font-bold text-white tracking-wide">
                      Redirección a WhatsApp
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-white/60 font-light leading-relaxed">
                      Estás a punto de salir de la tienda de Cool Bordados para ser redirigido a nuestro chat oficial de WhatsApp. ¿Deseas continuar?
                    </Dialog.Description>
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-gray-100 text-black transition-colors duration-200 text-center cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-4 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-gray-100 text-black transition-colors duration-200 text-center cursor-pointer"
                    >
                      Continuar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
