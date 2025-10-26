"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  sections,
}: {
  sections: {
    label: string
    items: {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
      disabled?: boolean
      className?: string
      items?: {
        title: string
        url: string
        external?: boolean
      }[]
    }[]
  }[]
}) {
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <SidebarGroup key={`section-${sectionIndex}`}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item, index) => (
              item.items && item.items.length > 0 ? (
                // Render as collapsible dropdown if items exist
                <Collapsible
                  key={`${item.title}-${index}`}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild disabled={item.disabled}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={`${item.title}-${subItem.title}-${subIndex}`}>
                            <SidebarMenuSubButton asChild>
                              <a 
                                href={subItem.url}
                                target={subItem.external ? "_blank" : undefined}
                                rel={subItem.external ? "noopener noreferrer" : undefined}
                              >
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Render as simple link button if no items
                <SidebarMenuItem key={`${item.title}-${index}`}>
                  <SidebarMenuButton 
                    asChild={!item.disabled}
                    tooltip={item.title}
                    className={item.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : item.className || ""}
                    disabled={item.disabled}
                  >
                    {item.disabled ? (
                      <>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </>
                    ) : (
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
