'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Download, 
  Save, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonalInfo } from './resume-sections/personal-info';
import { Education } from './resume-sections/education';
import { Experience } from './resume-sections/experience';
import { Skills } from './resume-sections/skills';

// Import the existing PDF viewer component
import { PDFViewer } from './ui/pdf-viewer';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description?: string;
    gpa?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: 'technical' | 'soft' | 'language' | 'tool';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
}

const STEPS = [
  { id: 'personal', label: 'Persönlich', icon: '👤' },
  { id: 'education', label: 'Ausbildung', icon: '🎓' },
  { id: 'experience', label: 'Erfahrung', icon: '💼' },
  { id: 'skills', label: 'Skills', icon: '💪' },
  { id: 'preview', label: 'Vorschau', icon: '👁️' },
];

export function ResumeGeneratorNew() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    education: [],
    experience: [],
    skills: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updatePersonalInfo = (data: any) => {
    setResumeData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateEducation = (data: any[]) => {
    setResumeData(prev => ({ ...prev, education: data }));
  };

  const updateExperience = (data: any[]) => {
    setResumeData(prev => ({ ...prev, experience: data }));
  };

  const updateSkills = (data: any[]) => {
    setResumeData(prev => ({ ...prev, skills: data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Personal Info
        return !!(resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.location);
      case 1: // Education
        return resumeData.education.length > 0 && resumeData.education.every(edu => 
          edu.institution && edu.degree && edu.field
        );
      case 2: // Experience
        return resumeData.experience.length > 0 && resumeData.experience.every(exp => 
          exp.company && exp.position && exp.description
        );
      case 3: // Skills
        return resumeData.skills.length > 0 && resumeData.skills.every(skill => skill.name);
      default:
        return false;
    }
  };

  const generateResume = async () => {
    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Lebenslauf erfolgreich generiert! 🎉');
      nextStep();
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Fehler beim Generieren des Lebenslaufs');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving resume:', resumeData);
    toast.success('Lebenslauf gespeichert! ✅');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Downloading resume:', resumeData);
    toast.success('Lebenslauf heruntergeladen! 📄');
  };

  const getProgressPercentage = () => {
    const completedSteps = STEPS.slice(0, -1).filter((_, index) => isStepComplete(index)).length;
    return (completedSteps / (STEPS.length - 1)) * 100;
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 resume-generator">
      <style jsx>{`
        .resume-input:focus {
          border-color: #0F973D !important;
          box-shadow: 0 0 0 2px rgba(15, 151, 61, 0.2) !important;
        }
        .resume-input:focus-within {
          border-color: #0F973D !important;
          box-shadow: 0 0 0 2px rgba(15, 151, 61, 0.2) !important;
        }
      `}</style>
      
      {/* Left Column - Form */}
      <div className="lg:w-1/2 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Fortschritt</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${getProgressPercentage()}%`,
                backgroundColor: '#0F973D'
              }}
            />
          </div>
        </div>

        {/* Form Content - All Sections */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Personal Info Section */}
          <PersonalInfo
            data={resumeData.personalInfo}
            onChange={updatePersonalInfo}
          />
          
          {/* Education Section */}
          <Education
            data={resumeData.education}
            onChange={updateEducation}
          />
          
          {/* Experience Section */}
          <Experience
            data={resumeData.experience}
            onChange={updateExperience}
          />
          
          {/* Skills Section */}
          <Skills
            data={resumeData.skills}
            onChange={updateSkills}
          />
          
          {/* Generate Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Lebenslauf generieren 🚀
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Überprüfe alle Angaben und generiere deinen Lebenslauf
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Persönliche Daten</span>
                  <Badge variant={isStepComplete(0) ? "default" : "secondary"}>
                    {isStepComplete(0) ? "✓" : "!"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Ausbildung</span>
                  <Badge variant={isStepComplete(1) ? "default" : "secondary"}>
                    {isStepComplete(1) ? "✓" : "!"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Berufserfahrung</span>
                  <Badge variant={isStepComplete(2) ? "default" : "secondary"}>
                    {isStepComplete(2) ? "✓" : "!"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Skills</span>
                  <Badge variant={isStepComplete(3) ? "default" : "secondary"}>
                    {isStepComplete(3) ? "✓" : "!"}
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={generateResume}
                disabled={isGenerating || !Object.values(STEPS.slice(0, -1)).every((_, index) => isStepComplete(index))}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generiere Lebenslauf...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Lebenslauf generieren
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Live Vorschau
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              So sieht dein Lebenslauf aus
            </p>
          </CardHeader>
          <CardContent className="h-[calc(100%-120px)]">
            <PDFViewer
              content={JSON.stringify(resumeData)}
              filename="lebenslauf-preview"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 