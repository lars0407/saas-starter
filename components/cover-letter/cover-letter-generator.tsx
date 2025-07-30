'use client';

import { useState } from 'react';
import { CoverLetterForm } from './cover-letter-form';
import { GeneratedLetter } from './generated-letter';
import { LoadingSkeleton } from './loading-skeleton';

interface CoverLetterData {
  role: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
}

interface GeneratedLetterData {
  content: string;
  id?: string;
}

export function CoverLetterGenerator() {
  const [formData, setFormData] = useState<CoverLetterData>({
    role: '',
    company: '',
    strengths: '',
    motivation: '',
    jobLink: '',
  });
  
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: CoverLetterData) => {
    setIsLoading(true);
    setError(null);
    setFormData(data);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
      
      // Mock generated letter for now
      const mockLetter = {
        content: `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung für die Position als ${data.role} bei ${data.company} gelesen. Ich bin überzeugt, dass meine Qualifikationen und Erfahrungen perfekt zu Ihren Anforderungen passen.

${data.strengths ? `Meine Stärken liegen insbesondere in ${data.strengths}.` : ''}

${data.motivation ? `Was mich besonders motiviert: ${data.motivation}` : ''}

Ich freue mich darauf, von Ihnen zu hören und stehe für ein persönliches Gespräch zur Verfügung.

Mit freundlichen Grüßen
[Ihr Name]`,
        id: Date.now().toString(),
      };

      setGeneratedLetter(mockLetter);
    } catch (err) {
      setError('Uff, da kam nix zurück. Versuch\'s nochmal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (formData.role && formData.company) {
      await handleFormSubmit(formData);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    
    try {
      // TODO: Implement save functionality
      console.log('Saving letter:', generatedLetter);
      // Show success message
    } catch (err) {
      setError('Fehler beim Speichern. Versuch\'s nochmal.');
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit letter');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <div className="space-y-6">
        <CoverLetterForm 
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          initialData={formData}
        />
      </div>

      {/* Right Column - Result */}
      <div className="space-y-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : generatedLetter ? (
          <GeneratedLetter
            letter={generatedLetter}
            onSave={handleSave}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
        ) : (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Noch kein Anschreiben generiert</p>
              <p className="text-sm">Fülle das Formular aus und lass KI dein Anschreiben erstellen! ✨</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 