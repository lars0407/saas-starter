import React from "react"
import { CheckCircle, Sparkles, FileText, User } from "lucide-react"

interface CompletionStepProps {
  firstName: string
  lastName: string
}

export function CompletionStep({ firstName, lastName }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#0F973D] rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Willkommen bei Jobjäger! 🎉
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Dein Profil wurde erfolgreich erstellt
        </p>
      </div>

      {/* Success Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <User className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-900 mb-1">
              Profil erstellt für {firstName} {lastName}
            </h4>
            <p className="text-xs text-green-700">
              Deine Daten wurden erfolgreich importiert und analysiert.
            </p>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Was du jetzt machen kannst:
        </h4>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">KI-Tools nutzen</p>
              <p className="text-xs text-gray-600">Lebenslauf & Anschreiben generieren</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dokumente verwalten</p>
              <p className="text-xs text-gray-600">Alle deine Unterlagen an einem Ort</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="flex-shrink-0">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Profil vervollständigen</p>
              <p className="text-xs text-gray-600">Weitere Details hinzufügen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-[#0F973D]">100%</div>
          <div className="text-xs text-gray-600">Profil vollständig</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-[#0F973D]">✓</div>
          <div className="text-xs text-gray-600">Bereit für Jobs</div>
        </div>
      </div>
    </div>
  )
} 