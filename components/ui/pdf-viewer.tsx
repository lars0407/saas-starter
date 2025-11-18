"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Eye, EyeOff } from "lucide-react"

interface PDFViewerProps {
  pdfUrl?: string
  initialPage?: number
  showToolbar?: boolean
  showNavigation?: boolean
  showBorder?: boolean
  borderWidth?: string
  borderColor?: string
  borderRadius?: string
  fallbackMessage?: string
  downloadMessage?: string
  placeholderMessage?: string
  className?: string
  onLoaded?: (payload: { url: string }) => void
  onError?: (payload: { url: string }) => void
  onPageChanged?: (payload: { page: number }) => void
}

export function PDFViewer({
  pdfUrl,
  initialPage = 1,
  showToolbar = true,
  showNavigation = true,
  showBorder = true,
  borderWidth = "1px",
  borderColor = "#dddddd",
  borderRadius = "4px",
  fallbackMessage = "PDF konnte nicht geladen werden",
  downloadMessage = "PDF herunterladen",
  placeholderMessage = "Keine PDF URL angegeben",
  className,
  onLoaded,
  onError,
  onPageChanged
}: PDFViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [showToolbarState, setShowToolbarState] = useState(showToolbar)
  const [showNavigationState, setShowNavigationState] = useState(showNavigation)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Expose variables for external access
  useEffect(() => {
    // This would be used in WeWeb to expose variables
    // For now, we'll use state that can be accessed via refs or callbacks
  }, [isLoaded, hasError, currentPage])

  useEffect(() => {
    if (!pdfUrl) {
      setHasError(true)
      setIsLoaded(false)
      return
    }

    setIsLoaded(false)
    setHasError(false)

    // Simulate PDF loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setTotalPages(10) // Mock total pages
      onLoaded?.({ url: pdfUrl })
    }, 1000)

    return () => clearTimeout(timer)
  }, [pdfUrl, onLoaded])

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
    onError?.({ url: pdfUrl || "" })
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      onPageChanged?.({ page: pageNumber })
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const toggleToolbar = () => {
    setShowToolbarState(!showToolbarState)
  }

  const toggleNavigation = () => {
    setShowNavigationState(!showNavigationState)
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = pdfUrl.split('/').pop() || 'document.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const containerStyle = {
    border: showBorder ? `${borderWidth} solid ${borderColor}` : 'none',
    borderRadius: borderRadius,
  }

  if (!pdfUrl) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg",
          className
        )}
        style={containerStyle}
      >
        <div className="text-center">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm">{placeholderMessage}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg",
          className
        )}
        style={containerStyle}
      >
        <div className="text-center">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm mb-4">{fallbackMessage}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadMessage}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn("flex flex-col", className)}
      style={containerStyle}
    >
      {/* Toolbar */}
      {showToolbarState && (
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNavigation}
              className="h-8 px-2"
            >
              {showNavigationState ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            {showNavigationState && totalPages > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {!isLoaded ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
            className="w-full h-full min-h-[400px] max-w-full"
            style={{ maxWidth: '100%', width: '100%' }}
            onError={handleError}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  )
}

// Expose actions for external use
export const PDFViewerActions = {
  goToPage: (viewerRef: React.RefObject<{ goToPage: (page: number) => void }>, pageNumber: number) => {
    viewerRef.current?.goToPage(pageNumber)
  }
} 