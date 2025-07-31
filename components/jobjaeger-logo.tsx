"use client"

import * as React from "react"
import Image from "next/image"

export function JobjaegerLogo() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="flex items-center gap-3">
        <div className="relative w-32 h-8">
          <Image
            src="/images/branding/Logo.png"
            alt="Jobjäger Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
} 