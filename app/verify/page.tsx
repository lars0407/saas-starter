"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmail, resendVerificationCode } from "@/lib/xano"
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
import { JobjaegerLogo } from "@/components/jobjaeger-logo"

function VerifyForm() {
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!email) {
        setError("E-Mail-Adresse nicht gefunden. Bitte registrieren Sie sich erneut.")
        return
      }

      // Convert verification code to number
      const code = parseInt(verificationCode)
      if (isNaN(code)) {
        setError("Bitte geben Sie einen gültigen 6-stelligen Code ein")
        return
      }

      // Call Xano API for verification
      await verifyEmail(email, code)
      
      // Show success message before redirecting
      setSuccess("Account erfolgreich bestätigt! Sie werden zur Anmeldung weitergeleitet...")
      
      // If verification successful, redirect to login after a short delay
      setTimeout(() => {
        router.push("/sign-in")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Verifikation fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setVerificationCode(value)
    setError("")
  }

  const handleResendCode = async () => {
    if (!email) {
      setError("E-Mail-Adresse nicht gefunden. Bitte registrieren Sie sich erneut.")
      return
    }

    setResendLoading(true)
    setError("")
    setSuccess("")

    try {
      await resendVerificationCode(email)
      setSuccess("Neuer Code wurde an Ihre E-Mail gesendet.")
    } catch (err: any) {
      setError(err.response?.data?.message || "Fehler beim Senden des Codes. Bitte versuchen Sie es erneut.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <JobjaegerLogo />
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Account bestätigen</CardTitle>
              <CardDescription>
                {email ? (
                  <>
                    Wir haben einen 6-stelligen Code an <strong>{email}</strong> gesendet
                  </>
                ) : (
                  "Wir haben einen 6-stelligen Code an Ihre E-Mail gesendet"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="verificationCode">Verifikationscode</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={handleCodeChange}
                      className="focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50 focus-visible:ring-[3px] text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Geben Sie den 6-stelligen Code aus Ihrer E-Mail ein
                    </p>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600 text-sm text-center">{success}</p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white" 
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? "Bestätigen..." : "Account bestätigen"}
                  </Button>
                </div>
              </form>
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground mb-2">Keine E-Mail erhalten?</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Code wird gesendet..." : "Code erneut senden"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
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

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex justify-center">
            <JobjaegerLogo />
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-muted-foreground">Laden...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
} 