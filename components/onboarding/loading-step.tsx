import React from "react"
import { Loader2, FileText, Linkedin, Upload } from "lucide-react"

export function LoadingStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0F973D]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-8 w-8 text-[#0F973D]" />
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Lebenslauf wird analysiert...
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Ich extrahiere die wichtigsten Informationen aus deinem Lebenslauf
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-[#0F973D] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Datei erfolgreich hochgeladen</p>
            <p className="text-xs text-gray-500">PDF/DOC wurde verarbeitet</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Text wird extrahiert</p>
            <p className="text-xs text-gray-500">Analysiere Dokumentinhalt...</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Profil erstellen</p>
            <p className="text-xs text-gray-400">Wird vorbereitet...</p>
          </div>
        </div>
      </div>

      {/* Processing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Linkedin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              KI-Analyse läuft
            </h4>
            <p className="text-xs text-blue-700">
              Ich identifiziere automatisch deine Fähigkeiten, Erfahrungen und Qualifikationen aus dem Lebenslauf.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 