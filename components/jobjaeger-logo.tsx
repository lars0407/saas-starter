"use client"

import * as React from "react"
import Image from "next/image"

export function JobjaegerLogo() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="flex items-center gap-3">
        <div className="relative w-32 h-8 max-h-8">
          <Image
            src="/images/branding/Logo.png"
            alt="Jobjäger Logo"
            width={128}
            height={32}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  )
} 