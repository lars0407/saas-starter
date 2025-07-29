"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Save } from "lucide-react"

export function ProfileSettings() {
  const [firstName, setFirstName] = useState("Max")
  const [lastName, setLastName] = useState("Mustermann")
  const [email, setEmail] = useState("max@example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Profil wurde aktualisiert. Sieht gut aus! 💅")
      setHasChanges(false)
    } catch (error) {
      toast.error("Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setHasChanges(true)
    
    switch (field) {
      case "firstName":
        setFirstName(value)
        break
      case "lastName":
        setLastName(value)
        break
      case "email":
        setEmail(value)
        break
    }
  }

  return (
    <div className="space-y-6">

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Persönliche Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Dein Vorname</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Dein Vorname"
                className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Dein Nachname</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Dein Nachname"
                className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Deine E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="deine.email@example.com"
              className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
            />
            <p className="text-xs text-gray-500">
              Diese E-Mail wird für wichtige Updates und Sicherheitsbenachrichtigungen verwendet.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Speichern..." : "Speichern & weiter geht's"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-blue-900">Profil-Tipp 💡</h3>
              <p className="text-sm text-blue-700 mt-1">
                Ein vollständiges Profil hilft der KI dabei, dir bessere Jobvorschläge zu machen. 
                Je mehr Infos, desto smarter die Empfehlungen!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 