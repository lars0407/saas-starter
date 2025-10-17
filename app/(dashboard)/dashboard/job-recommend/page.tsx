'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { JobSearchComponent } from "@/components/job-search"
import { OnboardingModal } from '@/components/onboarding'
import { getCurrentUser } from '@/lib/xano'

function JobRecommendContent() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if onboarding parameter is present
    const onboardingParam = searchParams.get('onboarding');
    if (onboardingParam === 'true') {
      setOnboardingOpen(true);
      // Clean up the URL by removing the parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('onboarding');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    const checkUserOnboarding = async () => {
      try {
        // Get token from cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.log('No token found');
          return;
        }

        // Get user data
        const user = await getCurrentUser(token);
        
        // Check if onboarding is not completed
        if (user.onboarding && user.onboarding !== 'success') {
          setOnboardingOpen(true);
        }
      } catch (error) {
        console.error('Error checking user onboarding status:', error);
      } finally {
        setUserChecked(true);
      }
    };

    // Only check once when component mounts
    if (!userChecked) {
      checkUserOnboarding();
    }
  }, [userChecked]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Jobempfehlungen</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <JobSearchComponent 
          title="Jobempfehlungen"
          description="Entdecke personalisierte Jobempfehlungen basierend auf deinem Profil"
          hideSearch={true}
        />
      </div>
      
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={(firstName, lastName) => {
          console.log(`Onboarding completed for ${firstName} ${lastName}`)
          setOnboardingOpen(false)
          // Redirect to dashboard after onboarding completion
          window.location.href = '/dashboard'
        }}
        speechText="Hey, cool dich zu sehen! Wie heißt du?"
        characterSrc="/images/characters/Job-Jäger Expressions.png"
        characterAlt="Friendly onboarding character"
      />
    </>
  )
}

export default function JobRecommendPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    }>
      <JobRecommendContent />
    </Suspense>
  )
}
