"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocumentDownload } from "@/hooks/use-document-download"

interface Document {
  id: string
  name: string
  type: "resume" | "cover_letter" | "cover letter"
  variant: "human" | "ai"
  updated_at?: string
  file_url?: string
  url?: string
}

interface DocumentDownloadButtonProps {
  document: Document
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

export function DocumentDownloadButton({ 
  document, 
  variant = "outline", 
  size = "default",
  className = "",
  children 
}: DocumentDownloadButtonProps) {
  const { downloadDocument, isLoading } = useDocumentDownload()

  const handleDownload = () => {
    downloadDocument(document)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {children || (isLoading ? "Download..." : "Download")}
    </Button>
  )
} 