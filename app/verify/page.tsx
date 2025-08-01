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
import { JobjaegerLogo } from "@/components/jobjaeger-logo"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call for verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any 6-character code
      if (verificationCode.length === 6) {
        router.push("/dashboard")
      } else {
        setError("Bitte geben Sie einen 6-stelligen Code ein")
      }
    } catch (err: any) {
      setError("Verifikation fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setVerificationCode(value)
    setError("")
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
                Wir haben einen 6-stelligen Code an Ihre E-Mail gesendet
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
                <Button variant="outline" className="w-full">
                  Code erneut senden
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