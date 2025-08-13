"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordSettings } from "@/components/settings/password-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { LanguageSettings } from "@/components/settings/language-settings"
import { AiSettings } from "@/components/settings/ai-settings"
import { Lock, Bell, Shield, Globe, Bot } from "lucide-react"

type SettingsSection = "password" | "notifications" | "privacy" | "language" | "ai"

interface UserPreferences {
  job_offers: boolean
  newsletter: boolean
  call: boolean
  whatsapp: boolean
  profile_public: boolean
  notification: {
    newJobAlerts: boolean
    applicationReminders: boolean
    aiDocumentChanges: boolean
    weeklySummary: boolean
    newsAndUpdates: boolean
  }
}

const settingsTabs = [
  {
    id: "password" as SettingsSection,
    label: "Passwort",
    icon: Lock,
    headerTitle: "Passwort ändern – safety first 🛡️",
    headerDescription: "Hier kannst du dein Passwort sicher ändern. Besser safe als sorry! 🔐"
  },
  {
    id: "notifications" as SettingsSection,
    label: "Benachrichtigungen",
    icon: Bell,
    headerTitle: "Stay up to date 🔔",
    headerDescription: "Hier bestimmst du, wann und wie du benachrichtigt wirst. Deine Regeln! 📱"
  },
  {
    id: "privacy" as SettingsSection,
    label: "Datenschutz",
    icon: Shield,
    headerTitle: "Privatsphäre – dein Space, deine Regeln 🕶️",
    headerDescription: "Hier bestimmst du, was andere sehen können und wie deine Daten verwendet werden."
  },
  {
    id: "language" as SettingsSection,
    label: "Sprache & Region",
    icon: Globe,
    headerTitle: "Sprache & Vibes 🌐",
    headerDescription: "Hier bestimmst du, wie Jobjäger für dich aussieht und funktioniert."
  },
  {
    id: "ai" as SettingsSection,
    label: "KI-Personalisierung",
    icon: Bot,
    headerTitle: "KI-Funktionen – smarter suchen 🤖",
    headerDescription: "Hier bestimmst du, wie die KI dir bei deiner Jobsuche hilft. Je mehr du erlaubst, desto besser die Vorschläge!"
  }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("password")
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user preferences when component mounts
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Get auth token from cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        if (!token) {
          console.log('No auth token found, skipping preferences load')
          setLoading(false)
          return
        }

        const response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/preferences", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          
          // Handle specific error codes
          if (errorData.code === "ERROR_CODE_NOT_FOUND") {
            // User doesn't have preferences yet, create default ones
            console.log('User has no preferences yet, using defaults')
            setPreferences({
              job_offers: true,
              newsletter: true,
              call: true,
              whatsapp: true,
              profile_public: true, // Added profile_public to defaults
              notification: {
                newJobAlerts: true,
                applicationReminders: true,
                aiDocumentChanges: false,
                weeklySummary: true,
                newsAndUpdates: false
              }
            })
            setLoading(false)
            return
          }
          
          throw new Error(errorData.message || "Fehler beim Laden der Präferenzen")
        }

        const data = await response.json()
        if (data && data.length > 0) {
          setPreferences(data[0])
        } else {
          // No preferences found, use defaults
          setPreferences({
            job_offers: true,
            newsletter: true,
            call: true,
            whatsapp: true,
            profile_public: true, // Added profile_public to defaults
            notification: {
              newJobAlerts: true,
              applicationReminders: true,
              aiDocumentChanges: false,
              weeklySummary: true,
              newsAndUpdates: false
            }
          })
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
        // Use default preferences on error
        setPreferences({
          job_offers: true,
          newsletter: true,
          call: true,
          whatsapp: true,
          profile_public: true, // Added profile_public to defaults
          notification: {
            newJobAlerts: true,
            applicationReminders: true,
            aiDocumentChanges: false,
            weeklySummary: true,
            newsAndUpdates: false
          }
        })
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  // Handle hash fragment to set active tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['password', 'notifications', 'privacy', 'language', 'ai'].includes(hash)) {
        setActiveSection(hash as SettingsSection)
      }
    }
  }, [])

  const currentTab = settingsTabs.find(tab => tab.id === activeSection) || settingsTabs[0]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Einstellungen</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <currentTab.icon className="h-6 w-6 text-[#0F973D]" />
          <span>{currentTab.headerTitle}</span>
        </h1>
        <p className="text-gray-600 mt-2">
          {currentTab.headerDescription}
        </p>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as SettingsSection)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings preferences={preferences} />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings preferences={preferences} />
        </TabsContent>
        
        <TabsContent value="language">
          <LanguageSettings />
        </TabsContent>
        
        <TabsContent value="ai">
          <AiSettings preferences={preferences} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 