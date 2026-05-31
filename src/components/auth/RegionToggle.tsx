import { useState, useEffect, useRef } from "react"
import type { Region } from "@/lib/auth0-service"

import usFlef from "@/assets/US.svg"
import euFlef from "@/assets/EU.svg"

interface RegionToggleProps {
  region: Region
  onChange: (region: Region) => void
}

export function RegionToggle({ region, onChange }: RegionToggleProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="absolute top-3 left-3 z-20">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex cursor-pointer items-center gap-1 rounded-lg border border-[#D3D3D3] bg-white px-3 py-2 text-sm font-medium text-black/60 transition duration-300 hover:border-[#7d7d7d] hover:bg-[rgba(23,77,100,0.05)] hover:text-black/90"
      >
        {region === "US" ? (
          <img
            src={usFlef}
            alt="US flag"
            width={20}
            height={20}
            loading="lazy"
          />
        ) : (
          <img
            src={euFlef}
            alt="EU flag"
            width={20}
            height={20}
            loading="lazy"
          />
        )}
        <span className="flex min-w-[26px] items-center justify-center">
          {region}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 z-20 mt-1 w-[calc(100%+0.5rem)] animate-in rounded-md border border-[#d3d3d3] bg-white p-1 py-1 shadow-sm fade-in slide-in-from-top-1">
          {/* button us */}
          <Button
            src={usFlef}
            alt="US flag"
            region="US"
            selected={region === "US"}
            onClick={() => {
              onChange("US")
              setDropdownOpen(false)
            }}
          />

          {/* button eu */}
          <Button
            src={euFlef}
            alt="EU flag"
            region="EU"
            selected={region === "EU"}
            onClick={() => {
              onChange("EU")
              setDropdownOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

const Button = ({
  onClick,
  src,
  alt,
  region,
  selected,
}: {
  onClick: () => void
  src: string
  alt: string
  region: string
  selected: boolean
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      role="option"
      className={`flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-3 text-left text-sm text-black/90 transition hover:bg-[rgba(23,77,100,0.1)] ${selected ? "bg-[rgba(23,77,100,0.1)]" : ""}`}
    >
      <img src={src} alt={alt} width={20} height={20} loading="lazy" />
      <span className="px-1">{region}</span>
    </button>
  )
}
