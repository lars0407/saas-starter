import React from "react"
import { OnboardingForm } from "./onboarding-form"

interface StepContentProps {
  step: number
  firstName: string
  lastName: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
}

export function StepContent({
  step,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: StepContentProps) {
  // Currently only supporting step 1 (name input)
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

  // Placeholder for future steps
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Step {step} - Coming soon!</p>
    </div>
  )
} 