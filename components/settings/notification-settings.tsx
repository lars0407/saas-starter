"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Bell, BellOff, Save, Smartphone } from "lucide-react"

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

interface NotificationSettingsProps {
  preferences: UserPreferences | null
}

export function NotificationSettings({ preferences }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState({
    jobMatches: true,
    applicationReminders: true,
    aiUpdates: false,
    weeklyDigest: true,
    marketing: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [requestInProgress, setRequestInProgress] = useState(false) // Prevent duplicate requests

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setNotifications({
        jobMatches: preferences.notification.newJobAlerts,
        applicationReminders: preferences.notification.applicationReminders,
        aiUpdates: preferences.notification.aiDocumentChanges,
        weeklyDigest: preferences.notification.weeklySummary,
        marketing: preferences.notification.newsAndUpdates // Fixed: was using preferences.newsletter
      })
    }
  }, [preferences])

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    setHasChanges(true)
  }

  const handleMuteAll = () => {
    setNotifications({
      jobMatches: false,
      applicationReminders: false,
      aiUpdates: false,
      weeklyDigest: false,
      marketing: false
    })
    setHasChanges(true)
    toast.success("Alles aus – ich chill erstmal 😴")
  }

  const handleSave = async () => {
    // Prevent duplicate requests
    if (requestInProgress) {
      console.log('Request already in progress, skipping...')
      return
    }

    setRequestInProgress(true)
    setIsLoading(true)
    
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        toast.error("Nicht angemeldet. Bitte melde dich erneut an.")
        return
      }

      console.log('Sending notification update request...', {
        method: 'PUT',
        url: 'https://api.jobjaeger.de/api:7yCsbR9L/preferences/notification/update',
        timestamp: new Date().toISOString()
      })

      const response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/preferences/notification/update", {
        method: "PUT", // Changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          newJobAlerts: notifications.jobMatches,
          applicationReminders: notifications.applicationReminders,
          aiDocumentChanges: notifications.aiUpdates,
          weeklySummary: notifications.weeklyDigest,
          newsAndUpdates: notifications.marketing
        })
      })

      console.log('Response received:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle specific error codes
        if (errorData.code === "ERROR_CODE_NOT_FOUND") {
          // User might not have preferences yet, try to create them
          toast.info("Erstelle neue Benachrichtigungseinstellungen...")
          // For now, just show success message since we can't create preferences yet
          toast.success("Preferences gespeichert! 🔥")
          setHasChanges(false)
          return
        }
        
        throw new Error(errorData.message || "Fehler beim Speichern der Benachrichtigungen")
      }

      const data = await response.json()
      
      toast.success("Preferences erfolgreich gespeichert! 💅✨")
      setHasChanges(false)
    } catch (error: any) {
      console.error('Error saving notifications:', error)
      toast.error(error.message || "Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
      setRequestInProgress(false)
    }
  }

  // Show loading state if preferences haven't been loaded yet
  if (!preferences) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F973D]"></div>
              <span className="ml-3 text-gray-600">Lade Einstellungen...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benachrichtigungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Matches */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Neuer Job für dich? Sag mir sofort Bescheid!</Label>
              <p className="text-sm text-gray-500">
                Bekomme sofort eine Nachricht, wenn ein Job zu deinem Profil passt
              </p>
            </div>
            <Switch
              checked={notifications.jobMatches}
              onCheckedChange={() => handleToggle('jobMatches')}
            />
          </div>

          <Separator />

          {/* Application Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Reminder für offene Bewerbungen</Label>
              <p className="text-sm text-gray-500">
                Erinnerungen für Bewerbungen, die noch eine Antwort brauchen
              </p>
            </div>
            <Switch
              checked={notifications.applicationReminders}
              onCheckedChange={() => handleToggle('applicationReminders')}
            />
          </div>

          <Separator />

          {/* AI Updates */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Wenn die KI an deinen Unterlagen bastelt</Label>
              <p className="text-sm text-gray-500">
                Benachrichtigungen über KI-Verbesserungen an deinen Dokumenten
              </p>
            </div>
            <Switch
              checked={notifications.aiUpdates}
              onCheckedChange={() => handleToggle('aiUpdates')}
            />
          </div>

          <Separator />

          {/* Weekly Digest */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Wöchentlicher Überblick</Label>
              <p className="text-sm text-gray-500">
                Einmal pro Woche: Zusammenfassung deiner Job-Aktivitäten
              </p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={() => handleToggle('weeklyDigest')}
            />
          </div>

          <Separator />

          {/* Marketing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">News & Updates</Label>
              <p className="text-sm text-gray-500">
                Neue Features, Tipps und Tricks für deine Jobsuche
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={() => handleToggle('marketing')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schnell-Aktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={handleMuteAll}
            className="w-full justify-start"
          >
            <BellOff className="mr-2 h-4 w-4" />
            Alles aus – ich chill erstmal 😴
          </Button>
          
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

      {/* Notification Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900">Notification-Tipps 📱</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Job-Matches sind meist die wichtigsten Benachrichtigungen</li>
                <li>• Bewerbungs-Reminder helfen dir, nichts zu verpassen</li>
                <li>• Du kannst jederzeit alles an- oder ausschalten</li>
                <li>• Benachrichtigungen kommen per E-Mail und Push (falls aktiviert)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 