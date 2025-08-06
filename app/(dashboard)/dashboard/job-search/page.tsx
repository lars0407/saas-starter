'use client';

import { useState, useEffect } from 'react';
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

export default function JobSearchPage() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
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
                <BreadcrumbPage>Jobsuche</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <JobSearchComponent />
      </div>
      
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={(firstName, lastName) => {
          console.log(`Onboarding completed for ${firstName} ${lastName}`)
          setOnboardingOpen(false)
        }}
        speechText="Hey, cool dich zu sehen! Wie heißt du?"
        characterSrc="/images/characters/Job-Jäger Expressions.png"
        characterAlt="Friendly onboarding character"
      />
    </>
  )
} 