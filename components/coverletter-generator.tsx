'use client';

import { useState } from 'react';
import { CoverLetterForm } from './coverletter-form';
import { GeneratedLetter } from './generated-letter';
import { LoadingSkeleton } from './loading-skeleton';

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

export function CoverLetterGenerator() {
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