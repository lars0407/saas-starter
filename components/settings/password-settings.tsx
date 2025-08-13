"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Lock, Eye, EyeOff, Save, Shield } from "lucide-react"

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    }
  }

  const passwordValidation = validatePassword(newPassword)
  const passwordsMatch = newPassword === confirmPassword && newPassword !== ""
  const canSave = currentPassword !== "" && passwordValidation.isValid && passwordsMatch

  const handleSave = async () => {
    if (!canSave) return

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

      const response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/profile/passwort/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_passwort: currentPassword,
          new_passwort: newPassword,
          new_passwort_confirmation: confirmPassword
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Fehler beim Aktualisieren des Passworts")
      }

      const data = await response.json()
      
      toast.success(data.message || "Dein Passwort wurde erfolgreich aktualisiert! ✅")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast.error(error.message || "Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Password Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Passwort ändern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Dein aktuelles Passwort"
                className="border-gray-300 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:outline-none pr-10"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Neues Passwort</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dein neues Passwort"
                className="border-gray-300 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:outline-none pr-10"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Nochmal neues Passwort</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Bestätige dein neues Passwort"
                className="border-gray-300 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:outline-none pr-10"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {newPassword !== "" && !passwordsMatch && (
              <p className="text-sm text-red-600">Uff, die Passwörter matchen nicht.</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {newPassword !== "" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Passwort-Stärke</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", passwordValidation.minLength ? "bg-green-500" : "bg-gray-300")}></div>
                  <span className="text-sm">Mindestens 8 Zeichen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasUpperCase ? "bg-green-500" : "bg-gray-300")}></div>
                  <span className="text-sm">Großbuchstabe (A-Z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasLowerCase ? "bg-green-500" : "bg-gray-300")}></div>
                  <span className="text-sm">Kleinbuchstabe (a-z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasNumbers ? "bg-green-500" : "bg-gray-300")}></div>
                  <span className="text-sm">Zahl (0-9)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasSpecialChar ? "bg-green-500" : "bg-gray-300")}></div>
                  <span className="text-sm">Sonderzeichen (!@#$%^&*)</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={!canSave || isLoading}
              className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Speichern..." : "Neues Passwort setzen"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-900">Sicherheits-Tipps 🔒</h3>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Verwende ein einzigartiges Passwort für jeden Account</li>
                <li>• Teile dein Passwort niemals mit anderen</li>
                <li>• Ändere dein Passwort regelmäßig</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 