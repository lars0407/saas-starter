'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AIAssistantProvider } from "@/components/ai-assistant-context"
import AIAssistantWithContext from "@/components/ai-assistant-with-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AIAssistantProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
      <AIAssistantWithContext />
    </AIAssistantProvider>
  )
}
