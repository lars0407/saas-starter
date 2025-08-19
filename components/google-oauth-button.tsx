"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GoogleOAuthButtonProps {
  variant?: "login" | "signup"
  className?: string
  disabled?: boolean
}

export function GoogleOAuthButton({ 
  variant = "login", 
  className,
  disabled = false 
}: GoogleOAuthButtonProps) {
  const handleGoogleOAuth = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    
    console.log('Google OAuth button clicked')
    
    try {
      // Use the correct redirect URI based on environment
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const redirectUri = isLocalhost 
        ? `${window.location.origin}/google/success`
        : 'https://app.jobjaeger.de/google/success/'
      
      console.log('Using redirect_uri:', redirectUri)
      
      // Call Xano API with redirect_uri as query parameter
      const apiUrl = `https://api.jobjaeger.de/api:U0aE1wpF/oauth/google/init?redirect_uri=${encodeURIComponent(redirectUri)}`
      
      console.log('Calling Xano API:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Parse JSON response
      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log('Parsed response:', responseData)
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`)
      }
      
      // Look for OAuth URL in response
      console.log('Searching for OAuth URL in response...')
      console.log('Response data keys:', Object.keys(responseData))
      console.log('Response data values:', responseData)
      
      const oauthUrl = responseData.authUrl || responseData.url || responseData.oauth_url || responseData.google_url || responseData.redirect_url || responseData.auth_url
      
      console.log('Found OAuth URL:', oauthUrl)
      
      if (oauthUrl) {
        console.log('Found OAuth URL, redirecting to:', oauthUrl)
        console.log('Current window.location:', window.location.href)
        
        // Force redirect to Google OAuth URL
        console.log('Initiating redirect...')
        
        // Try immediate redirect first
        try {
          console.log('Attempting immediate redirect...')
          
          // Method 1: Force redirect with timeout
          setTimeout(() => {
            console.log('Executing redirect after timeout...')
            window.location.href = oauthUrl
          }, 100)
          
          // Method 2: Also try window.open as backup
          setTimeout(() => {
            console.log('Trying window.open as backup...')
            const newWindow = window.open(oauthUrl, '_self')
            if (!newWindow) {
              console.error('window.open failed, trying location.replace...')
              window.location.replace(oauthUrl)
            }
          }, 200)
          
          console.log('Redirect methods scheduled')
          
        } catch (error) {
          console.error('Redirect error:', error)
          
          // Fallback: show manual redirect option
          const shouldRedirect = window.confirm(
            `Google OAuth URL gefunden: ${oauthUrl}\n\nMöchten Sie zu Google weitergeleitet werden?`
          )
          
          if (shouldRedirect) {
            window.location.href = oauthUrl
          } else {
            // Show the URL for manual navigation
            alert(`Bitte navigieren Sie manuell zu:\n${oauthUrl}`)
          }
        }
      } else {
        console.error('No OAuth URL found in response')
        console.log('Available response fields:', Object.keys(responseData))
        console.log('Full response data:', responseData)
        throw new Error(`No OAuth URL found. Response: ${JSON.stringify(responseData)}`)
      }
      
    } catch (error) {
      console.error('Error calling Xano API:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      window.location.href = `/google/success?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`
    }
  }

  const buttonText = variant === "login" ? "Mit Google anmelden" : "Mit Google registrieren"

  return (
    <Button 
      variant="outline" 
      className={cn("w-full", className)} 
      onClick={handleGoogleOAuth}
      disabled={disabled}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      {buttonText}
    </Button>
  )
}
