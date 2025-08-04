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
import { JobTitleStep } from "./job-title-step"
import { WorkLocationStep } from "./work-location-step"
import { JobTypeStep } from "./job-type-step"
import { SalaryExpectationStep } from "./salary-expectation-step"


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
  const [jobSearchIntensity, setJobSearchIntensity] = useState<string>("")
  const [jobTitle, setJobTitle] = useState<string>("")
  const [workLocation, setWorkLocation] = useState<string>("")
  const [jobType, setJobType] = useState<string>("")
  const [salaryExpectation, setSalaryExpectation] = useState<string>("")

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
      // Move to step 4 (job search intensity)
      setCurrentStep(4)
      setCharacterIndex(3) // Change to different character expression
    } else if (currentStep === 4) {
      // Move to step 5 (job title)
      setCurrentStep(5)
      setCharacterIndex(4) // Change to different character expression
    } else if (currentStep === 5) {
      // Move to step 6 (work location)
      setCurrentStep(6)
      setCharacterIndex(5) // Change to different character expression
    } else if (currentStep === 6) {
      // Move to step 7 (job type)
      setCurrentStep(7)
      setCharacterIndex(0) // Reset to first character expression
    } else if (currentStep === 7) {
      // Move to step 8 (salary expectation)
      setCurrentStep(8)
      setCharacterIndex(1) // Change to different character expression
    } else if (currentStep === 8) {
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
    setCurrentStep(5) // Move to completion step
  }

  const handleJobSearchIntensityComplete = (intensity: string) => {
    setJobSearchIntensity(intensity)
    setCurrentStep(5) // Move to job title step
  }

  const handleProfileModalComplete = (data: any) => {
    setProfileData(data)
    setCurrentStep(4) // Move to job search intensity step
  }

  const handleJobTitleComplete = (title: string) => {
    setJobTitle(title)
    setCurrentStep(5) // Move to work location step
  }

  const handleWorkLocationComplete = (location: string) => {
    setWorkLocation(location)
    setCurrentStep(6) // Move to job type step
  }

  const handleJobTypeComplete = (type: string) => {
    setJobType(type)
    setCurrentStep(7) // Move to salary expectation step
  }

  const handleSalaryExpectationComplete = (salary: string) => {
    setSalaryExpectation(salary)
    setCurrentStep(9) // Move to completion step
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
      <DialogContent className={`mx-auto p-0 overflow-visible rounded-2xl shadow-2xl border-3 border-[#0F973D] ${currentStep === 3 ? 'max-w-4xl max-h-[90vh]' : currentStep === 4 || currentStep === 5 || currentStep === 6 || currentStep === 7 || currentStep === 8 || currentStep === 9 ? 'max-w-4xl' : 'max-w-md'}`} showCloseButton={false}>
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
              currentStep === 4 ? "Nice! Wie aktiv suchst du gerade nach einem Job?" :
              currentStep === 5 ? "Cool! Was ist dein Dream Job?" :
              currentStep === 6 ? "Nice! Wo willst du arbeiten?" :
              currentStep === 7 ? "Perfekt! Wie viel Zeit hast du?" :
              currentStep === 8 ? "Awesome! Was ist dein Gehaltswunsch?" :
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
              onJobSearchIntensityComplete={handleJobSearchIntensityComplete}
              onProfileComplete={handleProfileModalComplete}
              onProfileSkip={() => {
                setProfileData({ method: 'skipped' })
                setCurrentStep(4)
              }}
              onJobTitleComplete={handleJobTitleComplete}
              onWorkLocationComplete={handleWorkLocationComplete}
              onJobTypeComplete={handleJobTypeComplete}
              onSalaryExpectationComplete={handleSalaryExpectationComplete}
              resumeData={resumeData}
              isLoading={isLoading}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            {!isLoading && currentStep !== 3 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && currentStep !== 9 && (
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