import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"

interface JobTypeStepProps {
  onComplete: (jobType: string) => void
}

export function JobTypeStep({ onComplete }: JobTypeStepProps) {
  const [selectedJobType, setSelectedJobType] = useState<string>("")

  const handleContinue = () => {
    console.log('JobTypeStep: handleContinue called with:', selectedJobType)
    onComplete(selectedJobType || 'flexible') // Default to flexible if nothing selected
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Wie viel Zeit hast du? ⏰
        </h3>
        <p className="text-gray-600">
          Wähle deine bevorzugte Arbeitszeit - das hilft uns dabei, passende Jobs zu finden!
        </p>
      </div>

      <div className="grid gap-4">
        {/* Option 1: Full Time */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedJobType === 'full-time' ? 'ring-2 ring-[#0F973D] bg-green-50' : ''
          }`}
          onClick={() => setSelectedJobType('full-time')}
        >
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  💼 Vollzeit (40h/Woche)
                </h4>
                <p className="text-gray-600 text-sm">
                  Ich bin ready für den Full-Time Grind! Hauptjob ist mein Fokus.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: Part Time */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedJobType === 'part-time' ? 'ring-2 ring-[#0F973D] bg-blue-50' : ''
          }`}
          onClick={() => setSelectedJobType('part-time')}
        >
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ⏱️ Teilzeit (20-30h/Woche)
                </h4>
                <p className="text-gray-600 text-sm">
                  Ich will mehr Flexibilität! Nebenjob oder Work-Life-Balance ist mir wichtig.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 3: Flexible */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedJobType === 'flexible' ? 'ring-2 ring-[#0F973D] bg-purple-50' : ''
          }`}
          onClick={() => setSelectedJobType('flexible')}
        >
          <CardContent className="p-3">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔄 Flexibel / Egal
                </h4>
                <p className="text-gray-600 text-sm">
                  Hauptsache der Job passt! Ich bin offen für alles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleContinue}
          className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
} 