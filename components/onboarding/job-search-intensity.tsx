import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Clock, Eye } from "lucide-react"

interface JobSearchIntensityProps {
  onComplete: (intensity: string) => void
}

export function JobSearchIntensity({ onComplete }: JobSearchIntensityProps) {
  const [selectedIntensity, setSelectedIntensity] = useState<string>("")

  const handleContinue = () => {
    if (selectedIntensity) {
      onComplete(selectedIntensity)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Wie aktiv bist du auf Jobsuche?
        </h2>
        <p className="text-gray-600">
          Du entscheidest, wie oft wir dich für neue Jobangebote kontaktieren.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Option 1: Active Search */}
                 <Card 
           className={`cursor-pointer transition-all hover:shadow-md ${
             selectedIntensity === 'active' ? 'ring-2 ring-[#0F973D] bg-green-50' : ''
           }`}
           onClick={() => setSelectedIntensity('active')}
         >
           <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔥 Ich suche aktiv nach einem Job
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Ich bin ready für den nächsten Move und will schnell was Neues finden!
                </p>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: Not in a hurry */}
                 <Card 
           className={`cursor-pointer transition-all hover:shadow-md ${
             selectedIntensity === 'casual' ? 'ring-2 ring-[#0F973D] bg-blue-50' : ''
           }`}
           onClick={() => setSelectedIntensity('casual')}
         >
           <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  😌 Ich bin nicht in Eile
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Ich schaue mich um, aber es muss nicht sofort sein. Chill vibes only!
                </p>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 3: Just browsing */}
                 <Card 
           className={`cursor-pointer transition-all hover:shadow-md ${
             selectedIntensity === 'browsing' ? 'ring-2 ring-[#0F973D] bg-purple-50' : ''
           }`}
           onClick={() => setSelectedIntensity('browsing')}
         >
           <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  👀 Ich schaue mich einfach mal um
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Ich bin neugierig, was so abgeht. Vielleicht finde ich was Cooles!
                </p>
                
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleContinue}
          disabled={!selectedIntensity}
          className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
} 