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
} from "lucide-react"
import useSWR from 'swr'

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "General",
          url: "/dashboard/general",
        },
        {
          title: "Security",
          url: "/dashboard/security",
        },
        {
          title: "Activity",
          url: "/dashboard/activity",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/general",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/general",
        },
        {
          title: "Security",
          url: "/dashboard/security",
        },
        {
          title: "Activity",
          url: "/dashboard/activity",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Profile Management",
      url: "/dashboard/general",
      icon: Frame,
    },
    {
      name: "Security Settings",
      url: "/dashboard/security",
      icon: PieChart,
    },
    {
      name: "Activity Log",
      url: "/dashboard/activity",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

