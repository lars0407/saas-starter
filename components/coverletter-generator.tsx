'use client';

import { useState, useEffect } from 'react';
import { CoverLetterForm } from './coverletter-form';
import { GeneratedLetter } from './generated-letter';
import { LoadingSkeleton } from './loading-skeleton';
import { fetchDocument } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Eye, Download, Save, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CoverLetterData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
  // Basics section
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  // Content section
  customContent: string;
}

interface GeneratedLetterData {
  content: string;
  timestamp: Date;
}

interface DownloadResponse {
  download_link: {
    url: string;
    expires_at: string;
  };
}

interface CoverLetterGeneratorProps {
  documentId?: number;
}

export function CoverLetterGenerator({ documentId }: CoverLetterGeneratorProps) {
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: '',
    company: '',
    strengths: '',
    motivation: '',
    jobLink: '',
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    customContent: '',
  });
  
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(documentId || null);

  // Load existing document when documentId is provided
  useEffect(() => {
    if (documentId) {
      setCurrentDocumentId(documentId);
      loadExistingDocument();
    }
  }, [documentId]);

  const loadExistingDocument = async () => {
    if (!documentId) return;
    
    setIsLoadingDocument(true);
    try {
      const response = await fetchDocument(documentId);
      const document = response.document;
      
      if (document && document.content) {
        const content = document.content;
        
        // Transform API data to component format
        const transformedData: CoverLetterData = {
          jobTitle: content.job_title || '',
          company: content.company || '',
          strengths: content.strengths || '',
          motivation: content.motivation || '',
          jobLink: content.job_link || '',
          senderName: content.sender_name || '',
          senderPhone: content.sender_phone || '',
          senderEmail: content.sender_email || '',
          senderAddress: content.sender_address || '',
          customContent: content.custom_content || '',
        };
        
        setFormData(transformedData);
        
        // If there's generated content, set it
        if (content.generated_content) {
          setGeneratedLetter({
            content: content.generated_content,
            timestamp: new Date(document.updated_at || Date.now()),
          });
        }
        
        toast.success('Anschreiben erfolgreich geladen! 📄');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Fehler beim Laden des Anschreibens');
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleFormSubmit = async (data: CoverLetterData) => {
    setIsLoading(true);
    setFormData(data);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
      
      // If custom content is provided, use it; otherwise generate content
      let contentToUse = data.customContent;
      
      if (!contentToUse) {
        contentToUse = `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung für die Position als ${data.jobTitle} bei ${data.company} gelesen. Ich bin überzeugt, dass meine Qualifikationen und Erfahrungen perfekt zu Ihren Anforderungen passen.

${data.strengths ? `Meine Stärken liegen insbesondere in ${data.strengths}.` : 'Ich bringe umfassende Erfahrungen in diesem Bereich mit.'}

${data.motivation ? `Meine Motivation für diese Position: ${data.motivation}` : 'Ich bin sehr motiviert, Teil Ihres Teams zu werden und einen wertvollen Beitrag zu leisten.'}

Ich freue mich darauf, von Ihnen zu hören und die Möglichkeit zu erhalten, mich persönlich vorzustellen.

Mit freundlichen Grüßen
${data.senderName || '[Ihr Name]'}`;
      }

      // Add sender information if provided
      let finalContent = contentToUse;
      
      if (data.senderName || data.senderPhone || data.senderEmail || data.senderAddress) {
        const senderInfo = `${data.senderName ? data.senderName + '\n' : ''}${data.senderPhone ? data.senderPhone + '\n' : ''}${data.senderEmail ? data.senderEmail + '\n' : ''}${data.senderAddress ? data.senderAddress + '\n' : ''}`;
        finalContent = senderInfo + '\n\n' + contentToUse;
      }

      setGeneratedLetter({
        content: finalContent,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleFormSubmit(formData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = (editedContent: string) => {
    if (generatedLetter) {
      setGeneratedLetter({
        ...generatedLetter,
        content: editedContent,
      });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const generateCoverLetterPDF = async () => {
    if (!currentDocumentId) {
      toast.error('Bitte speichern Sie zuerst das Anschreiben');
      return;
    }
    setIsGenerating(true);
    setPdfGenerationStatus('generating');
    setGeneratedPdfUrl(null);
    try {
      // TODO: Replace with actual API call for cover letter PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
      
      // Mock PDF URL for demonstration
      const mockPdfUrl = 'https://example.com/cover-letter.pdf';
      setGeneratedPdfUrl(mockPdfUrl);
      setPdfGenerationStatus('ready');
      toast.success('Anschreiben erfolgreich generiert! 🎉');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfGenerationStatus('error');
      toast.error('Fehler beim Generieren der PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCoverLetter = () => {
    if (generatedPdfUrl) {
      setIsDownloading(true);
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = generatedPdfUrl;
      link.download = 'anschreiben.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
      toast.success('Download gestartet! 📄');
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save functionality
      console.log('Saving cover letter:', generatedLetter);
      toast.success('Anschreiben gespeichert! 💾');
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Fehler beim Speichern');
    }
  };

  // Show loading state while fetching document
  if (isLoadingDocument) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Lade Anschreiben...</p>
          <p className="text-sm text-muted-foreground">Bitte warten Sie einen Moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Column - Form */}
      <div className="lg:w-1/2 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <CoverLetterForm 
            onSubmit={handleFormSubmit}
            onGenerate={generateCoverLetterPDF}
            isLoading={isLoading}
            isGenerating={isGenerating}
            initialData={formData}
          />
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:w-1/2 flex flex-col min-h-0">
        <Card className="h-full flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Live Vorschau
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  So sieht dein Anschreiben aus
                </p>
              </div>
              {generatedPdfUrl && currentDocument && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCoverLetter}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? 'Lade...' : 'Download'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2 min-h-0">
            {pdfGenerationStatus === 'generating' ? (
              // Show skeleton loader during PDF generation
              <div className="min-h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F973D] mx-auto mb-4" />
                  <p className="text-sm font-medium mb-2">
                    Generiere PDF...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ihr Anschreiben wird generiert
                  </p>
                </div>
              </div>
            ) : pdfGenerationStatus === 'error' ? (
              // Show error state
              <div className="min-h-full flex items-center justify-center text-red-500 bg-red-50 rounded-lg p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-red-400 mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-sm font-medium mb-2">Fehler beim Generieren</p>
                  <p className="text-xs text-red-400">
                    Versuchen Sie es erneut
                  </p>
                </div>
              </div>
            ) : generatedPdfUrl ? (
              // Show PDF Viewer when PDF is generated
              <div className="h-full">
                <div className="w-full h-full">
                  <iframe
                    src={`${generatedPdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full min-h-[400px] border-0"
                    title="PDF Viewer"
                    onLoad={() => console.log('PDF loaded successfully')}
                    onError={() => {
                      console.error('PDF loading failed');
                      toast.error('Fehler beim Laden der PDF-Vorschau');
                    }}
                  />
                </div>
              </div>
            ) : generatedLetter ? (
              // Show generated letter content
              <div className="h-full">
                <GeneratedLetter
                  content={generatedLetter.content}
                  timestamp={generatedLetter.timestamp}
                  isEditing={isEditing}
                  onRegenerate={handleRegenerate}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onEditSave={handleEditSave}
                  onEditCancel={handleEditCancel}
                />
              </div>
            ) : (
              // Show empty state when no content is generated
              <div className="min-h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm mb-2">Live Vorschau</p>
                  <p className="text-xs text-gray-400">
                    {formData.senderName ? 
                      `Anschreiben für ${formData.senderName}` : 
                      'Fülle die Formulare aus, um eine Vorschau zu sehen'
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 