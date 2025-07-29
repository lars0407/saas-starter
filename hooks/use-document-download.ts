import { useState } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface DownloadResponse {
  download_link: {
    url: string
    expires_at: string
  }
}

interface Document {
  id: string
  name: string
  type: "resume" | "cover_letter" | "cover letter"
  variant: "human" | "ai"
  updated_at?: string
  file_url?: string
  url?: string
}

export function useDocumentDownload() {
  const [isLoading, setIsLoading] = useState(false)

  const downloadDocument = async (document: Document) => {
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

  return {
    downloadDocument,
    isLoading
  }
} 