"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <User className="h-6 w-6 text-[#0F973D]" />
          <span>Dein Profil – fresh updaten ✨</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Hier kannst du deine persönlichen Daten anpassen. Alles safe und vertraulich! 🔒
        </p>
      </div>

      {/* Profile Content */}
      <ProfileSettings />
    </div>
  )
} 