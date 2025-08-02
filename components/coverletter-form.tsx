'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { Basics, JobDetails, Content } from './coverletter-sections';
import { cn } from '@/lib/utils';

interface CoverLetterFormProps {
  onSubmit: (data: CoverLetterData) => void;
  onGenerate: () => void;
  onSave: () => void;
  onFormDataChange: (data: CoverLetterData) => void;
  isLoading: boolean;
  isGenerating: boolean;
  initialData: CoverLetterData;
}

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

export function CoverLetterForm({ onSubmit, onGenerate, onSave, onFormDataChange, isLoading, isGenerating, initialData }: CoverLetterFormProps) {
  const isInitialMount = useRef(true);
  const [formData, setFormData] = useState<CoverLetterData>({
    ...initialData,
    jobTitle: initialData.jobTitle || '',
    company: initialData.company || '',
    strengths: initialData.strengths || '',
    motivation: initialData.motivation || '',
    jobDescription: initialData.jobDescription || '',
    senderName: initialData.senderName || '',
    senderPhone: initialData.senderPhone || '',
    senderEmail: initialData.senderEmail || '',
    senderStreet: initialData.senderStreet || '',
    senderPostcode: initialData.senderPostcode || '',
    senderCity: initialData.senderCity || '',
    senderCountry: initialData.senderCountry || '',
    customContent: initialData.customContent || '',
    // Additional fields
    senderFirstName: initialData.senderFirstName || '',
    senderSurname: initialData.senderSurname || '',
    senderTitleBefore: initialData.senderTitleBefore || '',
    senderTitleAfter: initialData.senderTitleAfter || '',
    receiverFirstName: initialData.receiverFirstName || '',
    receiverSurname: initialData.receiverSurname || '',
    receiverTitleBefore: initialData.receiverTitleBefore || '',
    receiverTitleAfter: initialData.receiverTitleAfter || '',
    receiverPhone: initialData.receiverPhone || '',
    receiverEmail: initialData.receiverEmail || '',
    receiverStreet: initialData.receiverStreet || '',
    receiverCity: initialData.receiverCity || '',
    receiverZip: initialData.receiverZip || '',
    receiverCountry: initialData.receiverCountry || '',
    contentSubject: initialData.contentSubject || '',
    contentDate: initialData.contentDate || '',
  });

  useEffect(() => {
    console.log('CoverLetterForm received initialData:', initialData);
    console.log('Current formData before setting:', formData);
    setFormData(initialData);
    isInitialMount.current = true;
  }, [initialData]);

  // Notify parent when formData changes, but skip the initial mount
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log('Notifying parent of formData change:', formData);
      onFormDataChange(formData);
    } else {
      console.log('Skipping initial mount notification');
      isInitialMount.current = false;
    }
  }, [formData, onFormDataChange]);

  const validateForm = (): boolean => {
    // Job Details sind optional für die KI-Generierung
    // Nur Basics (Name und Email) sind erforderlich
    return Boolean(formData.senderName.trim() && formData.senderEmail.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleBasicsChange = (basicsData: any) => {
    console.log('Basics data received:', basicsData);
    console.log('Current formData before update:', formData);
    setFormData(prev => {
      const newData = {
        ...prev,
        senderName: basicsData.senderName,
        senderPhone: basicsData.senderPhone,
        senderEmail: basicsData.senderEmail,
        senderStreet: basicsData.senderStreet,
        senderPostcode: basicsData.senderPostcode,
        senderCity: basicsData.senderCity,
        senderCountry: basicsData.senderCountry,
      };
      console.log('Updated form data:', newData);
      // Directly notify parent of the change
      onFormDataChange(newData);
      return newData;
    });
  };

  const handleJobDetailsChange = (jobData: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        strengths: jobData.strengths,
        motivation: jobData.motivation,
        jobDescription: jobData.jobDescription,
      };
      return newData;
    });
  };

  const handleContentChange = (contentData: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        customContent: contentData.customContent,
      };
      return newData;
    });
  };

  const isFormValid = Boolean(formData.senderName.trim() && formData.senderEmail.trim());

  return (
    <div className="space-y-6">
      {/* Basics Section */}
      {(() => {
        const basicsData = {
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          senderEmail: formData.senderEmail,
          senderStreet: formData.senderStreet,
          senderPostcode: formData.senderPostcode,
          senderCity: formData.senderCity,
          senderCountry: formData.senderCountry,
        };
        console.log('Passing data to Basics component:', basicsData);
        return (
          <Basics
            data={basicsData}
            onChange={handleBasicsChange}
            isEditing={!isLoading}
          />
        );
      })()}

      {/* Job Details Section */}
      <JobDetails
        data={{
          jobTitle: formData.jobTitle,
          company: formData.company,
          strengths: formData.strengths,
          motivation: formData.motivation,
          jobDescription: formData.jobDescription,
        }}
        onChange={handleJobDetailsChange}
        isEditing={!isLoading}
        onGenerateWithAI={onGenerate}
        isGenerating={isGenerating}
      />

      {/* Content Section */}
      <Content
        data={{
          customContent: formData.customContent,
        }}
        onChange={handleContentChange}
        isEditing={!isLoading}
      />

      {/* Generate Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Anschreiben generieren 🚀
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Überprüfe alle Angaben und generiere dein Anschreiben
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Absender</span>
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium",
                formData.senderName && formData.senderEmail 
                  ? "bg-[#0F973D] text-white" 
                  : "bg-muted text-muted-foreground"
              )}>
                {formData.senderName && formData.senderEmail ? "✓" : "!"}
              </div>
            </div>
                         <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
               <span className="text-sm font-medium">Job Details (Optional)</span>
               <div className={cn(
                 "flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium",
                 formData.jobTitle && formData.company 
                   ? "bg-[#0F973D] text-white" 
                   : "bg-[#0F973D] text-white"
               )}>
                 {formData.jobTitle && formData.company ? "✓" : "?"}
               </div>
             </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Inhalt</span>
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium",
                formData.customContent 
                  ? "bg-[#0F973D] text-white" 
                  : "bg-muted text-muted-foreground"
              )}>
                {formData.customContent ? "✓" : "!"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onSave}
              disabled={!isFormValid || isLoading}
              variant="outline"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !isFormValid}
              className="flex-1 bg-[#0F973D] hover:bg-[#0F973D]/90 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generiere...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generieren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 