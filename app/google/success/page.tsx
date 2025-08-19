"use client"

import { Suspense } from "react"
import { JobjaegerLogo } from "@/components/jobjaeger-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function GoogleSuccessContent() {
  const { useSearchParams, useRouter } = require("next/navigation")
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get the values from search params
  const token = searchParams.get('token')
  const error = searchParams.get('error')
  const name = searchParams.get('name')
  const email = searchParams.get('email')

  let status: 'loading' | 'success' | 'error' = 'loading'
  let message = ''

  if (error) {
    status = 'error'
    switch (error) {
      case 'missing_code':
        message = 'OAuth code fehlt. Bitte versuchen Sie es erneut.'
        break
      case 'auth_failed':
        message = 'Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
        break
      case 'oauth_failed':
        message = 'Google OAuth fehlgeschlagen. Bitte versuchen Sie es erneut.'
        break
      default:
        message = 'Ein unbekannter Fehler ist aufgetreten.'
    }
  } else if (token) {
    status = 'success'
    message = `Willkommen ${name || 'zurück'}! Sie werden in Kürze weitergeleitet...`
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard/job-search')
    }, 2000)
  } else {
    status = 'error'
    message = 'Keine Authentifizierungsdaten erhalten.'
  }

  const handleRetry = () => {
    router.push('/sign-in')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard/job-search')
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <JobjaegerLogo />
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            </div>
            <CardTitle className="text-xl">
              {status === 'loading' && 'Authentifizierung läuft...'}
              {status === 'success' && 'Erfolgreich angemeldet!'}
              {status === 'error' && 'Authentifizierung fehlgeschlagen'}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'error' && (
              <div className="flex flex-col gap-3">
                <Button onClick={handleRetry} className="w-full">
                  Erneut versuchen
                </Button>
                <Button variant="outline" onClick={() => router.push('/sign-in')} className="w-full">
                  Zurück zur Anmeldung
                </Button>
              </div>
            )}
            {status === 'success' && (
              <Button onClick={handleGoToDashboard} className="w-full">
                Zum Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex justify-center">
            <JobjaegerLogo />
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <CardTitle className="text-xl">Laden...</CardTitle>
              <CardDescription>
                Authentifizierung wird verarbeitet...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <GoogleSuccessContent />
    </Suspense>
  )
}
