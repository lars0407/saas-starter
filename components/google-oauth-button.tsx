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
  const handleGoogleOAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    
    console.log('Google OAuth button clicked')
    
    // Redirect to our Google OAuth initiation endpoint
    const redirectUri = `${window.location.origin}/google/success`
    const oauthUrl = `/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
    
    console.log('Redirecting to:', oauthUrl)
    window.location.href = oauthUrl
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
