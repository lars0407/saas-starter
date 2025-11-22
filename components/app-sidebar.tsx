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
  Zap,
  Play,
  Search,
} from "lucide-react"
import useSWR from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FeedbackModal } from '@/components/feedback-modal'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { JobjaegerLogo } from "@/components/jobjaeger-logo"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  navSections: [
    {
      label: "Agent",
      items: [
        {
          title: "Auto Apply (Bald verfügbar)",
          url: "/dashboard/agent",
          icon: Zap,
          disabled: true,
        },
        {
          title: "Jobs",
          url: "/dashboard/job-recommend",
          icon: Search,
        },
        {
          title: "Jobtracker",
          url: "/dashboard",
          icon: Kanban,
        },
      ],
    },
    {
      label: "Plattform",
      items: [
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
          icon: Bot,
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
          items: [
            {
              title: "Überblick",
              url: "/dashboard/profile",
            },
            {
              title: "Suchprofil",
              url: "/dashboard/search-profile",
            },
          ],
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings2,
        },
      ],
    },
  ],
}

function StartApplicationButton() {
  const router = useRouter()
  const { state, isMobile } = useSidebar()

  const handleStartApplication = () => {
    // Check if we're already on the agent-chat page
    if (window.location.pathname === '/dashboard/agent-chat') {
      // Dispatch a custom event to open the form
      window.dispatchEvent(new CustomEvent('openAgentForm'));
    } else {
      // Navigate to agent-chat page
      router.push('/dashboard/agent-chat');
    }
  };

  const button = (
    <SidebarMenuButton
      onClick={handleStartApplication}
      className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white font-semibold data-[active=true]:bg-[#0F973D] data-[active=true]:text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:gap-0 [&>span]:group-data-[collapsible=icon]:hidden"
    >
      <Play />
      <span>Bewerbung starten</span>
    </SidebarMenuButton>
  )

  return (
    <div className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
      {state === "collapsed" && !isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" align="center">
            Bewerbung starten
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const router = useRouter()
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
        <StartApplicationButton />
        <NavMain sections={data.navSections} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
      
      <FeedbackModal 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen}
        userEmail={user?.email}
      />
    </Sidebar>
  )
}

