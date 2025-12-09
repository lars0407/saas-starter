'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AIAssistantProvider } from "@/components/ai-chat/ai-assistant-context"
import AIAssistantWithContext from "@/components/ai-chat/ai-assistant-with-context"
import { CrispChat } from '@/components/crisp-chat';

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
      <CrispChat />
      {/* AIAssistantWithContext kept but not rendered - code preserved */}
    </AIAssistantProvider>
  )
}
