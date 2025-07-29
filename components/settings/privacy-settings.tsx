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
import { Shield, Eye, EyeOff, Trash2, Save, AlertTriangle } from "lucide-react"

export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    allowDataUsage: true,
    jobTracking: true,
    twoFactorAuth: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
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
      
      toast.success("Datenschutz-Einstellungen gespeichert! 🔒")
      setHasChanges(false)
    } catch (error) {
      toast.error("Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "LÖSCHEN") {
      toast.error("Bitte gib 'LÖSCHEN' ein, um zu bestätigen.")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Bye bye, Jobjäger 👋")
      // Redirect to logout or home page
    } catch (error) {
      toast.error("Fehler beim Löschen des Kontos.")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
      setDeleteConfirm("")
    }
  }

  return (
    <div className="space-y-6">

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sichtbarkeit & Datenschutz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Zeig mein Profil anderen Unternehmen</Label>
              <p className="text-sm text-gray-500">
                Erlaube Unternehmen, dein Profil in der Jobsuche zu sehen
              </p>
            </div>
            <Switch
              checked={privacySettings.profileVisible}
              onCheckedChange={() => handleToggle('profileVisible')}
            />
          </div>

          <Separator />

          {/* Data Usage */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">KI darf meine Daten nutzen</Label>
              <p className="text-sm text-gray-500">
                Erlaube KI, meine Daten zu nutzen für bessere Vorschläge
              </p>
            </div>
            <Switch
              checked={privacySettings.allowDataUsage}
              onCheckedChange={() => handleToggle('allowDataUsage')}
            />
          </div>

          <Separator />

          {/* Job Tracking */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Job-Tracking aktivieren</Label>
              <p className="text-sm text-gray-500">
                Verfolge deine Bewerbungen und Job-Aktivitäten
              </p>
            </div>
            <Switch
              checked={privacySettings.jobTracking}
              onCheckedChange={() => handleToggle('jobTracking')}
            />
          </div>

          <Separator />

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Zwei-Faktor-Authentifizierung</Label>
              <p className="text-sm text-gray-500">
                Zusätzlicher Schutz für dein Konto (bald verfügbar)
              </p>
            </div>
            <Switch
              checked={privacySettings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
              disabled
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

      {/* Account Deletion */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg text-red-900 flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Gefährliche Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-red-900 mb-2">Bye bye, Jobjäger 👋</h3>
            <p className="text-sm text-red-700 mb-4">
              Bist du dir sicher? Wir löschen alles – für immer. Das kann nicht rückgängig gemacht werden.
            </p>
          </div>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Konto löschen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Konto wirklich löschen?</span>
                </DialogTitle>
                <DialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, 
                  Bewerbungen und Einstellungen werden für immer gelöscht.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deleteConfirm" className="text-sm font-medium">
                    Gib "LÖSCHEN" ein, um zu bestätigen:
                  </Label>
                  <Input
                    id="deleteConfirm"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="LÖSCHEN"
                    className="mt-2"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "LÖSCHEN" || isLoading}
                >
                  {isLoading ? "Löschen..." : "Ja, ich bin sicher. Löschen."}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Privacy Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900">Datenschutz-Tipps 🔒</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Deine Daten gehören dir – du bestimmst, was passiert</li>
                <li>• Wir verwenden deine Daten nur für bessere Jobvorschläge</li>
                <li>• Du kannst jederzeit alle Einstellungen ändern</li>
                <li>• Bei Fragen zum Datenschutz: support@jobjaeger.de</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 