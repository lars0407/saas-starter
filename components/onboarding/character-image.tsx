import React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CharacterImageProps {
  src: string
  alt: string
  className?: string
}

export function CharacterImage({ src, alt, className }: CharacterImageProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Radial effect background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0F973D]/20 to-transparent rounded-full scale-150"></div>
      <Image
        src={src}
        alt={alt}
        width={120}
        height={120}
        className="object-contain relative z-10"
        priority
      />
    </div>
  )
} 