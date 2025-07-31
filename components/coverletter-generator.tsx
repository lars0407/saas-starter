'use client';

import { useState, useEffect } from 'react';
import { CoverLetterForm } from './coverletter-form';
import { GeneratedLetter } from './generated-letter';
import { LoadingSkeleton } from './loading-skeleton';
import { fetchDocument } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CoverLetterData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
}

interface GeneratedLetterData {
  content: string;
  timestamp: Date;
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
  });
  
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  // Load existing document when documentId is provided
  useEffect(() => {
    if (documentId) {
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
      
      const mockGeneratedContent = `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung für die Position als ${data.jobTitle} bei ${data.company} gelesen. Ich bin überzeugt, dass meine Qualifikationen und Erfahrungen perfekt zu Ihren Anforderungen passen.

${data.strengths ? `Meine Stärken liegen insbesondere in ${data.strengths}.` : 'Ich bringe umfassende Erfahrungen in diesem Bereich mit.'}

${data.motivation ? `Meine Motivation für diese Position: ${data.motivation}` : 'Ich bin sehr motiviert, Teil Ihres Teams zu werden und einen wertvollen Beitrag zu leisten.'}

Ich freue mich darauf, von Ihnen zu hören und die Möglichkeit zu erhalten, mich persönlich vorzustellen.

Mit freundlichen Grüßen
[Ihr Name]`;

      setGeneratedLetter({
        content: mockGeneratedContent,
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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving cover letter:', generatedLetter);
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
      <div className="lg:w-1/2">
        <CoverLetterForm 
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          initialData={formData}
        />
      </div>

      {/* Right Column - Result */}
      <div className="lg:w-1/2">
        {isLoading ? (
          <LoadingSkeleton />
        ) : generatedLetter ? (
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
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">👋 Willkommen beim KI-Anschreiben Generator!</p>
              <p className="text-sm">Fülle das Formular aus und lass uns dein perfektes Anschreiben erstellen! 🚀</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 