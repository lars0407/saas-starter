"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Bot, Save, RefreshCw, AlertTriangle, Brain, Sparkles } from "lucide-react"

export function AiSettings() {
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
            </div>
            <Switch
              checked={aiSettings.useJobHistory}
              onCheckedChange={() => handleToggle('useJobHistory')}
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
            </div>
            <Switch
              checked={aiSettings.autoEnhancement}
              onCheckedChange={() => handleToggle('autoEnhancement')}
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
            </div>
            <Switch
              checked={aiSettings.personalizedSuggestions}
              onCheckedChange={() => handleToggle('personalizedSuggestions')}
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
            </div>
            <Switch
              checked={aiSettings.learningMode}
              onCheckedChange={() => handleToggle('learningMode')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="w-full bg-[#0F973D] hover:bg-[#0D7A32] text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Speichern..." : "Einstellungen speichern"}
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

      {/* AI Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900">KI-Tipps 🤖</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Je mehr Daten du teilst, desto besser die Jobvorschläge</li>
                <li>• Die KI lernt aus deinen Bewerbungen und Entscheidungen</li>
                <li>• Automatische Optimierung verbessert deine Dokumente</li>
                <li>• Du kannst jederzeit alle Einstellungen ändern</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Stats */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-900">Deine KI-Statistiken 📊</h3>
              <div className="text-sm text-green-700 mt-2 space-y-1">
                <p>• <strong>127</strong> Jobs analysiert</p>
                <p>• <strong>23</strong> Bewerbungen optimiert</p>
                <p>• <strong>89%</strong> Übereinstimmung mit deinen Präferenzen</p>
                <p>• <strong>15</strong> neue Jobvorschläge diese Woche</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 