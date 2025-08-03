"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Bot,
  ChevronRight
} from "lucide-react"

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const settingsSections = [
  {
    id: "password",
    label: "Passwort",
    description: "Passwort ändern – safety first 🛡️",
    icon: Lock
  },
  {
    id: "notifications",
    label: "Benachrichtigungen",
    description: "Stay up to date 🔔",
    icon: Bell
  },
  {
    id: "privacy",
    label: "Datenschutz",
    description: "Privatsphäre – dein Space, deine Regeln 🕶️",
    icon: Shield
  },
  {
    id: "language",
    label: "Sprache & Region",
    description: "Sprache & Vibes 🌐",
    icon: Globe
  },
  {
    id: "ai",
    label: "KI-Personalisierung",
    description: "KI-Funktionen – smarter suchen 🤖",
    icon: Bot
  }
]

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Einstellungen</h2>
        <p className="text-sm text-gray-600">Mein Zeug einstellen</p>
      </div>

      <nav className="space-y-1">
        {settingsSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <Button
              key={section.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isActive && "bg-[#0F973D]/10 text-[#0F973D] border-[#0F973D]/20"
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-[#0F973D]" : "text-gray-500"
                )} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{section.label}</div>
                  <div className={cn(
                    "text-xs",
                    isActive ? "text-[#0F973D]/80" : "text-gray-500"
                  )}>
                    {section.description}
                  </div>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4",
                  isActive ? "text-[#0F973D]" : "text-gray-400"
                )} />
              </div>
            </Button>
          )
        })}
      </nav>
    </div>
  )
} 