"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any valid email
      if (email && email.includes('@')) {
        setSuccess(true)
      } else {
        setError("Bitte geben Sie eine gültige E-Mail-Adresse ein")
      }
    } catch (err: any) {
      setError("Passwort-Reset fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError("")
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <img 
              src="/images/branding/Logo.png" 
              alt="JobJäger Logo" 
              className="h-8 w-auto"
            />
          </a>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">E-Mail gesendet</CardTitle>
                <CardDescription>
                  Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm text-center">
                      Überprüfen Sie Ihre E-Mail und klicken Sie auf den Link, um Ihr Passwort zurückzusetzen.
                    </p>
                  </div>
                  <div className="text-center text-sm">
                    <p className="text-muted-foreground mb-2">Keine E-Mail erhalten?</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSuccess(false)}
                    >
                      Erneut versuchen
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    <Link href="/sign-in" className="underline underline-offset-4">
                      Zurück zur Anmeldung
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              Mit dem Fortfahren stimmst du unseren{" "}
              <a href="#">Nutzungsbedingungen</a> und{" "}
              <a href="#">Datenschutzrichtlinien</a> zu.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img 
            src="/images/branding/Logo.png" 
            alt="JobJäger Logo" 
            className="h-8 w-auto"
          />
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Passwort zurücksetzen</CardTitle>
              <CardDescription>
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      className="focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50 focus-visible:ring-[3px]"
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Wir senden Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts
                    </p>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white" 
                    disabled={loading || !email}
                  >
                    {loading ? "Senden..." : "Link senden"}
                  </Button>
                </div>
              </form>
              <div className="mt-6 text-center text-sm">
                <Link href="/sign-in" className="underline underline-offset-4">
                  Zurück zur Anmeldung
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Mit dem Fortfahren stimmst du unseren{" "}
            <a href="#">Nutzungsbedingungen</a> und{" "}
            <a href="#">Datenschutzrichtlinien</a> zu.
          </div>
        </div>
      </div>
    </div>
  )
} 