import React from "react"
import { OnboardingForm } from "./onboarding-form"
import { ResumeUploadForm } from "./resume-upload-form"
import { LoadingStep } from "./loading-step"
import { CompletionStep } from "./completion-step"
import { ProfileContent } from "./profile-content"
import { Button } from "@/components/ui/button"

interface StepContentProps {
  step: number
  firstName: string
  lastName: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onResumeDataChange?: (data: any) => void
  onProfileComplete?: (data: any) => void
  onProfileSkip?: () => void
  resumeData?: any
  isLoading?: boolean
}

export function StepContent({
  step,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onResumeDataChange,
  onProfileComplete,
  onProfileSkip,
  resumeData,
  isLoading,
}: StepContentProps) {
  // Step 1: Name input
  if (step === 1) {
    return (
      <OnboardingForm
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
      />
    )
  }

  // Step 2: Resume upload
  if (step === 2) {
    return (
      <ResumeUploadForm
        onResumeDataChange={onResumeDataChange}
        resumeData={resumeData}
        isLoading={isLoading}
      />
    )
  }

  // Step 3: Profile creation
  if (step === 3) {
    return (
      <ProfileContent
        onComplete={onProfileComplete || (() => {})}
        onSkip={onProfileSkip || (() => {})}
      />
    )
  }

  // Step 4: Loading state
  if (isLoading) {
    return <LoadingStep />
  }

  // Step 5: Completion
  if (step === 4) {
    return <CompletionStep firstName={firstName} lastName={lastName} />
  }

  // Placeholder for future steps
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Step {step} - Coming soon!</p>
    </div>
  )
} 