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
  const message = searchParams.get('message')
  const name = searchParams.get('name')
  const email = searchParams.get('email')
  const code = searchParams.get('code') // Google OAuth code
  const state = searchParams.get('state') // Google OAuth state

  // Debug: Log all search params
  console.log('Search params:', {
    token,
    error,
    message,
    name,
    email,
    code,
    state,
    allParams: Object.fromEntries(searchParams.entries())
  })

  // Process Google OAuth code - declare before use
  const processGoogleOAuth = async (code: string, state: string | null) => {
    try {
      console.log('Processing Google OAuth code:', code)
      
      // Call Xano API to complete OAuth and get auth token
      const redirectUri = 'https://app.jobjaeger.de/google/success/'
      const apiUrl = `https://api.jobjaeger.de/api:U0aE1wpF/oauth/google/continue?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('OAuth completion response:', data)
      
      if (data.token) {
        // Success - redirect to dashboard
        console.log('OAuth successful, redirecting to dashboard')
        
        // Show success message before redirect
        alert('Google OAuth erfolgreich! Weiterleitung zum Dashboard...')
        
        // Delay redirect to see logs
        setTimeout(() => {
          window.location.href = 'https://app.jobjaeger.de/dashboard/job-search'
        }, 3000)
      } else {
        throw new Error('No token received from OAuth completion')
      }
      
    } catch (error) {
      console.error('Error processing OAuth:', error)
      
      // Show error message before redirect
      alert(`OAuth Fehler: ${error instanceof Error ? error.message : String(error)}`)
      
      // Delay redirect to see logs
      setTimeout(() => {
        window.location.href = `/google/success?error=oauth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : String(error))}`
      }, 3000)
    }
  }

  // Determine status and message
  let status: 'loading' | 'success' | 'error'
  let displayMessage = ''

  console.log('Determining status...')

  if (code) {
    console.log('Status: CODE RECEIVED - Processing OAuth')
    // Google OAuth code received - process it
    status = 'loading'
    displayMessage = 'Google OAuth wird verarbeitet...'
    
    // Process the OAuth code
    processGoogleOAuth(code, state)
  } else if (token) {
    console.log('Status: TOKEN RECEIVED - Success')
    status = 'success'
    displayMessage = `Willkommen ${name || 'zurück'}! Sie werden in Kürze weitergeleitet...`
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard/job-search')
    }, 2000)
  } else {
    console.log('Status: DEFAULT - Loading')
    // Default to loading state if no token and no error
    status = 'loading'
    displayMessage = 'Authentifizierung wird verarbeitet...'
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
            </div>
            <CardTitle className="text-xl">
              {status === 'loading' && 'Authentifizierung läuft...'}
              {status === 'success' && 'Erfolgreich angemeldet!'}
            </CardTitle>
            <CardDescription>
              {displayMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
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
