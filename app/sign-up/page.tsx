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
                    <Button variant="outline" className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Mit Google registrieren
                    </Button>
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