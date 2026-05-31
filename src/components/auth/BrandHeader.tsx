import React from "react"

const PortLogo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 animate-in fade-in zoom-in-95 duration-200"
  >
    <rect width="48" height="48" rx="12" fill="black" />
    <path
      d="M24 34H34V24"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path
      d="M14 14L28 28"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="square"
    />
  </svg>
)

interface BrandHeaderProps {
  title: string
  description?: React.ReactNode
}

export function BrandHeader({ title, description }: BrandHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mt-6">
      <div className="mb-6">
        <PortLogo />
      </div>
      <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-2">
        {title}
      </h2>
      {description && (
        <div className="text-sm text-neutral-500 font-normal leading-relaxed mb-6 max-w-[280px]">
          {description}
        </div>
      )}
    </div>
  )
}
