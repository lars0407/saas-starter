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
import { WelcomeDialog } from '@/components/welcome-dialog'
import { getCurrentUser } from '@/lib/xano'
import { SearchProfileSaveBanner } from '@/components/job-search/search-profile-save-banner'

function JobRecommendContent() {
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isLoadingFromOnboarding, setIsLoadingFromOnboarding] = useState(false);
  const [isLoadingFromSearchProfile, setIsLoadingFromSearchProfile] = useState(false);
  const [showSearchProfileBanner, setShowSearchProfileBanner] = useState(false);
  const [jobsCount, setJobsCount] = useState(0);
  const [newMatchesCount, setNewMatchesCount] = useState(0);
  const searchParams = useSearchParams();

  const redirectToOnboarding = () => {
    if (typeof window === 'undefined') return
    const currentPath = window.location.pathname + window.location.search
    const target = `/onboarding?redirect=${encodeURIComponent(currentPath)}`
    window.location.href = target
  }

  useEffect(() => {
    // Check if onboarding parameter is present
    const onboardingParam = searchParams.get('onboarding');
    if (onboardingParam === 'true') {
      redirectToOnboarding();
    }

    // Check if welcome dialog should be shown (after onboarding completion)
    if (typeof window !== 'undefined') {
      const showWelcomeDialog = localStorage.getItem('onboarding_show_welcome_dialog');
      if (showWelcomeDialog === 'true') {
        setWelcomeDialogOpen(true);
        setIsLoadingFromOnboarding(true);
        // Remove flag so dialog only shows once
        localStorage.removeItem('onboarding_show_welcome_dialog');
      }
      const searchProfileSaved = localStorage.getItem('search_profile_saved');
      if (searchProfileSaved === 'true') {
        setShowSearchProfileBanner(true);
        localStorage.removeItem('search_profile_saved');
      }
      const searchProfileLoading = localStorage.getItem('search_profile_loading');
      if (searchProfileLoading === 'true') {
        setIsLoadingFromSearchProfile(true);
        localStorage.removeItem('search_profile_loading');
      }
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
          redirectToOnboarding();
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
      <div className="flex flex-col h-screen overflow-hidden">
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
                  <BreadcrumbPage>Jobs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 pt-0 pb-0 md:p-4 md:pt-0 md:pb-4 overflow-hidden min-h-0">
          {showSearchProfileBanner && jobsCount === 0 && newMatchesCount === 0 && (
            <SearchProfileSaveBanner
              onClose={() => {
                setShowSearchProfileBanner(false);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('search_profile_saved');
                }
              }}
            />
          )}
          <JobSearchComponent 
            title="Jobs"
            description="Entdecke personalisierte Jobempfehlungen basierend auf deinem Profil"
            hideSearch={true}
            hideCompanyInfo={true}
            isLoadingFromOnboarding={isLoadingFromOnboarding || isLoadingFromSearchProfile}
            onLoadingComplete={() => {
              setIsLoadingFromOnboarding(false);
              setIsLoadingFromSearchProfile(false);
            }}
            onJobsCountChange={(count) => setJobsCount(count)}
            onNewMatchesCountChange={(count) => setNewMatchesCount(count)}
          />
        </div>
      </div>
      
      <WelcomeDialog
        open={welcomeDialogOpen}
        onOpenChange={setWelcomeDialogOpen}
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
