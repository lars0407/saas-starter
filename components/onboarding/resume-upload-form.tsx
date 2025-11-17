import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Plus, AlertCircle, CheckCircle, Zap, Linkedin } from "lucide-react"
import { toast } from "sonner"
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
  const [uploadMethod, setUploadMethod] = useState<'file' | 'linkedin' | 'manual' | null>(null)
  const [manualContent, setManualContent] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  
  const { isParsing, error, parseResume, parseLinkedIn, reset, clearError } = useResumeParser()

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

  const handleLinkedInImport = async () => {
    if (!linkedinUrl.trim()) {
      toast.error('Bitte gib eine LinkedIn-URL ein')
      return
    }

    clearError()
    
    try {
      const result = await parseLinkedIn(linkedinUrl.trim())
      onResumeDataChange?.(result)
    } catch (error) {
      // Error is already handled by the hook
      console.error('LinkedIn parsing failed:', error)
      toast.error(error instanceof Error ? error.message : 'Fehler beim Importieren des LinkedIn-Profils')
    }
  }

  const handleManualOptionClick = () => {
    setUploadMethod('manual')
    onResumeDataChange?.({ method: 'manual' })
  }

  const handleRetry = () => {
    reset()
  }

  // Show loading state while parsing
  if (isParsing) {
    return <ResumeParsingLoading fileName={resumeData?.fileName || (uploadMethod === 'linkedin' ? 'LinkedIn Profil' : undefined)} />
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
                  setUploadMethod(null)
                  setLinkedinUrl('')
                }}
                variant="outline"
              >
                {uploadMethod === 'linkedin' ? 'Neue URL eingeben' : 'Neue Datei wählen'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Oder wähle eine andere Option:
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {uploadMethod !== 'file' && (
              <Button 
                onClick={() => {
                  reset()
                  setUploadMethod('file')
                  setLinkedinUrl('')
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                CV hochladen
              </Button>
            )}
            {uploadMethod !== 'linkedin' && (
              <Button 
                onClick={() => {
                  reset()
                  setUploadMethod('linkedin')
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            )}
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
    <div className="space-y-6 pb-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Lebenslauf hinzufügen
        </h2>
        <p className="text-gray-600">
          Teile deinen Lebenslauf mit uns, damit wir dir passende Jobs vorschlagen können.
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
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">CV hochladen</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-[#0F973D] text-xs font-medium">
                    <Zap className="h-3 w-3" />
                    Schnellste
                  </span>
                </div>
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

        {/* LinkedIn Import */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            uploadMethod === 'linkedin' ? 'ring-2 ring-[#0F973D]' : ''
          }`}
          onClick={() => setUploadMethod('linkedin')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#0077B5] rounded-lg">
                <Linkedin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">LinkedIn Profil importieren</h4>
                </div>
                <p className="text-sm text-gray-600">Importiere dein Profil direkt von LinkedIn</p>
              </div>
            </div>
            {uploadMethod === 'linkedin' && (
              <div className="mt-3 space-y-3">
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full border-[#0F973D] focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkedInImport()
                    }
                  }}
                />
                <Button
                  onClick={handleLinkedInImport}
                  disabled={!linkedinUrl.trim() || isParsing}
                  className="w-full bg-[#0077B5] hover:bg-[#006399] text-white"
                >
                  {isParsing ? 'Importiere...' : 'Profil importieren'}
                </Button>
                <div className="text-xs text-gray-500">
                  <p>🔗 Gib deine öffentliche LinkedIn-Profil-URL ein</p>
                  <p>✨ Alle Informationen werden automatisch extrahiert</p>
                  <p>⚡ Import dauert ca. 10-30 Sekunden</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Input - Text Link */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleManualOptionClick}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors duration-200 hover:underline underline-offset-4 cursor-pointer"
          >
            Profil manuell erstellen
          </button>
        </div>
      </div>
    </div>
  )
} 