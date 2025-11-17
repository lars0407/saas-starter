import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import AddressSearch from "@/components/address-search"

interface Address {
  id: number;
  display_name: string;
  lat: number;
  lon: number;
  type: string;
  importance: number;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    house_number?: string;
  };
}

interface JobLocationStepProps {
  onComplete: (data: {
    location: string;
    selectedAddress: Address | null;
    selectedLocation: { lat: number; lon: number } | null;
  }) => void
}

export function JobLocationStep({ onComplete }: JobLocationStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [location, setLocation] = useState<string>("")

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
    setLocation(address.display_name)
  }

  const handleContinue = () => {
    if (!selectedAddress || !location) return
    
    onComplete({
      location: location,
      selectedAddress: selectedAddress,
      selectedLocation: {
        lat: selectedAddress.lat,
        lon: selectedAddress.lon
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Wo suchst du nach einem Job?
        </h2>
        <p className="text-gray-600">
          Gib die Stadt oder Adresse ein, wo du nach Jobs suchen möchtest.
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="relative z-10">
          <AddressSearch
            onAddressSelect={handleAddressSelect}
            placeholder="z.B. Berlin, München oder eine Adresse..."
            className="w-full"
          />
        </div>
        {selectedAddress && (
          <div className="text-sm text-gray-500">
            Ausgewählte Adresse: {selectedAddress.display_name}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleContinue}
          disabled={!selectedAddress || !location}
          className={`px-8 py-3 rounded-lg font-medium ${
            !selectedAddress || !location
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#0F973D] hover:bg-[#0D7A32] text-white'
          }`}
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}

