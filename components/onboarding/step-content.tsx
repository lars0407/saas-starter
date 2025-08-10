import React from "react"
import { OnboardingForm } from "./onboarding-form"
import { ResumeUploadForm } from "./resume-upload-form"
import { LoadingStep } from "./loading-step"
import { CompletionStep } from "./completion-step"
import { ProfileContent } from "./profile-content"
import { JobSearchIntensity } from "./job-search-intensity"
import { JobTitleStep } from "./job-title-step"
import { WorkLocationStep } from "./work-location-step"
import { JobTypeStep } from "./job-type-step"
import { SalaryExpectationStep } from "./salary-expectation-step"
import { Button } from "@/components/ui/button"

interface StepContentProps {
  step: number
  firstName: string
  lastName: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onResumeDataChange?: (data: any) => void
  onJobSearchIntensityComplete?: (intensity: string) => void
  onProfileComplete?: (data: any) => void
  onProfileSkip?: () => void
  onBack?: () => void
  onJobTitleComplete?: (title: string) => void
  onWorkLocationComplete?: (location: string) => void
  onJobTypeComplete?: (type: string) => void
  onSalaryExpectationComplete?: (salary: string) => void
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
  onJobSearchIntensityComplete,
  onProfileComplete,
  onProfileSkip,
  onBack,
  onJobTitleComplete,
  onWorkLocationComplete,
  onJobTypeComplete,
  onSalaryExpectationComplete,
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
        onBack={onBack}
        firstName={firstName}
        lastName={lastName}
      />
    )
  }

  // Step 4: Job search intensity
  if (step === 4) {
    return (
      <JobSearchIntensity
        onComplete={onJobSearchIntensityComplete || (() => {})}
      />
    )
  }

  // Step 5: Job title
  if (step === 5) {
    return (
      <JobTitleStep
        onComplete={onJobTitleComplete || (() => {})}
      />
    )
  }

  // Step 6: Work location
  if (step === 6) {
    return (
      <WorkLocationStep
        onComplete={onWorkLocationComplete || (() => {})}
      />
    )
  }

  // Step 7: Job type
  if (step === 7) {
    return (
      <JobTypeStep
        onComplete={onJobTypeComplete || (() => {})}
      />
    )
  }

  // Step 8: Salary expectation
  if (step === 8) {
    return (
      <SalaryExpectationStep
        onComplete={onSalaryExpectationComplete || (() => {})}
      />
    )
  }

  // Step 9: Loading state
  if (isLoading) {
    return <LoadingStep />
  }

  // Step 10: Completion
  if (step === 9) {
    return <CompletionStep firstName={firstName} lastName={lastName} />
  }

  // Placeholder for future steps
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Step {step} - Coming soon!</p>
    </div>
  )
} 