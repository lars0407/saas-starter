'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface JobDetailsData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobDescription?: string;
}

interface JobDetailsProps {
  data: JobDetailsData;
  onChange: (data: JobDetailsData) => void;
  isEditing: boolean;
  onGenerateWithAI?: () => void;
  isGenerating?: boolean;
  onContentGenerated?: (content: string) => void;
}

export function JobDetails({ data, onChange, isEditing, onGenerateWithAI, isGenerating, onContentGenerated }: JobDetailsProps) {
  const [formData, setFormData] = useState<JobDetailsData>(data);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Function to decode HTML entities
  const decodeHTMLEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const generateCoverLetterContent = async () => {
    if (!formData.jobTitle.trim() || !formData.company.trim() || !formData.jobDescription.trim()) {
      return;
    }

    setIsGeneratingContent(true);
    setShowForm(false);

    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://api.jobjaeger.de/api:6H_xVEFw/artifact/cover_letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_title: formData.jobTitle,
          job_description: formData.jobDescription,
          job_company: formData.company
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.output && onContentGenerated) {
        // Decode HTML entities in the response
        const decodedContent = decodeHTMLEntities(result.output);
        
        onContentGenerated(decodedContent);
      }
    } catch (error) {
      console.error('Error generating cover letter content:', error);
      // Show form again on error
      setShowForm(true);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleInputChange = (field: keyof JobDetailsData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  // Check if required fields are filled
  const hasRequiredData = formData.jobTitle.trim() !== '' && formData.company.trim() !== '' && formData.jobDescription.trim() !== '';

  // Show loading animation when generating content
  if (isGeneratingContent) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/images/utility/loading.gif"
                alt="Loading"
                width={80}
                height={80}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                KI generiert dein Anschreiben...
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Yo! 🤖 Die KI analysiert gerade die Stellenanzeige und erstellt ein personalisiertes Anschreiben für dich. Das dauert nur einen Moment! ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Details - KI-Generierung
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fülle diese Felder aus, um ein personalisiertes Anschreiben mit KI zu generieren
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium">
            Titel der Stelle 🎯 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="jobTitle"
            placeholder="z.B. Frontend Developer, Marketing Manager..."
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium">
            Unternehmen 🏢 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company"
            placeholder="z.B. Google, Microsoft, Startup XYZ..."
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-sm font-medium">
            Stellenanzeige 📋 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="jobDescription"
            placeholder="Füge hier den Text der Stellenanzeige ein. Die KI analysiert die Anforderungen und passt dein Anschreiben entsprechend an..."
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            rows={8}
            className="min-h-[200px] resize-y"
            disabled={!isEditing}
          />
          <p className="text-xs text-muted-foreground">
            Kopiere den Text der Stellenanzeige hier hinein für optimale Ergebnisse
          </p>
        </div>

        {/* Strengths */}
        <div className="space-y-2">
          <Label htmlFor="strengths" className="text-sm font-medium">
            Deine Stärken 💪 <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <Textarea
            id="strengths"
            placeholder="Was macht dich besonders? z.B. Teamführung, technische Skills, Kreativität..."
            value={formData.strengths}
            onChange={(e) => handleInputChange('strengths', e.target.value)}
            rows={3}
            disabled={!isEditing}
          />
          <p className="text-xs text-muted-foreground">
            Hilft der KI, dein Anschreiben zu personalisieren
          </p>
        </div>

        {/* Motivation */}
        <div className="space-y-2">
          <Label htmlFor="motivation" className="text-sm font-medium">
            Deine Motivation 🎯 <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <Textarea
            id="motivation"
            placeholder="Warum willst du diesen Job? Was reizt dich an dem Unternehmen?"
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            rows={3}
            disabled={!isEditing}
          />
          <p className="text-xs text-muted-foreground">
            Macht dein Anschreiben authentischer und überzeugender
          </p>
        </div>

        {/* AI Generation Button */}
        {isEditing && hasRequiredData && (
          <div className="pt-4 border-t">
            <Button
              onClick={generateCoverLetterContent}
              disabled={isGeneratingContent || !hasRequiredData}
              className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white"
            >
              {isGeneratingContent ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generiere Anschreiben...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Anschreiben mit KI generieren
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Die KI erstellt ein personalisiertes Anschreiben basierend auf deinen Angaben
            </p>
          </div>
        )}

                 {/* Info when required fields are missing */}
         {isEditing && !hasRequiredData && (
           <div className="pt-4 border-t">
             <div className="text-center p-4 bg-green-50 rounded-lg">
               <p className="text-sm text-green-700">
                 Fülle Job-Titel, Unternehmen und Stellenanzeige aus, um ein personalisiertes Anschreiben mit KI zu generieren. Je mehr Details du angibst, desto besser wird das Ergebnis.
               </p>
             </div>
           </div>
         )}
      </CardContent>
    </Card>
  );
} 