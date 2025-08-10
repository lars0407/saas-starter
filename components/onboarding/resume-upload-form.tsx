import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Plus, AlertCircle, CheckCircle } from "lucide-react"
import { useResumeParser } from "@/hooks/use-resume-parser"
import { ResumeParsingLoading } from "./resume-parsing-loading"

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
  const [uploadMethod, setUploadMethod] = useState<'file' | 'manual' | null>(null)
  const [manualContent, setManualContent] = useState('')
  
  const { isParsing, error, parseResume, reset, clearError } = useResumeParser()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      clearError()
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        // Handle validation error through the hook
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        // Handle validation error through the hook
        return
      }

      // Start parsing
      try {
        const result = await parseResume(file)
        onResumeDataChange?.(result)
      } catch (error) {
        // Error is already handled by the hook
        console.error('Resume parsing failed:', error)
      }
    }
  }

  const handleManualSubmit = () => {
    if (manualContent) {
      onResumeDataChange?.({ method: 'manual', content: manualContent })
    }
  }

  const handleManualOptionClick = () => {
    setUploadMethod('manual')
    // This will be handled by the parent component now
  }

  const handleRetry = () => {
    reset()
  }

  // Show loading state while parsing
  if (isParsing) {
    return <ResumeParsingLoading fileName={resumeData?.fileName} />
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! 😅
          </h3>
          <p className="text-sm text-gray-600">
            Da ist etwas schiefgelaufen
          </p>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h4 className="font-medium text-red-900">Fehler beim Verarbeiten</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Erneut versuchen
              </Button>
              <Button 
                onClick={() => {
                  reset()
                }}
                variant="outline"
              >
                Neue Datei wählen
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Oder wähle eine andere Option:
          </p>
          <div className="flex justify-center gap-3">
            <Button 
              onClick={handleManualOptionClick}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Manuell
            </Button>
          </div>
        </div>
      </div>
    )
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
                <p className="text-sm text-gray-600">PDF (max. 5MB)</p>
              </div>
            </div>
            {uploadMethod === 'file' && (
              <div className="mt-3 space-y-3">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  <p>✨ Unsere KI extrahiert automatisch alle wichtigen Informationen</p>
                  <p>📄 Unterstützt nur PDF-Dateien</p>
                  <p>⚡ Verarbeitung dauert ca. 10-30 Sekunden</p>
                </div>
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
    </div>
  )
} 