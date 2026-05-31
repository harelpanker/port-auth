import React from "react"

import logo from "@/assets/port_icon.svg"

interface BrandHeaderProps {
  title: string
  description?: React.ReactNode
}

export function BrandHeader({ title, description }: BrandHeaderProps) {
  return (
    <div className="flex flex-col gap-y-6 text-center">
      <figure className="flex items-center justify-center">
        <img src={logo} alt="logo" width={40} height={40} />
      </figure>
      <div className="flex flex-col gap-y-3">
        <h2 className="text-2xl font-medium text-black/90">{title}</h2>
        {description && (
          <div className="max-w-[288px] text-sm font-medium text-black/60">
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
