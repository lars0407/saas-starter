import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OnboardingFormProps {
  firstName: string
  lastName: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
}

export function OnboardingForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: OnboardingFormProps) {
  return (
    <div className="space-y-6 pb-4 onboarding-form-inputs">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Wie heißt du?
        </h2>
        <p className="text-gray-600">
          Lass uns mit deinem Namen starten – das ist der erste Schritt zu deinem Traumjob!
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Dein Vorname
          </Label>
          <div className="relative -mx-0.5 px-0.5">
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Max"
              className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Dein Nachname
          </Label>
          <div className="relative -mx-0.5 px-0.5">
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Mustermann"
              className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 