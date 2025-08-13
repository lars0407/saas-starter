"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Bot, Save, RefreshCw, AlertTriangle, Brain, Sparkles } from "lucide-react"

interface UserPreferences {
  job_offers: boolean
  newsletter: boolean
  call: boolean
  whatsapp: boolean
  notification: {
    newJobAlerts: boolean
    applicationReminders: boolean
    aiDocumentChanges: boolean
    weeklySummary: boolean
    newsAndUpdates: boolean
  }
}

interface AiSettingsProps {
  preferences: UserPreferences | null
}

export function AiSettings({ preferences }: AiSettingsProps) {
  const [aiSettings, setAiSettings] = useState({
    useJobHistory: true,
    autoEnhancement: true,
    personalizedSuggestions: true,
    learningMode: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [resetConfirm, setResetConfirm] = useState("")
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setAiSettings({
        useJobHistory: preferences.notification.aiDocumentChanges,
        autoEnhancement: preferences.notification.newJobAlerts,
        personalizedSuggestions: preferences.notification.weeklySummary,
        learningMode: preferences.notification.newsAndUpdates
      })
    }
  }, [preferences])

  const handleToggle = (key: keyof typeof aiSettings) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("KI-Einstellungen gespeichert! 🤖")
      setHasChanges(false)
    } catch (error) {
      toast.error("Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetProfile = async () => {
    if (resetConfirm !== "RESET") {
      toast.error("Bitte gib 'RESET' ein, um zu bestätigen.")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("KI-Profil zurückgesetzt! 🧹")
      setShowResetDialog(false)
      setResetConfirm("")
    } catch (error) {
      toast.error("Fehler beim Zurücksetzen des KI-Profils.")
    } finally {
      setIsLoading(false)
    }
  }

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
                <li>• Erweiterte KI-Personalisierung</li>
                <li>• Intelligente Jobvorschläge</li>
                <li>• Automatische Dokumentenoptimierung</li>
                <li>• Lernende KI-Algorithmen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">KI-Personalisierung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job History Usage */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Nutzung von Jobverlauf erlauben</Label>
              <p className="text-sm text-gray-500">
                Erlaube KI, meinen Verlauf für bessere Vorschläge zu nutzen
              </p>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">🚧 Under Construction</span>
              </div>
            </div>
            <Switch
              checked={aiSettings.useJobHistory}
              onCheckedChange={() => handleToggle('useJobHistory')}
              disabled
              className="opacity-50"
            />
          </div>

          <Separator />

          {/* Auto Enhancement */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Automatische Optimierung aktivieren</Label>
              <p className="text-sm text-gray-500">
                Meine Lebensläufe & Anschreiben automatisch verbessern
              </p>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">🚧 Under Construction</span>
              </div>
            </div>
            <Switch
              checked={aiSettings.autoEnhancement}
              onCheckedChange={() => handleToggle('autoEnhancement')}
              disabled
              className="opacity-50"
            />
          </div>

          <Separator />

          {/* Personalized Suggestions */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Personalisierte Jobvorschläge</Label>
              <p className="text-sm text-gray-500">
                KI-basierte Jobempfehlungen basierend auf deinem Profil
              </p>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">🚧 Under Construction</span>
              </div>
            </div>
            <Switch
              checked={aiSettings.personalizedSuggestions}
              onCheckedChange={() => handleToggle('personalizedSuggestions')}
              disabled
              className="opacity-50"
            />
          </div>

          <Separator />

          {/* Learning Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">KI-Lernmodus aktivieren</Label>
              <p className="text-sm text-gray-500">
                KI lernt aus deinen Entscheidungen für bessere Vorschläge
              </p>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">🚧 Under Construction</span>
              </div>
            </div>
            <Switch
              checked={aiSettings.learningMode}
              onCheckedChange={() => handleToggle('learningMode')}
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

      {/* AI Profile Reset */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg text-orange-900 flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>KI-Profil zurücksetzen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-orange-900 mb-2">Reset für mein AI-Persönlichkeitsprofil</h3>
            <p className="text-sm text-orange-700 mb-4">
              Das setzt alles zurück, was die KI über dich gelernt hat. Sicher?
            </p>
          </div>

          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                <RefreshCw className="mr-2 h-4 w-4" />
                KI-Profil zurücksetzen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>KI-Profil wirklich zurücksetzen?</span>
                </DialogTitle>
                <DialogDescription>
                  Das löscht alle Daten, die die KI über dich gelernt hat. 
                  Deine Jobvorschläge werden weniger personalisiert sein.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resetConfirm" className="text-sm font-medium">
                    Gib "RESET" ein, um zu bestätigen:
                  </Label>
                  <Input
                    id="resetConfirm"
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    placeholder="RESET"
                    className="mt-2"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetProfile}
                  disabled={resetConfirm !== "RESET" || isLoading}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {isLoading ? "Zurücksetzen..." : "Ja, zurücksetzen"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
} 