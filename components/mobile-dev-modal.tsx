"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Sparkles } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const MOBILE_MODAL_KEY = "mobile_dev_modal_shown"

// Helper function to check if user is authenticated
const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] !== undefined
  } catch (error) {
    return false
  }
}

export function MobileDevModal() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Only show on mobile devices AND for authenticated users
    if (!isMobile || !isAuthenticated()) return

    // Check if modal has been shown before
    const hasBeenShown = localStorage.getItem(MOBILE_MODAL_KEY)
    
    if (!hasBeenShown) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isMobile])

  const handleClose = () => {
    setIsOpen(false)
    // Mark as shown so it won't appear again
    localStorage.setItem(MOBILE_MODAL_KEY, "true")
  }

  // Don't render anything if not mobile or not authenticated
  if (!isMobile || !isAuthenticated()) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="mx-auto max-w-sm p-6 text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0F973D]">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Sry, bald verfügbar 📱
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            <span className="font-medium">Mobile Version ist noch in der Entwicklung!</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-left border border-green-200">
            <div className="flex items-start space-x-3">
              <Monitor className="h-5 w-5 text-[#0F973D] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  💡 Pro-Tipp:
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Für die beste Experience schalte auf Desktop um! 
                  <br />
                  <span className="font-medium">Trust me, it's worth it! ✨</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 text-left border border-green-200">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-[#0F973D] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  🚀 Was kommt:
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Mobile App mit allen Features ist in Arbeit! 
                  <br />
                  <span className="font-medium">Stay tuned! 🔥</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleClose}
            className="w-full bg-[#0F973D] hover:bg-[#0D7A32] text-white font-medium py-3 rounded-lg"
          >
            Got it! 👍
          </Button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Du siehst diese Nachricht nur einmal
        </p>
      </DialogContent>
    </Dialog>
  )
}
