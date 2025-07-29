"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { SpeechBubble } from "./speech-bubble"
import { CharacterImage } from "./character-image"
import { StepContent } from "./step-content"

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (firstName: string, lastName: string) => void
  speechText?: string
  characterSrc?: string
  characterAlt?: string
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  speechText = "Hey, cool dich zu sehen! Wie heißt du?",
  characterSrc = "/images/characters/Job-Jäger Expressions.png", // Jobjäger character
  characterAlt = "Friendly character",
}: OnboardingModalProps) {
  const [firstName, setFirstName] = useState("Max")
  const [lastName, setLastName] = useState("Mustermann")
  const [currentStep, setCurrentStep] = useState(1)
  const [characterIndex, setCharacterIndex] = useState(0)

  // Array of character expressions
  const characterExpressions = [
    "/images/characters/Job-Jäger Expressions.png",
    "/images/characters/jobjaeger_facepalm.png",
    "/images/characters/jobjaeger_peekaboo.png",
    "/images/characters/jobjaeger_cheer.png",
    "/images/characters/jobjaeger_love.png",
    "/images/characters/jobjaeger_shocked.png"
  ]

  const handleContinue = () => {
    // Cycle through character expressions
    setCharacterIndex((prevIndex) => (prevIndex + 1) % characterExpressions.length)
    
    // Don't close modal, just change character
    // Future: handle next steps
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-visible rounded-2xl shadow-2xl border-3 border-[#0F973D]" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Onboarding - Name eingeben</DialogTitle>
        </VisuallyHidden>
        {/* Character and Speech Bubble - Above Modal */}
        <div className="relative bg-transparent">
          {/* Speech Bubble */}
          <div className="absolute -top-22 right-36 z-10">
            <SpeechBubble text={speechText} />
          </div>

          {/* Character */}
          <div className="absolute -top-30 right-4 z-20 bg-transparent">
            <CharacterImage
              src={characterExpressions[characterIndex]}
              alt={characterAlt}
              className="w-32 h-32"
            />
          </div>
        </div>
        
        <div className="relative p-2 rounded-b-2xl">
          {/* Form Content */}
          <div className="mt-2 mb-6">
            <StepContent
              step={currentStep}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium"
            >
              weiter als {firstName || "Max"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 