import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase } from "lucide-react"

interface JobTitleStepProps {
  onComplete: (jobTitle: string) => void
}

export function JobTitleStep({ onComplete }: JobTitleStepProps) {
  const [jobTitle, setJobTitle] = useState<string>("")

  const handleContinue = () => {
    console.log('JobTitleStep: handleContinue called with:', jobTitle.trim())
    onComplete(jobTitle.trim())
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Was ist dein Dream Job? 💼
        </h3>
        <p className="text-gray-600">
          Sag uns, welchen Job-Titel du suchst - das hilft uns dabei, dir die perfekten Stellen zu finden!
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job-Titel
          </Label>
                     <Input
             id="jobTitle"
             type="text"
             placeholder="z.B. Frontend Developer, Marketing Manager, UX Designer..."
             value={jobTitle}
             onChange={(e) => setJobTitle(e.target.value)}
             className="mt-1 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
           />
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Pro-Tipp:</p>
          <p>Sei spezifisch! "Software Engineer" ist besser als nur "IT" - das hilft der KI, dir passendere Jobs zu zeigen!</p>
        </div>
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