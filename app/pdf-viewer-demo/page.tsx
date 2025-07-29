"use client"

import { useState } from "react"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function PDFViewerDemoPage() {
  const [pdfUrl, setPdfUrl] = useState("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
  const [showToolbar, setShowToolbar] = useState(true)
  const [showNavigation, setShowNavigation] = useState(true)
  const [showBorder, setShowBorder] = useState(true)
  const [borderWidth, setBorderWidth] = useState("1px")
  const [borderColor, setBorderColor] = useState("#dddddd")
  const [borderRadius, setBorderRadius] = useState("4px")

  const handleLoaded = (payload: { url: string }) => {
    console.log("PDF loaded:", payload.url)
  }

  const handleError = (payload: { url: string }) => {
    console.log("PDF error:", payload.url)
  }

  const handlePageChanged = (payload: { page: number }) => {
    console.log("Page changed:", payload.page)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDF Viewer Component Demo
          </h1>
          <p className="text-gray-600">
            A customizable PDF viewer component with configurable appearance and navigation controls
          </p>
        </div>

        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pdfUrl">PDF URL</Label>
                <Input
                  id="pdfUrl"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="Enter PDF URL"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showToolbar"
                    checked={showToolbar}
                    onCheckedChange={setShowToolbar}
                  />
                  <Label htmlFor="showToolbar">Show Toolbar</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showNavigation"
                    checked={showNavigation}
                    onCheckedChange={setShowNavigation}
                  />
                  <Label htmlFor="showNavigation">Show Navigation</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showBorder"
                    checked={showBorder}
                    onCheckedChange={setShowBorder}
                  />
                  <Label htmlFor="showBorder">Show Border</Label>
                </div>
              </div>
            </div>

            {showBorder && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="borderWidth">Border Width</Label>
                  <Input
                    id="borderWidth"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(e.target.value)}
                    placeholder="1px"
                  />
                </div>
                
                <div>
                  <Label htmlFor="borderColor">Border Color</Label>
                  <Input
                    id="borderColor"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    placeholder="#dddddd"
                  />
                </div>
                
                <div>
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <Input
                    id="borderRadius"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    placeholder="4px"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PDF Viewer */}
        <Card>
          <CardHeader>
            <CardTitle>PDF Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <PDFViewer
              pdfUrl={pdfUrl}
              showToolbar={showToolbar}
              showNavigation={showNavigation}
              showBorder={showBorder}
              borderWidth={borderWidth}
              borderColor={borderColor}
              borderRadius={borderRadius}
              onLoaded={handleLoaded}
              onError={handleError}
              onPageChanged={handlePageChanged}
              className="h-[600px]"
            />
          </CardContent>
        </Card>

        {/* Example URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Example PDF URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                className="justify-start"
              >
                W3C Dummy PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setPdfUrl("https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf")}
                className="justify-start"
              >
                Mozilla PDF.js Example
              </Button>
              <Button
                variant="outline"
                onClick={() => setPdfUrl("")}
                className="justify-start"
              >
                Empty URL (Error State)
              </Button>
              <Button
                variant="outline"
                onClick={() => setPdfUrl("https://invalid-url-that-does-not-exist.pdf")}
                className="justify-start"
              >
                Invalid URL (Error State)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 