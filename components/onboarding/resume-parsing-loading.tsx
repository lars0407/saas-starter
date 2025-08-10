import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, FileText, Sparkles } from "lucide-react"

interface ResumeParsingLoadingProps {
  fileName?: string
}

export function ResumeParsingLoading({ fileName }: ResumeParsingLoadingProps) {
  const loadingTexts = [
    "✨ Dein CV wird gerade von unserer KI zerlegt...",
    "🧠 Die KI analysiert deine Skills...",
    "📚 Ausbildung wird geparst...",
    "💼 Berufserfahrung wird extrahiert...",
    "🎯 Fast fertig, nur noch ein paar Sekunden...",
    "🚀 Dein Profil wird erstellt..."
  ]

  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [loadingTexts.length])

  return (
    <div className="space-y-6 text-center">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#0F973D]">
          <FileText className="h-6 w-6" />
          <h3 className="text-xl font-bold">CV wird geparst! 🚀</h3>
        </div>
        {fileName && (
          <p className="text-sm text-gray-600">
            Datei: <span className="font-mono">{fileName}</span>
          </p>
        )}
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <img 
            src="/images/utility/loading.gif" 
            alt="Loading animation" 
            className="w-32 h-32"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#0F973D] animate-spin" />
          </div>
        </div>
      </div>

      {/* Dynamic Loading Text */}
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">KI arbeitet gerade...</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 min-h-[2.5rem] flex items-center justify-center">
            {loadingTexts[currentTextIndex]}
          </p>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Datei hochgeladen ✅</span>
          <span>Wird verarbeitet...</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#0F973D] h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Unsere KI kann über 50+ Sprachen erkennen</p>
        <p>🎯 Extrahiert automatisch Skills und Erfahrungen</p>
        <p>⚡ Dauert normalerweise nur 10-30 Sekunden</p>
      </div>
    </div>
  )
} 