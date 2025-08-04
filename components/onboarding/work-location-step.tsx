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
    if (selectedLocation) {
      onComplete(selectedLocation)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Wo willst du arbeiten? 🏢
        </h3>
        <p className="text-gray-600">
          Wähle deine bevorzugte Arbeitsumgebung - das ist wichtig für deine Work-Life-Balance!
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
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🏠 Remote / Home Office
                </h4>
                <p className="text-gray-600 text-sm">
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
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🏢 Vor Ort im Büro
                </h4>
                <p className="text-gray-600 text-sm">
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
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔄 Hybrid (Mix aus beidem)
                </h4>
                <p className="text-gray-600 text-sm">
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
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <MapPin className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🤷‍♂️ Ist mir egal
                </h4>
                <p className="text-gray-600 text-sm">
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
          className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
} 