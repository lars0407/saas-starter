"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocumentDownload } from "@/hooks/use-document-download"

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