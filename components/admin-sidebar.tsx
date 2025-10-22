"use client"

import * as React from "react"
import {
  Users,
  Shield,
  Home,
  LogOut,
} from "lucide-react"
import useSWR from 'swr'
import { useState } from 'react'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { usePathname } from 'next/navigation'
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

// Admin navigation sections - will be updated with active state
const getAdminNavSections = (pathname: string) => [
  {
    label: "Admin",
    items: [
      {
        title: "Dashboard",
        url: "/internal/dashboard",
        icon: Home,
        isActive: pathname === "/internal/dashboard",
      },
      {
        title: "User Management",
        url: "/internal/users",
        icon: Users,
        isActive: pathname === "/internal/users",
      },
    ],
  },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
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

  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to sign in
    window.location.href = '/sign-in';
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Shield className="h-6 w-6 text-red-600" />
          <span className="font-bold text-red-600">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={getAdminNavSections(pathname)} />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="space-y-2">
          <NavUser user={userData} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
