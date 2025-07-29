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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
          Dein Vorname
        </Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Max"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
          Dein Nachname
        </Label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Mustermann"
          className="w-full"
        />
      </div>
    </div>
  )
} 