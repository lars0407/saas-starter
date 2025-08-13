"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Kanban,
  User,
} from "lucide-react"
import useSWR from 'swr'
import { useState } from 'react'
import { FeedbackModal } from '@/components/feedback-modal'
import { OnboardingModal } from '@/components/onboarding'
import { Sparkles } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { JobjaegerLogo } from "@/components/jobjaeger-logo"

// Define Xano user type
type XanoUser = {
  name: string;
  email: string;
  profile_image?: string;
  profile_completion_score: number;
  searchprofile_completion_score: number;
  message: boolean;
};

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// This is sample data for teams and navigation.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
        {
          title: "Jobsuche",
          url: "/dashboard/job-search",
          icon: SquareTerminal,
          isActive: true,
        },
    {
      title: "Jobtracker",
      url: "/dashboard",
      icon: Kanban,
    },
    {
      title: "Dokumente",
      url: "/dashboard/documents",
      icon: BookOpen,
      items: [
        {
          title: "Überblick",
          url: "/dashboard/documents",
        },
        {
          title: "Anschreiben",
          url: "/dashboard/documents/cover-letter",
        },
        {
          title: "Lebenslauf",
          url: "/dashboard/documents/resume",
        },
      ],
    },
    {
      title: "KI-Tools",
      url: "/dashboard/coverletter-generate",
      icon: Sparkles,
      items: [
        {
          title: "Anschreiben Generator",
          url: "/dashboard/coverletter-generate",
        },
        {
          title: "Lebenslauf Generator",
          url: "/dashboard/resume-generate",
        },
      ],
    },
    {
      title: "Recherche",
      url: "#",
      icon: Map,
      items: [
        {
          title: "Gehalt",
          url: "https://web.arbeitsagentur.de/entgeltatlas/",
          external: true,
        },
      ],
    },
    {
      title: "Profil",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Passwort",
          url: "/dashboard/settings",
        },
        {
          title: "Benachrichtigungen",
          url: "/dashboard/settings",
        },
        {
          title: "Datenschutz",
          url: "/dashboard/settings",
        },
        {
          title: "Sprache & Region",
          url: "/dashboard/settings",
        },
        {
          title: "KI-Personalisierung",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const { data: user, error } = useSWR<XanoUser>('/api/user', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  // Transform Xano user data to match NavUser component expectations
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.profile_image || "",
  } : {
    name: "Loading...",
    email: "loading@example.com",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <JobjaegerLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      {/* Onboarding Button - Outside SidebarContent */}
      <div className="px-3 py-4 border-t border-gray-200 bg-yellow-50">
        <Button
          onClick={() => {
            console.log('Onboarding button clicked!')
            setOnboardingOpen(true)
          }}
          variant="default"
          className="w-full justify-start gap-2 text-sm bg-[#0F973D] hover:bg-[#0D7A32] text-white font-bold"
        >
          <Sparkles className="h-4 w-4" />
          🚀 Onboarding starten
        </Button>
      </div>
      <SidebarFooter>
        {/* Onboarding Button in Footer */}
        <div className="px-3 py-2 border-b border-gray-200 bg-yellow-50">
          <Button
            onClick={() => {
              console.log('Onboarding button clicked!')
              setOnboardingOpen(true)
            }}
            variant="default"
            className="w-full justify-start gap-2 text-sm bg-[#0F973D] hover:bg-[#0D7A32] text-white font-bold"
          >
            <Sparkles className="h-4 w-4" />
            🚀 Onboarding starten
          </Button>
        </div>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
      
      <FeedbackModal 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen}
        userEmail={user?.email}
      />
      
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
    </Sidebar>
  )
}

