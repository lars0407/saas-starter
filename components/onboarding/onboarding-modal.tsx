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
  onComplete: (firstName: string, lastName: string, resumeData?: any) => void
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
  const [resumeData, setResumeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

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
    if (currentStep === 1) {
      // Move to step 2 (resume upload)
      setCurrentStep(2)
      setCharacterIndex(1) // Change to different character expression
    } else if (currentStep === 2) {
      // Move to step 3 (profile creation)
      setCurrentStep(3)
      setCharacterIndex(2) // Change to different character expression
    } else if (currentStep === 3) {
      // Complete onboarding
      onComplete(firstName, lastName, resumeData)
    }
  }

  const handleResumeProcessing = async (data: any) => {
    setIsLoading(true)
    setResumeData(data)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsLoading(false)
    setCurrentStep(4) // Move to completion step
  }

  const handleProfileModalComplete = (data: any) => {
    setProfileData(data)
    setCurrentStep(4) // Move to completion step
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
  }

  const handleResumeDataChange = (data: any) => {
    setResumeData(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`mx-auto p-0 overflow-visible rounded-2xl shadow-2xl border-3 border-[#0F973D] ${currentStep === 3 ? 'max-w-4xl max-h-[90vh]' : 'max-w-md'}`} showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Onboarding - Name eingeben</DialogTitle>
        </VisuallyHidden>
        {/* Character and Speech Bubble - Above Modal */}
        <div className="relative bg-transparent">
          {/* Speech Bubble */}
          <div className="absolute -top-22 right-36 z-10">
            <SpeechBubble text={
              currentStep === 1 ? "Hey, cool dich zu sehen! Wie heißt du?" : 
              currentStep === 2 ? "Super! Jetzt lass uns deinen Lebenslauf hochladen!" :
              currentStep === 3 ? "Perfekt! Jetzt erstellen wir dein Profil!" :
              isLoading ? "Einen Moment bitte, ich analysiere deine Daten..." :
              "Perfekt! Dein Profil ist bereit!"
            } />
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
          <div className="mt-2 mb-6 px-4">
            <StepContent
              step={currentStep}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
              onResumeDataChange={handleResumeProcessing}
              onProfileComplete={handleProfileModalComplete}
              onProfileSkip={() => {
                setProfileData({ method: 'skipped' })
                setCurrentStep(4)
              }}
              resumeData={resumeData}
              isLoading={isLoading}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            {!isLoading && currentStep !== 3 && (
              <Button
                onClick={handleContinue}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium"
              >
                {currentStep === 1 ? `weiter als ${firstName || "Max"}` : 
                 currentStep === 2 ? "Weiter" : "Onboarding abschließen"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
      

    </Dialog>
  )
} 