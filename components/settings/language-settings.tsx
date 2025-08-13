"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Globe, Save, Clock, MapPin } from "lucide-react"

export function LanguageSettings() {
  const [language, setLanguage] = useState("de")
  const [timeFormat, setTimeFormat] = useState("24h")
  const [locationBasedJobs, setLocationBasedJobs] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setHasChanges(true)
  }

  const handleTimeFormatChange = (value: string) => {
    setTimeFormat(value)
    setHasChanges(true)
  }

  const handleLocationToggle = () => {
    setLocationBasedJobs(!locationBasedJobs)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Sprache & Region gespeichert! 🌐")
      setHasChanges(false)
    } catch (error) {
      toast.error("Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  const languages = [
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "en", label: "Englisch", flag: "🇺🇸" },
    { value: "fr", label: "Französisch", flag: "🇫🇷" },
    { value: "es", label: "Spanisch", flag: "🇪🇸" }
  ]

  const timeFormats = [
    { value: "24h", label: "24-Stunden (14:30)" },
    { value: "12h", label: "12-Stunden (2:30 PM)" }
  ]

  return (
    <div className="space-y-6">

      {/* Coming Soon */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-gray-900">Bald verfügbar 🚀</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Mehr Sprachen (Italienisch, Niederländisch, etc.)</li>
                <li>• Automatische Zeitzonen-Erkennung</li>
                <li>• Regionale Job-Trends und Statistiken</li>
                <li>• Personalisierte regionale Einstellungen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sprache & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Sprache auswählen</Label>
            <Select value={language} onValueChange={handleLanguageChange} disabled>
              <SelectTrigger className="focus:border-[#0F973D] focus:ring-[#0F973D]/20 bg-gray-100">
                <SelectValue placeholder="Sprache wählen" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Diese Sprache wird für die gesamte App verwendet
            </p>
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium">🚧 Under Construction</span>
            </div>
          </div>

          <Separator />

          {/* Time Format */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Uhrzeit: 24h oder 12h?</span>
            </Label>
            <Select value={timeFormat} onValueChange={handleTimeFormatChange} disabled>
              <SelectTrigger className="focus:border-[#0F973D] focus:ring-[#0F973D]/20 bg-gray-100">
                <SelectValue placeholder="Zeitformat wählen" />
              </SelectTrigger>
              <SelectContent>
                {timeFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Bestimmt, wie Uhrzeiten in der App angezeigt werden
            </p>
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium">🚧 Under Construction</span>
            </div>
          </div>

          <Separator />

          {/* Location Based Jobs */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Jobs in meiner Nähe anzeigen</span>
              </Label>
              <p className="text-sm text-gray-500">
                Zeige Jobvorschläge basierend auf deinem Standort
              </p>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">🚧 Under Construction</span>
              </div>
            </div>
            <Switch
              checked={locationBasedJobs}
              onCheckedChange={handleLocationToggle}
              disabled
              className="opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={true}
            className="w-full bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed"
          >
            <Save className="mr-2 h-4 w-4" />
            🚧 Under Construction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 