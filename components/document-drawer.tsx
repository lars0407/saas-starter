"use client"

import { useState, useEffect } from "react"
import { 
  Edit, 
  Trash2, 
  Calendar,
  Sparkles,
  User,
  FileText,
  Download
} from "lucide-react"
import { useDocumentDownload } from "@/hooks/use-document-download"
import { toast } from "sonner"

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
  const { downloadDocument, isLoading: isDownloading } = useDocumentDownload()

  // Reset loading states when drawer closes
  useEffect(() => {
    if (!open) {
      setIsDeleting(false)
    }
  }, [open])

  const handleDownload = () => {
    if (!document) return
    downloadDocument(document)
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
            
            <div className="flex flex-wrap items-center justify-between gap-2">
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
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-7 px-2 text-xs hover:text-[#0F973D] hover:bg-[#0F973D]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="h-7 px-2 text-xs hover:text-[#0F973D] hover:bg-[#0F973D]/10"
                >
                  <Download className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
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