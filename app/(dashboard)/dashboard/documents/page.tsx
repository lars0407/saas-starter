"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Sparkles, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"
import { DocumentCard } from "@/components/document-card"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { EmptyState } from "@/components/empty-state"

interface Document {
  id: string
  name: string
  type: "resume" | "cover_letter" | "cover letter"
  variant: "human" | "ai"
  updated_at?: string
  file_url?: string
  url?: string
}

interface DocumentsResponse {
  result?: Document[]
  documents?: Document[]
  data?: Document[]
  items?: Document[]
  document?: {
    itemsReceived: number
    offset: number
    itemsTotal: number
  }
  total?: number
  count?: number
  offset?: number
  limit?: number
}

const ITEMS_PER_PAGE = 6

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("human")
  const [totalDocuments, setTotalDocuments] = useState(0)

  const fetchDocuments = async (variant: string, page: number) => {
    setLoading(true)
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents?offset=${offset}&variant=${variant}`,
        {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`)
      }

      const data: DocumentsResponse = await response.json()
      console.log("Documents API response:", data) // Debug log
      
      // Ensure we have valid data
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format")
      }
      
      // Handle different possible response structures
      const documents = data.result || data.documents || data.data || data.items || []
      const total = data.document?.itemsTotal || data.total || data.count || documents.length
      
      // Ensure documents is always an array
      const documentsArray = Array.isArray(documents) ? documents : []
      
      console.log("Processed documents:", documentsArray)
      console.log("Total count:", total)
      console.log("Documents type:", typeof documents)
      console.log("Is array:", Array.isArray(documents))
      
      setDocuments(documentsArray)
      setTotalDocuments(total)
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Fehler beim Laden der Dokumente 😅")
      setDocuments([])
      setTotalDocuments(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments(activeTab, currentPage)
  }, [activeTab, currentPage])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents/${id}`,
        {
          method: "DELETE",
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      // Refresh the current page
      fetchDocuments(activeTab, currentPage)
    } catch (error) {
      console.error("Error deleting document:", error)
      throw error
    }
  }

  const handleView = (id: string) => {
    // Find the document by ID
    const document = documents.find(doc => doc.id === id)
    if (!document) {
      toast.error("Dokument nicht gefunden 😅")
      return
    }

    const downloadUrl = document.file_url || document.url
    if (!downloadUrl) {
      toast.error("PDF URL nicht verfügbar 📄")
      return
    }

    // Open PDF in browser's PDF viewer
    window.open(downloadUrl, '_blank')
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    toast.info("Bearbeiten-Funktion wird implementiert ✏️")
  }

  const handleCreateResume = () => {
    // TODO: Implement create resume functionality
    toast.info("Lebenslauf erstellen wird implementiert 📝")
  }

  const handleCreateCoverLetter = () => {
    // TODO: Implement create cover letter functionality
    toast.info("Anschreiben generieren wird implementiert ✨")
  }

  const renderSkeletons = () => {
    return Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
      <DocumentSkeleton key={index} />
    ))
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(currentPage - 1)}
              className={cn(
                "gap-1 px-2.5 sm:pl-2.5 cursor-pointer",
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              )}
              size="default"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:block">Zurück</span>
            </PaginationLink>
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(currentPage + 1)}
              className={cn(
                "gap-1 px-2.5 sm:pr-2.5 cursor-pointer",
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              )}
              size="default"
            >
              <span className="hidden sm:block">Weiter</span>
              <ChevronRightIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dokumente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Deine Docs – always ready für Bewerbungs-Action 🚀
              </h1>
              <p className="text-gray-600 mt-2">
                Verwalte hier alle deine Lebensläufe & Anschreiben. Wähle zwischen Basis-Dokumenten und KI-generierten Inhalten.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleCreateResume}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Lebenslauf erstellen
              </Button>
              <Button 
                variant="outline"
                onClick={handleCreateCoverLetter}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Anschreiben generieren
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="human">Basis (Lebenslauf & Anschreiben)</TabsTrigger>
            <TabsTrigger value="ai">KI-generiert (Lebenslauf & Anschreiben)</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderSkeletons()}
              </div>
                         ) : !documents || documents.length === 0 ? (
              <div className="flex items-center justify-center h-[calc(100vh-300px)] w-full">
                <EmptyState 
                  onCreateResume={handleCreateResume}
                  onCreateCoverLetter={handleCreateCoverLetter}
                />
              </div>
            ) : (
              <>
                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                   {Array.isArray(documents) && documents.map((document) => (
                     <DocumentCard
                       key={document.id}
                       document={document}
                       onView={handleView}
                       onEdit={handleEdit}
                       onDelete={handleDelete}
                     />
                   ))}
                 </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {totalDocuments} Dokument{totalDocuments !== 1 ? 'e' : ''} gefunden
                  </p>
                  {renderPagination()}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
} 