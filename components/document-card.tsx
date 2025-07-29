"use client"

import { useState } from "react"
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

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {document.name}
            </CardTitle>
          </div>
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
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {getTypeLabel(document.type)}
          </Badge>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            {getVariantIcon(document.variant)}
            <span>{getVariantLabel(document.variant)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Letztes Update: {formatDate(document.updated_at)}</span>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(document.id)}
            className="flex-1"
          >
            <Eye className="mr-1 h-3 w-3" />
            Ansehen
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit?.(document.id)}
            className="flex-1"
          >
            <Edit className="mr-1 h-3 w-3" />
            Bearbeiten
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 