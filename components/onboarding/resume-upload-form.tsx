import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Linkedin, FileText, Plus } from "lucide-react"
import { ProfileModal } from "./profile-modal"

interface ResumeUploadFormProps {
  onResumeDataChange?: (data: any) => void
  resumeData?: any
  isLoading?: boolean
}

export function ResumeUploadForm({
  onResumeDataChange,
  resumeData,
  isLoading,
}: ResumeUploadFormProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'linkedin' | 'manual' | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [manualContent, setManualContent] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onResumeDataChange?.({ method: 'file', file })
    }
  }

  const handleLinkedinSubmit = () => {
    if (linkedinUrl) {
      onResumeDataChange?.({ method: 'linkedin', url: linkedinUrl })
    }
  }

  const handleManualSubmit = () => {
    if (manualContent) {
      onResumeDataChange?.({ method: 'manual', content: manualContent })
    }
  }

  const handleManualOptionClick = () => {
    setUploadMethod('manual')
    setIsProfileModalOpen(true)
  }

  const handleProfileModalComplete = (profileData: any) => {
    setIsProfileModalOpen(false)
    onResumeDataChange?.({ method: 'manual', profileData })
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Lebenslauf hochladen
        </h3>
        <p className="text-sm text-gray-600">
          Wähle eine der folgenden Optionen
        </p>
      </div>

      {/* Upload Options */}
      <div className="grid gap-3">
        {/* File Upload */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            uploadMethod === 'file' ? 'ring-2 ring-[#0F973D]' : ''
          }`}
          onClick={() => setUploadMethod('file')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Datei hochladen</h4>
                <p className="text-sm text-gray-600">PDF, DOC, DOCX (max. 5MB)</p>
              </div>
            </div>
            {uploadMethod === 'file' && (
              <div className="mt-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* LinkedIn */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            uploadMethod === 'linkedin' ? 'ring-2 ring-[#0F973D]' : ''
          }`}
          onClick={() => setUploadMethod('linkedin')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">LinkedIn Profil</h4>
                <p className="text-sm text-gray-600">Dein LinkedIn Profil importieren</p>
              </div>
            </div>
            {uploadMethod === 'linkedin' && (
              <div className="mt-3 space-y-2">
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/dein-profil"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full focus:border-[#0F973D] focus:ring-[#0F973D] focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50"
                />
                <Button 
                  onClick={handleLinkedinSubmit}
                  className="w-full bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                >
                  Importieren
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            uploadMethod === 'manual' ? 'ring-2 ring-[#0F973D]' : ''
          }`}
          onClick={handleManualOptionClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Manuell eingeben</h4>
                <p className="text-sm text-gray-600">Profil mit Formular erstellen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onComplete={handleProfileModalComplete}
      />
    </div>
  )
} 