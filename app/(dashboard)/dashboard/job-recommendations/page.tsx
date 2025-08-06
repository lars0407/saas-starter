import { JobRecommendationsComponent } from "@/components/job-search/job-recommendations-component"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function JobRecommendationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
      </div>
      <JobRecommendationsComponent />
    </div>
  )
} 