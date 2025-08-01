"use client"

import { LoginForm } from "@/components/login-form"
import { JobjaegerLogo } from "@/components/jobjaeger-logo"

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <JobjaegerLogo />
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 