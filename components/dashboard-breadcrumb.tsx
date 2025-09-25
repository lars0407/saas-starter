'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Predefined breadcrumb configurations for different pages
export const breadcrumbConfigs = {
  dashboard: [
    { label: "Dashboard" }
  ],
  agent: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Jobjäger Agent" }
  ],
  agentChat: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Jobjäger", href: "/dashboard/agent" },
    { label: "Agent Chat" }
  ],
  jobTracker: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Jobtracker" }
  ],
  documents: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Dokumente" }
  ],
  profile: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profil" }
  ],
  settings: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Einstellungen" }
  ]
};
