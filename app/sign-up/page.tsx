"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUpWithXano } from "@/lib/xano"
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
import { GoogleOAuthButton } from "@/components/google-oauth-button"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { authToken } = await signUpWithXano("", email, password)
      document.cookie = `token=${authToken}; path=/; max-age=86400; secure; samesite=strict`
      // Redirect to verification page with email parameter
      router.push(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrierung fehlgeschlagen")
    } finally {
      setLoading(false)
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
              <CardTitle className="text-xl">Konto erstellen</CardTitle>
              <CardDescription>
                Melde dich mit deinem Apple- oder Google-Konto an
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <GoogleOAuthButton variant="signup" />
                  </div>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Oder weiter mit
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50 focus-visible:ring-[3px]"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Passwort</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Mindestens 8 Zeichen"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50 focus-visible:ring-[3px]"
                        required
                        minLength={8}
                      />
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white" disabled={loading}>
                      {loading ? "Registrieren..." : "Registrieren"}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Bereits ein Konto?{" "}
                    <Link href="/sign-in" className="underline underline-offset-4">
                      Anmelden
                    </Link>
                  </div>
                </div>
              </form>
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