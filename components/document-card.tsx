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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
        
        // Create a simple canvas-based preview without fetching the PDF
        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 64
          canvas.height = 80
          
          // Create a simple PDF-like preview
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, 64, 80)
          
          // Header
          ctx.fillStyle = '#e5e7eb'
          ctx.fillRect(0, 0, 64, 12)
          
          // Text lines
          ctx.fillStyle = '#9ca3af'
          for (let i = 0; i < 6; i++) {
            const y = 16 + (i * 8)
            const width = Math.random() * 40 + 20
            ctx.fillRect(4, y, width, 2)
          }
          
          const dataUrl = canvas.toDataURL()
          setPdfPreview(dataUrl)
        }
      } catch (error) {
        console.error('Error creating PDF preview:', error)
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
            <div className="w-16 h-20 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              {typeof window !== 'undefined' && isLoadingPreview ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              ) : typeof window !== 'undefined' && pdfPreview ? (
                <img 
                  src={pdfPreview} 
                  alt="PDF Preview" 
                  className="w-full h-full object-cover"
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
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Letztes Update: {formatDate(document.updated_at)}</span>
            </div>
          </div>

          {/* Actions on Right */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="sr-only">Mehr Optionen</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(document.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ansehen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(document.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Bearbeiten
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Löschen..." : "Löschen"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 