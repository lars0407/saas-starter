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


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

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
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(document.id)
      toast.success("Dokument erfolgreich gelöscht! 🗑️")
    } catch (error) {
      toast.error("Fehler beim Löschen des Dokuments 😅")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    const downloadUrl = document.file_url || document.url
    if (!downloadUrl) {
      toast.error("Download nicht verfügbar 📄")
      return
    }

    try {
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `${document.name}.pdf`
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      window.document.body.removeChild(a)
      toast.success("Download gestartet! 📥")
    } catch (error) {
      toast.error("Download fehlgeschlagen 😅")
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
    return variant === "ai" ? "von der AI gebrainstormt" : "selbst gemacht – oldschool 😎"
  }

  const getVariantIcon = (variant: string) => {
    return variant === "ai" ? <Sparkles className="h-3 w-3" /> : <User className="h-3 w-3" />
  }

    // Load PDF preview
  useEffect(() => {
    const loadPdfPreview = async () => {
      const downloadUrl = document.file_url || document.url
      if (!downloadUrl) return

      setIsLoadingPreview(true)
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return
        
        // Check if URL is valid
        if (!downloadUrl || downloadUrl === 'undefined' || downloadUrl === 'null') {
          throw new Error('Invalid PDF URL')
        }

        // Create a simple PDF preview using browser's PDF viewer
        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          canvas.width = 64
          canvas.height = 80
          
          // Create a PDF-like preview
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, 64, 80)
          
          // Header
          ctx.fillStyle = '#f3f4f6'
          ctx.fillRect(0, 0, 64, 16)
          
          // Document name
          ctx.fillStyle = '#374151'
          ctx.font = 'bold 6px Arial'
          ctx.fillText(document.name.substring(0, 8), 4, 8)
          
          // PDF icon
          ctx.fillStyle = '#ef4444'
          ctx.fillRect(4, 20, 8, 10)
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 4px Arial'
          ctx.fillText('PDF', 5, 27)
          
          // Content lines
          ctx.fillStyle = '#6b7280'
          ctx.font = '4px Arial'
          for (let i = 0; i < 3; i++) {
            const y = 35 + (i * 8)
            ctx.fillText(`Content ${i + 1}`, 4, y)
          }
          
          // Footer
          ctx.fillStyle = '#e5e7eb'
          ctx.fillRect(0, 70, 64, 10)
          ctx.fillStyle = '#9ca3af'
          ctx.font = '3px Arial'
          ctx.fillText('PDF', 4, 77)
          
          const dataUrl = canvas.toDataURL()
          setPdfPreview(dataUrl)
        }
      } catch (error) {
        console.log('Error creating PDF preview:', error)
        // Fallback preview
        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 64
          canvas.height = 80
          
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, 64, 80)
          
          // Header
          ctx.fillStyle = '#e5e7eb'
          ctx.fillRect(0, 0, 64, 12)
          
          // Document name
          ctx.fillStyle = '#374151'
          ctx.font = 'bold 6px Arial'
          ctx.fillText(document.name.substring(0, 8), 4, 8)
          
          // Content lines
          ctx.fillStyle = '#9ca3af'
          for (let i = 0; i < 6; i++) {
            const y = 16 + (i * 8)
            const width = Math.random() * 40 + 20
            ctx.fillRect(4, y, width, 2)
          }
          
          // Footer
          ctx.fillStyle = '#e5e7eb'
          ctx.fillRect(0, 70, 64, 10)
          ctx.fillStyle = '#9ca3af'
          ctx.font = '3px Arial'
          ctx.fillText('PDF', 4, 77)
          
          const dataUrl = canvas.toDataURL()
          setPdfPreview(dataUrl)
        }
      } finally {
        setIsLoadingPreview(false)
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadPdfPreview()
    }
  }, [document.file_url, document.url])

  return (
    <Card className="group hover:border-[#0F973D] hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Document Preview on Left */}
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm cursor-pointer" onClick={() => onView?.(document.id)}>
              {typeof window !== 'undefined' && isLoadingPreview ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              ) : typeof window !== 'undefined' && pdfPreview ? (
                <img 
                  src={pdfPreview} 
                  alt="PDF Preview" 
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              ) : (
                <>
                  {/* Fallback document preview */}
                  <div className="h-3 bg-blue-100 border-b border-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Document Info in Middle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {document.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel(document.type)}
              </Badge>
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
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10 group"
              >
                <Eye className="mr-1 h-3 w-3 group-hover:text-[#0F973D]" />
                Ansehen
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit?.(document.id)}
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10 group"
              >
                <Edit className="mr-1 h-3 w-3 group-hover:text-[#0F973D]" />
                Bearbeiten
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload}
                className="h-7 px-2 text-xs justify-start hover:text-[#0F973D] hover:bg-[#0F973D]/10 group"
              >
                <Download className="mr-1 h-3 w-3 group-hover:text-[#0F973D]" />
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