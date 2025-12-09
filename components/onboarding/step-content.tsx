import React from "react"
import { OnboardingForm } from "./onboarding-form"
import { ResumeUploadForm } from "./resume-upload-form"
import { LoadingStep } from "./loading-step"
import { ProfileContent } from "./profile-content"
import { JobSearchIntensity } from "./job-search-intensity"
import { JobTitleStep } from "./job-title-step"
import { WorkLocationStep } from "./work-location-step"
import { JobTypeStep } from "./job-type-step"
import { JobLocationStep } from "./job-location-step"
import { Button } from "@/components/ui/button"

interface StepContentProps {
  step: number
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onCityChange: (value: string) => void
  onStateChange: (value: string) => void
  onZipCodeChange: (value: string) => void
  onResumeDataChange?: (data: any) => void
  onJobSearchIntensityComplete?: (intensity: string) => void
  onProfileComplete?: (data: any) => void
  onProfileSkip?: () => void
  onBack?: () => void
  onJobTitleComplete?: (title: string) => void
  onWorkLocationComplete?: (location: string) => void
  onJobTypeComplete?: (type: string) => void
  onJobLocationComplete?: (data: {
    location: string;
    selectedAddress: any;
    selectedLocation: { lat: number; lon: number } | null;
  }) => void
  resumeData?: any
  isLoading?: boolean
}

export function StepContent({
  step,
  firstName,
  lastName,
  phone,
  address,
  city,
  state,
  zipCode,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onAddressChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  onResumeDataChange,
  onJobSearchIntensityComplete,
  onProfileComplete,
  onProfileSkip,
  onBack,
  onJobTitleComplete,
  onWorkLocationComplete,
  onJobTypeComplete,
  onJobLocationComplete,
  resumeData,
  isLoading,
}: StepContentProps) {
  // Step 1: Name input
  if (step === 1) {
    return (
      <OnboardingForm
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        address={address}
        city={city}
        state={state}
        zipCode={zipCode}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onPhoneChange={onPhoneChange}
        onAddressChange={onAddressChange}
        onCityChange={onCityChange}
        onStateChange={onStateChange}
        onZipCodeChange={onZipCodeChange}
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

  // Step 6: Job location
  if (step === 6) {
    return (
      <JobLocationStep
        onComplete={onJobLocationComplete || (() => {})}
      />
    )
  }

  // Step 7: Work location
  if (step === 7) {
    return (
      <WorkLocationStep
        onComplete={onWorkLocationComplete || (() => {})}
      />
    )
  }

  // Step 8: Job type
  if (step === 8) {
    return (
      <JobTypeStep
        onComplete={onJobTypeComplete || (() => {})}
      />
    )
  }

  // Loading state (only show if not on step 8, as it has its own loading state)
  if (isLoading && step !== 8) {
    return <LoadingStep />
  }

  // Invalid step - should not happen, but return empty if it does
  return null
} 