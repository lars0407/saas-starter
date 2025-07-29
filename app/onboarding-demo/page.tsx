"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OnboardingModal } from "@/components/onboarding"
import { toast } from "sonner"

export default function OnboardingDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleComplete = (firstName: string, lastName: string) => {
    toast.success(`Willkommen ${firstName} ${lastName}! 🎉`)
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Onboarding Modal Demo
          </h1>
          <p className="text-gray-600">
            Test the onboarding modal with blur background and character interaction
          </p>
        </div>
        
        <Button 
          onClick={handleOpenModal}
          className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-6 py-3"
        >
          Open Onboarding Modal
        </Button>

        <OnboardingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onComplete={handleComplete}
          speechText="Hey, cool dich zu sehen! Wie heißt du?"
          characterSrc="/images/characters/Job-Jäger Expressions.png"
          characterAlt="Friendly Robin Hood character"
        />
      </div>
    </div>
  )
} 