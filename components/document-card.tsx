"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  Sparkles,
  User
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFViewer } from "@/components/ui/pdf-viewer"

interface Document {
  id: string
  name: string
  type: "resume" | "cover_letter" | "cover letter"
  variant: "human" | "ai"
  updated_at?: string
  file_url?: string
  url?: string
}

interface DocumentCardProps {
  document: Document
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function DocumentCard({ document, onEdit, onDelete, onView }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(document.id)
      toast.success("Dokument erfolgreich gelöscht! 🗑️")
    } catch (error) {
      toast.error("Fehler beim Löschen des Dokuments")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    try {
      // Use the API client to get the download URL
      const data = await apiClient.post('/api:SiRHLF4Y/documents/download', {
        document_id: document.id
      })

      // Fixed: Use correct response structure
      const signedUrl = data?.download_link?.url

      if (!signedUrl) {
        console.error('Download response:', data) // Debug log
        toast.error("Download URL nicht verfügbar 📄")
        return
      }

      // WeWeb approach: Add Azure query parameter to force download dialog
      const downloadUrl = signedUrl + '&rscd=' + encodeURIComponent(`attachment; filename="${document.name}.pdf"`)

      // Open in new tab - browser will download immediately
      window.open(downloadUrl, '_blank')
      toast.success("Download gestartet! 📥")
    } catch (error) {
      console.error('Download error:', error)
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Du musst dich erst anmelden! 🔐")
        } else {
          toast.error("Download fehlgeschlagen 😅")
        }
      } else {
        toast.error("Download fehlgeschlagen 😅")
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unbekannt"
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getTypeLabel = (type: string) => {
    return type === "resume" ? "Lebenslauf" : "Anschreiben"
  }

  const getVariantLabel = (variant: string) => {
    return variant === "ai" ? "von der AI gebrainstormt" : "selbst gemacht – oldschool"
  }

  const getVariantIcon = (variant: string) => {
    return variant === "ai" ? <Sparkles className="h-3 w-3" /> : <User className="h-3 w-3" />
  }

  return (
    <Card className="group hover:border-[#0F973D] hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Document Preview on Left */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Type Badge at bottom center of PDF Viewer */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(document.type)}
                </Badge>
              </div>
              
              <div className="w-32 h-40 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm cursor-pointer" onClick={() => onView?.(document.id)}>
                <PDFViewer
                  pdfUrl={document.file_url || document.url}
                  showToolbar={false}
                  showNavigation={false}
                  showBorder={false}
                  fallbackMessage=""
                  downloadMessage=""
                  placeholderMessage=""
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Document Info in Middle */}
          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {document.name}
              </h3>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
              {getVariantIcon(document.variant)}
              <span>{getVariantLabel(document.variant)}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
              <Calendar className="h-3 w-3" />
              <span>Letztes Update: {formatDate(document.updated_at)}</span>
            </div>

            {/* Actions in 2x2 Grid */}
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView?.(document.id)}
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10"
              >
                <Eye className="mr-1 h-3 w-3" />
                Ansehen
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit?.(document.id)}
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10"
              >
                <Edit className="mr-1 h-3 w-3" />
                Bearbeiten
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload}
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10"
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-7 px-2 text-xs justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                {isDeleting ? "Löschen..." : "Löschen"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 