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
import { useDocumentDownload } from "@/hooks/use-document-download"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { DocumentDrawer } from "@/components/document-drawer"

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

interface DocumentCardProps {
  document: Document
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onView?: (id: number) => void
  showDelete?: boolean
}

export function DocumentCard({ document, onEdit, onDelete, onView, showDelete = true }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { downloadDocument, isLoading: isDownloading } = useDocumentDownload()

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

  const handleDownload = () => {
    downloadDocument(document)
  }

  const handleView = () => {
    setDrawerOpen(true)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('de-DE', {
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
    <>
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
                
                <div className="w-32 h-40 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm cursor-pointer" onClick={handleView}>
                  <PDFViewer
                    pdfUrl={document.url}
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
                  onClick={handleView}
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
                  disabled={isDownloading}
                  className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10"
                >
                  <Download className="mr-1 h-3 w-3" />
                  {isDownloading ? "Download..." : "Download"}
                </Button>
                {showDelete && (
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
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Detail Drawer */}
      <DocumentDrawer
        document={document}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={onEdit}
        onDelete={showDelete ? onDelete : undefined}
      />
    </>
  )
}

 