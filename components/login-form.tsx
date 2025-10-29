"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginWithXano } from "@/lib/xano"
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
import { GoogleOAuthButton } from "@/components/google-oauth-button"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Bitte fülle alle Felder aus')
      return
    }
    
    setLoading(true)
    setError("")

    try {
      const response = await loginWithXano(email, password)
      const { authToken } = response
      document.cookie = `token=${authToken}; path=/; max-age=86400; secure; samesite=strict`
      
      // Redirect to job recommendations
      router.push("/dashboard/job-recommend")
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || "Login fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Willkommen zurück</CardTitle>
          <CardDescription>
            Melde dich mit deinem Google-Konto an oder verwende E-Mail und Passwort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* Email/Password Form - First and primary */}
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Passwort</Label>
                    <a
                      href="/reset-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Passwort vergessen?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus-visible:border-[#0F973D] focus-visible:ring-[#0F973D]/50 focus-visible:ring-[3px]"
                    required 
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white" 
                  disabled={loading}
                >
                  {loading ? "Anmelden..." : "Einloggen"}
                </Button>
              </div>
              
              {/* Separator */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Oder weiter mit
                </span>
              </div>
              
              {/* Google OAuth Button - Secondary option */}
              <div className="flex flex-col gap-4">
                <GoogleOAuthButton variant="login" />
              </div>
              
              <div className="text-center text-sm">
                Noch kein Konto?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Registrieren
                </a>
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
  )
}
