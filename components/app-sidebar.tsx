"use client"

import * as React from "react"
import {
  Home,
  User,
  Settings,
  Activity,
  Bell,
  Search,
  Plus,
  Calendar,
  TrendingUp,
  CreditCard,
  Shield,
  LogOut,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation data for the SaaS application
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Account",
      url: "/dashboard/general",
      icon: User,
      items: [
        {
          title: "Profile",
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
      title: "Projects",
      url: "/dashboard/projects",
      icon: TrendingUp,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects",
        },
        {
          title: "Create New",
          url: "/dashboard/projects/new",
        },
        {
          title: "Templates",
          url: "/dashboard/projects/templates",
        },
      ],
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
      items: [
        {
          title: "Events",
          url: "/dashboard/calendar",
        },
        {
          title: "Schedule",
          url: "/dashboard/calendar/schedule",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border bg-background font-semibold">
            S
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SaaS Starter</span>
            <span className="truncate text-xs">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
