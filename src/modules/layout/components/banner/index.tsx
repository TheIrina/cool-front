"use client"

import React from "react"
import { Truck, CreditCard, ChatCircleDots } from "@phosphor-icons/react"

const messages = [
  { text: "ENVÍO GRATIS A TODO EL PAÍS", Icon: Truck },
  { text: "PAGOS SEGUROS", Icon: CreditCard },
  { text: "ATENCIÓN PERSONALIZADA", Icon: ChatCircleDots },
]

// Create a sufficiently long array that represents one full cycle
const singleSet = [...messages, ...messages, ...messages, ...messages]
// Duplicate the cycle so the -50% translation loops seamlessly
const doubleSet = [...singleSet, ...singleSet]

const Banner = () => {
  return (
    <div className="bg-white text-black py-2 border-b border-ui-border-base overflow-hidden whitespace-nowrap">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {doubleSet.map((msg, index) => (
          <span key={index} className="mx-8 text-sm font-light flex items-center gap-2">
            <msg.Icon size={18} weight="regular" />
            {msg.text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Banner