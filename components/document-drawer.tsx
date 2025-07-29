"use client"

import { useState, useEffect } from "react"
import { 
  Download, 
  Edit, 
  Trash2, 
  Calendar,
  Sparkles,
  User,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet"
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

interface DownloadResponse {
  download_link: {
    url: string
    expires_at: string
  }
}

interface DocumentDrawerProps {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function DocumentDrawer({ 
  document, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: DocumentDrawerProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reset loading states when drawer closes
  useEffect(() => {
    if (!open) {
      setIsDeleting(false)
      setIsLoading(false)
    }
  }, [open])

  const handleDownload = async () => {
    if (!document) return

    try {
      setIsLoading(true)
      
      // Use the API client to get the download URL with proper typing
      const data = await apiClient.post<DownloadResponse>('/api:SiRHLF4Y/documents/download', {
        document_id: document.id
      })

      const signedUrl = data?.download_link?.url

      if (!signedUrl) {
        console.error('Download response:', data)
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
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Du musst dich erst anmelden! 🔐")
        } else {
          toast.error("Download fehlgeschlagen 😅")
        }
      } else {
        toast.error("Download fehlgeschlagen 😅")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!document || !onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(document.id)
      toast.success("Dokument erfolgreich gelöscht! 🗑️")
      onOpenChange(false) // Close drawer after deletion
    } catch (error) {
      toast.error("Fehler beim Löschen des Dokuments")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    if (!document || !onEdit) return
    onEdit(document.id)
    onOpenChange(false) // Close drawer when editing
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
    return variant === "ai" ? "KI-generiert" : "selbst gemacht – oldschool ��"
  }

  const getVariantIcon = (variant: string) => {
    return variant === "ai" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  const getTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" />
  }

  if (!document) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl flex flex-col"
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl font-bold">
            Dein Dokument im Detail 🔍
          </SheetTitle>
          
          {/* Document Metadata */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {document.name}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getTypeIcon(document.type)}
                {getTypeLabel(document.type)}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                {getVariantIcon(document.variant)}
                {getVariantLabel(document.variant)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Letztes Update: {formatDate(document.updated_at)}</span>
            </div>
          </div>
        </SheetHeader>

        {/* PDF Preview */}
        <div className="flex-1">
          <PDFViewer
            pdfUrl={document.file_url || document.url}
            showToolbar={false}
            showNavigation={false}
            showBorder={false}
            fallbackMessage="Vorschau nicht verfügbar – aber du kannst's trotzdem runterladen 📄"
            downloadMessage=""
            placeholderMessage="Lade dein Meisterwerk… 🔄"
            className="w-full h-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 