import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Monitor, MapPin } from "lucide-react"

interface WorkLocationStepProps {
  onComplete: (location: string) => void
}

export function WorkLocationStep({ onComplete }: WorkLocationStepProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("")

  const handleContinue = () => {
    if (!selectedLocation) return // Don't proceed if nothing selected
    console.log('WorkLocationStep: handleContinue called with:', selectedLocation)
    onComplete(selectedLocation)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Wo möchtest du arbeiten?
        </h2>
        <p className="text-gray-600">
          Wähle deine bevorzugte Arbeitsumgebung aus.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Option 1: Remote */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedLocation === 'remote' ? 'ring-2 ring-[#0F973D] bg-green-50' : ''
          }`}
          onClick={() => setSelectedLocation('remote')}
        >
          <CardContent className="p-2.5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  🏠 Remote / Home Office
                </h4>
                <p className="text-gray-600 text-xs">
                  Ich will von überall arbeiten können! Flexibilität ist mir wichtig.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: In Person */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedLocation === 'in-person' ? 'ring-2 ring-[#0F973D] bg-blue-50' : ''
          }`}
          onClick={() => setSelectedLocation('in-person')}
        >
          <CardContent className="p-2.5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  🏢 Vor Ort im Büro
                </h4>
                <p className="text-gray-600 text-xs">
                  Ich mag das Team-Feeling und die direkte Zusammenarbeit!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 3: Hybrid */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedLocation === 'hybrid' ? 'ring-2 ring-[#0F973D] bg-purple-50' : ''
          }`}
          onClick={() => setSelectedLocation('hybrid')}
        >
          <CardContent className="p-2.5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Monitor className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  🔄 Hybrid (Mix aus beidem)
                </h4>
                <p className="text-gray-600 text-xs">
                  Das Beste aus beiden Welten - manchmal Büro, manchmal Home Office!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 4: Egal */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedLocation === 'flexible' ? 'ring-2 ring-[#0F973D] bg-gray-50' : ''
          }`}
          onClick={() => setSelectedLocation('flexible')}
        >
          <CardContent className="p-2.5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  🤷‍♂️ Ist mir egal
                </h4>
                <p className="text-gray-600 text-xs">
                  Hauptsache der Job passt - der Rest ist mir nicht so wichtig!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleContinue}
          disabled={!selectedLocation}
          className={`px-8 py-3 rounded-lg font-medium ${
            !selectedLocation
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