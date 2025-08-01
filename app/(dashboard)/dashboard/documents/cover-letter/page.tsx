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
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"
import { DocumentCard } from "@/components/document-card"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { EmptyState } from "@/components/empty-state"

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

interface DocumentsResponse {
  document: {
    itemsReceived: number
    offset: number
    itemsTotal: number
    items: Document[]
  }
}

const ITEMS_PER_PAGE = 6

export default function CoverLetterPage() {
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
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents?offset=${offset}&variant=${variant}&type=cover letter`,
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
      console.log("Cover letters API response:", data) // Debug log
      
      // Ensure we have valid data
      if (!data || !data.document) {
        throw new Error("Invalid response format")
      }
      
      // Use the new response structure
      const documents = data.document.items || []
      const total = data.document.itemsTotal || 0
      
      console.log("Processed cover letters:", documents)
      console.log("Total count:", total)
      
      setDocuments(documents)
      setTotalDocuments(total)
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))
    } catch (error) {
      console.error("Error fetching cover letters:", error)
      toast.error("Fehler beim Laden der Anschreiben 😅")
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

  const handleDelete = async (id: number) => {
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

  const handleView = (id: number) => {
    // Find the document by ID
    const document = documents.find(doc => doc.id === id)
    if (!document) {
      toast.error("Anschreiben nicht gefunden 😅")
      return
    }

    const downloadUrl = document.url
    if (!downloadUrl) {
      toast.error("PDF URL nicht verfügbar 📄")
      return
    }

    // Open PDF in browser's PDF viewer
    window.open(downloadUrl, '_blank')
  }

  const handleEdit = (id: number) => {
    // Navigate to the cover letter editor with the document ID
    window.location.href = `/dashboard/coverletter-generate?id=${id}`
  }

  const handleCreateCoverLetter = () => {
    // Navigate to the cover letter generator
    window.location.href = '/dashboard/coverletter-generate'
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/documents">
                  Dokumente
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Anschreiben</BreadcrumbPage>
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
                Deine Anschreiben – ready to impress 💼
              </h1>
              <p className="text-gray-600 mt-2">
                Hier findest du alle Bewerbungsanschreiben, die du erstellt oder mit KI generiert hast.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleCreateCoverLetter}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Anschreiben generieren
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="human">Basis</TabsTrigger>
            <TabsTrigger value="ai">KI-generiert</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderSkeletons()}
              </div>
            ) : !documents || documents.length === 0 ? (
              <div className="flex items-center justify-center h-[calc(100vh-300px)] w-full">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Sparkles className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Noch kein Anschreiben erstellt 😶‍🌫️
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Fang jetzt an und erstelle ein Anschreiben, das wirklich raussticht.
                  </p>
                  <Button 
                    onClick={handleCreateCoverLetter}
                    className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Anschreiben generieren
                  </Button>
                </div>
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
                    {totalDocuments} Anschreiben gefunden
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