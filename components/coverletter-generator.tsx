'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CoverLetterForm } from './coverletter-form';
import { GeneratedLetter } from './generated-letter';
import { LoadingSkeleton } from './loading-skeleton';
import { fetchDocument } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Eye, Download, Save, Sparkles } from 'lucide-react';
import { useDocumentDownload } from '@/hooks/use-document-download';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CoverLetterData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobDescription?: string;
  // Basics section
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderStreet: string;
  senderPostcode: string;
  senderCity: string;
  senderCountry: string;
  // Content section
  customContent: string;
  // Additional fields for API
  senderFirstName?: string;
  senderSurname?: string;
  senderTitleBefore?: string;
  senderTitleAfter?: string;
  receiverFirstName?: string;
  receiverSurname?: string;
  receiverTitleBefore?: string;
  receiverTitleAfter?: string;
  receiverPhone?: string;
  receiverEmail?: string;
  receiverStreet?: string;
  receiverCity?: string;
  receiverZip?: string;
  receiverCountry?: string;
  contentSubject?: string;
  contentDate?: string;
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
  // Ensure this component only runs on the client side
  const [isClient, setIsClient] = useState(false);

  // All state hooks must be called in the same order every time
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: '',
    company: '',
    strengths: '',
    motivation: '',
    jobDescription: '',
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderStreet: '',
    senderPostcode: '',
    senderCity: '',
    senderCountry: '',
    customContent: '',
    // Additional fields
    senderFirstName: '',
    senderSurname: '',
    senderTitleBefore: '',
    senderTitleAfter: '',
    receiverFirstName: '',
    receiverSurname: '',
    receiverTitleBefore: '',
    receiverTitleAfter: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverStreet: '',
    receiverCity: '',
    receiverZip: '',
    receiverCountry: '',
    contentSubject: '',
    contentDate: '',
  });
  
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(documentId || null);
  
  // Use the document download hook
  const { downloadDocument, isLoading: isDownloading } = useDocumentDownload();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormDataChange = useCallback((data: CoverLetterData) => {
    console.log('Form data changed in generator:', data);
    setFormData(data);
  }, []);

  // Create document object for download functionality - memoized to prevent unnecessary re-renders
  const currentDocument = React.useMemo(() => {
    if (!currentDocumentId) return null;
    return {
      id: currentDocumentId,
      created_at: Date.now(),
      updated_at: Date.now(),
      type: 'cover letter' as const,
      preview_link: generatedPdfUrl || '',
      name: formData.senderName || 'Anschreiben',
      storage_path: '',
      variant: 'human' as const,
      url: generatedPdfUrl || ''
    };
  }, [currentDocumentId, formData.senderName, generatedPdfUrl]);

  const handleDownloadCoverLetter = useCallback(() => {
    if (currentDocument) {
      downloadDocument(currentDocument);
    }
  }, [currentDocument, downloadDocument]);

  const loadExistingDocument = useCallback(async () => {
    if (!documentId) return;
    
    setIsLoadingDocument(true);
    try {
      const response = await fetchDocument(documentId);
      const document = response.document;
      
      console.log('API Response:', response);
      console.log('Document:', document);
      console.log('Document content:', document?.content);
      
      if (document && document.content) {
        const content = document.content;
        
        // Handle different possible data structures
        // The data might be directly in content, or nested in a data field
        const data = content.data || content;
        
                 // Transform API data to component format
         // The API data structure is nested with Sender, Receiver, Content, Context
         const transformedData: CoverLetterData = {
           // Context fields (Job Details)
           jobTitle: data.Context?.['Job Title'] || data.job_title || content.Context?.['Job Title'] || content.job_title || '',
           company: data.Context?.Company || data.company || content.Context?.Company || content.company || '',
           jobDescription: data.Context?.['Job Description'] || data.job_description || content.Context?.['Job Description'] || content.job_description || '',
           strengths: data.Context?.Strengths || data.strengths || content.Context?.Strengths || content.strengths || '',
           motivation: data.Context?.Motivation || data.motivation || content.Context?.Motivation || content.motivation || '',
          
                     // Sender fields (Basics)
           senderName: data.Sender?.['First name'] || data.sender_name || content.sender_name || '',
          senderPhone: data.Sender?.Telephone || data.sender_phone || content.Sender?.Telephone || content.sender_phone || '',
          senderEmail: data.Sender?.Email || data.sender_email || content.Sender?.Email || content.sender_email || '',
          senderStreet: data.Sender?.Adresse?.Street || data.sender_street || content.Sender?.Adresse?.Street || content.sender_street || '',
          senderPostcode: data.Sender?.Adresse?.['Zip code'] || data.sender_postcode || content.Sender?.Adresse?.['Zip code'] || content.sender_postcode || '',
          senderCity: data.Sender?.Adresse?.City || data.sender_city || content.Sender?.Adresse?.City || content.sender_city || '',
          senderCountry: data.Sender?.Adresse?.Country || data.sender_country || content.Sender?.Adresse?.Country || content.sender_country || '',
          
          // Additional sender fields
          senderFirstName: data.Sender?.['First name'] || data.sender_first_name || content.Sender?.['First name'] || content.sender_first_name || '',
          senderSurname: data.Sender?.['Surname'] || data.sender_surname || content.Sender?.['Surname'] || content.sender_surname || '',
          senderTitleBefore: data.Sender?.TitleBefore || data.sender_titlebefore || content.Sender?.TitleBefore || content.sender_titlebefore || '',
          senderTitleAfter: data.Sender?.TitleAfter || data.sender_titleafter || content.Sender?.TitleAfter || content.sender_titleafter || '',
          
          // Receiver fields
          receiverFirstName: data.Receiver?.['First name'] || data.receiver_first_name || content.Receiver?.['First name'] || content.receiver_first_name || '',
          receiverSurname: data.Receiver?.['Surname'] || data.receiver_surname || content.Receiver?.['Surname'] || content.receiver_surname || '',
          receiverTitleBefore: data.Receiver?.TitleBefore || data.receiver_titlebefore || content.Receiver?.TitleBefore || content.receiver_titlebefore || '',
          receiverTitleAfter: data.Receiver?.TitleAfter || data.receiver_titleafter || content.Receiver?.TitleAfter || content.receiver_titleafter || '',
          receiverPhone: data.Receiver?.Telephone || data.receiver_telephone || content.Receiver?.Telephone || content.receiver_telephone || '',
          receiverEmail: data.Receiver?.Email || data.receiver_email || content.Receiver?.Email || content.receiver_email || '',
          receiverStreet: data.Receiver?.Adresse?.Street || data.receiver_adresse_street || content.Receiver?.Adresse?.Street || content.receiver_adresse_street || '',
          receiverCity: data.Receiver?.Adresse?.City || data.receiver_adresse_city || content.Receiver?.Adresse?.City || content.receiver_adresse_city || '',
          receiverZip: data.Receiver?.Adresse?.['Zip code'] || data.receiver_adresse_zip || content.Receiver?.Adresse?.['Zip code'] || content.receiver_adresse_zip || '',
          receiverCountry: data.Receiver?.Adresse?.Country || data.receiver_adresse_country || content.Receiver?.Adresse?.Country || content.receiver_adresse_country || '',
          
          // Content fields
          customContent: data.Content?.Text || data.custom_content || content.Content?.Text || content.custom_content || '',
          contentSubject: data.Content?.Subject || data.content_subject || content.Content?.Subject || content.content_subject || '',
          contentDate: data.Content?.Date || data.content_date || content.Content?.Date || content.content_date || '',
        };
        
        console.log('Transformed data:', transformedData);
        setFormData(transformedData);
        
        // If there's generated content, set it
        if (content.generated_content) {
          setGeneratedLetter({
            content: content.generated_content,
            timestamp: new Date(document.updated_at || Date.now()),
          });
        }
        
        // Load existing PDF if available
        // Check for top-level download_link.url (Azure blob)
        const downloadUrl = response.download_link?.url || document.download_link;
        
        if (downloadUrl) {
          // Use direct URL - simpler and more reliable
          setGeneratedPdfUrl(downloadUrl);
          setPdfGenerationStatus('ready');
        }
        
        toast.success('Anschreiben erfolgreich geladen! 📄');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Fehler beim Laden des Anschreibens');
    } finally {
      setIsLoadingDocument(false);
    }
  }, [documentId]);

  // Load existing document when documentId is provided
  useEffect(() => {
    if (documentId) {
      setCurrentDocumentId(documentId);
      loadExistingDocument();
    }
  }, [documentId, loadExistingDocument]);

  // Early return for client-side check
  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Lade...</p>
        </div>
      </div>
    );
  }

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
      
      if (data.senderName || data.senderPhone || data.senderEmail || data.senderStreet || data.senderPostcode || data.senderCity || data.senderCountry) {
        // Build address string from separate fields
        const addressParts = [];
        if (data.senderStreet) addressParts.push(data.senderStreet);
        if (data.senderPostcode && data.senderCity) {
          addressParts.push(`${data.senderPostcode} ${data.senderCity}`);
        } else if (data.senderPostcode) {
          addressParts.push(data.senderPostcode);
        } else if (data.senderCity) {
          addressParts.push(data.senderCity);
        }
        if (data.senderCountry) addressParts.push(data.senderCountry);
        
        const senderInfo = `${data.senderName ? data.senderName + '\n' : ''}${data.senderPhone ? data.senderPhone + '\n' : ''}${data.senderEmail ? data.senderEmail + '\n' : ''}${addressParts.length > 0 ? addressParts.join('\n') + '\n' : ''}`;
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
      // Prepare data for API
      const apiData = {
        Sender: {
          "First name": formData.senderName || '',
          "Surname": formData.senderSurname || '',
          "TitleBefore": formData.senderTitleBefore || '',
          "TitleAfter": formData.senderTitleAfter || '',
          "Telephone": formData.senderPhone,
          "Email": formData.senderEmail,
          "Adresse": {
            "Street": formData.senderStreet,
            "City": formData.senderCity,
            "Zip code": formData.senderPostcode,
            "Country": formData.senderCountry
          }
        },
        Receiver: {
          "First name": formData.receiverFirstName || '',
          "Surname": formData.receiverSurname || '',
          "TitleBefore": formData.receiverTitleBefore || '',
          "TitleAfter": formData.receiverTitleAfter || '',
          "Telephone": formData.receiverPhone || '',
          "Email": formData.receiverEmail || '',
          "Adresse": {
            "Street": formData.receiverStreet || '',
            "City": formData.receiverCity || '',
            "Zip code": formData.receiverZip || '',
            "Country": formData.receiverCountry || ''
          }
        },
        Content: {
          "Subject": formData.contentSubject || `Bewerbung als ${formData.jobTitle}`,
          "Date": formData.contentDate || new Date().toISOString().split('T')[0],
          "Text": formData.customContent || generatedLetter?.content || ''
        },
        Context: {
          "Job Title": formData.jobTitle,
          "Job Description": formData.jobDescription || '',
          "Company": formData.company,
          "Strengths": formData.strengths || '',
          "Motivation": formData.motivation || ''
        }
      };

      // Import the generateCoverLetterPDF function
      const { generateCoverLetterPDF: generatePDF } = await import('@/lib/api-client');
      
      const documentName = `Anschreiben ${formData.jobTitle} ${formData.company}`.trim();
      const response = await generatePDF(
        10, // template_id for cover letter
        documentName,
        currentDocumentId,
        apiData
      );

      // Handle the response - assuming it returns a download URL directly
      if (response.download_link && response.download_link.url) {
        setGeneratedPdfUrl(response.download_link.url);
        setPdfGenerationStatus('ready');
        toast.success('Anschreiben erfolgreich generiert! 🎉');
      } else {
        throw new Error('Keine Download-URL erhalten');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfGenerationStatus('error');
      toast.error('Fehler beim Generieren der PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      console.log('Current formData before saving:', formData);
      
      // Prepare data for API
      const apiData = {
        Sender: {
          "First name": formData.senderName || '',
          "Surname": formData.senderSurname || '',
          "TitleBefore": formData.senderTitleBefore || '',
          "TitleAfter": formData.senderTitleAfter || '',
          "Telephone": formData.senderPhone,
          "Email": formData.senderEmail,
          "Adresse": {
            "Street": formData.senderStreet,
            "City": formData.senderCity,
            "Zip code": formData.senderPostcode,
            "Country": formData.senderCountry
          }
        },
        Receiver: {
          "First name": formData.receiverFirstName || '',
          "Surname": formData.receiverSurname || '',
          "TitleBefore": formData.receiverTitleBefore || '',
          "TitleAfter": formData.receiverTitleAfter || '',
          "Telephone": formData.receiverPhone || '',
          "Email": formData.receiverEmail || '',
          "Adresse": {
            "Street": formData.receiverStreet || '',
            "City": formData.receiverCity || '',
            "Zip code": formData.receiverZip || '',
            "Country": formData.receiverCountry || ''
          }
        },
        Content: {
          "Subject": formData.contentSubject || `Bewerbung als ${formData.jobTitle}`,
          "Date": formData.contentDate || new Date().toISOString().split('T')[0],
          "Text": formData.customContent || generatedLetter?.content || ''
        },
        Context: {
          "Job Title": formData.jobTitle,
          "Job Description": formData.jobDescription || '',
          "Company": formData.company,
          "Strengths": formData.strengths || '',
          "Motivation": formData.motivation || ''
        }
      };

      console.log('API data being sent:', apiData);

      // Import the saveCoverLetter function
      const { saveCoverLetter } = await import('@/lib/api-client');
      
      const documentName = `Anschreiben ${formData.jobTitle} ${formData.company}`.trim();
      const response = await saveCoverLetter(
        currentDocumentId || 0,
        documentName,
        apiData,
        10 // template_id for cover letter
      );

      // Update current document ID if it's a new document
      if (!currentDocumentId && response.documentID) {
        setCurrentDocumentId(response.documentID);
        // Update URL with new document ID
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('id', response.documentID.toString());
          window.history.replaceState({}, '', url.toString());
        }
      }

             toast.success('Anschreiben erfolgreich gespeichert! 💾');
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Fehler beim Speichern des Anschreibens');
    } finally {
      setIsLoading(false);
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
    <div className="h-full flex flex-col lg:flex-row gap-6 coverletter-generator">
      {/* Left Column - Form */}
      <div className="lg:w-1/2 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <CoverLetterForm 
            onSubmit={handleFormSubmit}
            onGenerate={generateCoverLetterPDF}
            onSave={handleSave}
            onFormDataChange={handleFormDataChange}
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