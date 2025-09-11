"use client"

import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { cn } from "@/lib/utils"

interface Document {
  id: number
  created_at: number
  updated_at: number
  type: "resume" | "cover letter"
  preview_link: string
  name: string
  storage_path: string
  variant: "human" | "ai"
  url: string
}

interface DocumentPreviewCardProps {
  document: Document
  onClick?: () => void
}

export function DocumentPreviewCard({ document, onClick }: DocumentPreviewCardProps) {
  const getTypeLabel = (type: string) => {
    return type === "resume" ? "Lebenslauf" : "Anschreiben"
  }

  return (
    <div className="flex flex-col items-center">
      {/* Document Title - positioned above the card */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[128px]">
          {document.name}
        </h3>
      </div>
      
      {/* Card with PDF Preview */}
      <Card 
        className={cn(
          "group hover:border-[#0F973D] hover:shadow-md transition-all duration-200 overflow-hidden border-2 cursor-pointer",
          onClick && "hover:scale-105"
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!onClick) return
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
          }
        }}
      >
        <CardContent className="p-0">
          <div className="relative w-32 h-40">
            {/* Type Badge at bottom center of PDF Viewer */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel(document.type)}
              </Badge>
            </div>
            
            <PDFViewer
              pdfUrl={document.url}
              showToolbar={false}
              showNavigation={false}
              showBorder={false}
              fallbackMessage=""
              downloadMessage=""
              placeholderMessage=""
              className="w-full h-full -mt-6 -mb-6 pointer-events-none"
            />

            {/* Invisible overlay to ensure clicks anywhere are captured */}
            {onClick && (
              <button
                type="button"
                aria-label="Dokument auswählen"
                className="absolute inset-0 bg-transparent"
                onClick={onClick}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
