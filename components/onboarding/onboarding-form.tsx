import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, MapPin } from "lucide-react"

interface OnboardingFormProps {
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
}

export function OnboardingForm({
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
}: OnboardingFormProps) {
  return (
    <div className="space-y-6 pb-4 onboarding-form-inputs">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Deine Kontaktdaten
        </h2>
        <p className="text-gray-600">
          Gib uns deine Kontaktdaten, damit wir dir die besten Jobangebote zeigen können.
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefonnummer
          </Label>
          <div className="relative -mx-0.5 px-0.5">
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+49 123 456789"
              className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">
              Adresse
            </Label>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Straße & Hausnummer
            </Label>
            <div className="relative -mx-0.5 px-0.5">
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                placeholder="z.B. Musterstraße 123"
                className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              />
            </div>
          </div>

          {/* City, State, Zip Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                Stadt
              </Label>
              <div className="relative -mx-0.5 px-0.5">
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => onCityChange(e.target.value)}
                  placeholder="z.B. Berlin"
                  className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                Bundesland
              </Label>
              <div className="relative -mx-0.5 px-0.5">
                <Input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => onStateChange(e.target.value)}
                  placeholder="z.B. Berlin"
                  className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                Postleitzahl
              </Label>
              <div className="relative -mx-0.5 px-0.5">
                <Input
                  id="zipCode"
                  type="text"
                  value={zipCode}
                  onChange={(e) => onZipCodeChange(e.target.value)}
                  placeholder="z.B. 10115"
                  className="w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 