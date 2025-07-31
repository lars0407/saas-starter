'use client';

import { useState } from 'react';
import { ResumeForm } from './resume-form';
import { GeneratedResume } from './generated-resume';
import { LoadingSkeleton } from './loading-skeleton';

interface ResumeData {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  profession: string;
  experience: string;
  education: string;
  skills: string;
  languages?: string;
  certifications?: string;
  targetPosition?: string;
}

interface GeneratedResumeData {
  content: string;
  timestamp: Date;
}

export function ResumeGenerator() {
  const [formData, setFormData] = useState<ResumeData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    experience: '',
    education: '',
    skills: '',
    languages: '',
    certifications: '',
    targetPosition: '',
  });
  
  const [generatedResume, setGeneratedResume] = useState<GeneratedResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormSubmit = async (data: ResumeData) => {
    setIsLoading(true);
    setFormData(data);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate API delay
      
      const mockGeneratedContent = `${data.fullName.toUpperCase()}
${data.email}${data.phone ? ` | ${data.phone}` : ''} | ${data.location}

PROFESSIONAL SUMMARY
${data.profession}

${data.targetPosition ? `TARGET POSITION: ${data.targetPosition}` : ''}

PROFESSIONAL EXPERIENCE
${data.experience}

EDUCATION
${data.education}

SKILLS
${data.skills}

${data.languages ? `LANGUAGES
${data.languages}` : ''}

${data.certifications ? `CERTIFICATIONS
${data.certifications}` : ''}

---
Generated with Jobjäger KI-Lebenslauf Generator`;

      setGeneratedResume({
        content: mockGeneratedContent,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error generating resume:', error);
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
    console.log('Saving resume:', generatedResume);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = (editedContent: string) => {
    if (generatedResume) {
      setGeneratedResume({
        ...generatedResume,
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
        <ResumeForm 
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          initialData={formData}
        />
      </div>

      {/* Right Column - Result */}
      <div className="lg:w-1/2">
        {isLoading ? (
          <LoadingSkeleton />
        ) : generatedResume ? (
          <GeneratedResume
            content={generatedResume.content}
            timestamp={generatedResume.timestamp}
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
              <p className="text-lg mb-2">👋 Willkommen beim KI-Lebenslauf Generator!</p>
              <p className="text-sm">Fülle das Formular aus und lass uns deinen perfekten Lebenslauf erstellen! 🚀</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 