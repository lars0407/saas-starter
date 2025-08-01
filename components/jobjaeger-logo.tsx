"use client"

import * as React from "react"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar"

export function JobjaegerLogo() {
  // Try to use sidebar context, but handle case when not available
  let isCollapsed = false;
  
  try {
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch (error) {
    // If useSidebar throws an error, we're not in a sidebar context
    // Default to showing the full logo
    isCollapsed = false;
  }

  return (
    <div className="flex items-center justify-center p-2">
      <div className="flex items-center gap-3">
        <div className={isCollapsed ? "relative w-8 h-8" : "relative w-32 h-8 max-h-8"}>
          <Image
            src={isCollapsed ? "/images/branding/Linkedin_logo_green_white.png" : "/images/branding/Logo.png"}
            alt="Jobjäger Logo"
            width={isCollapsed ? 32 : 128}
            height={32}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  )
} 