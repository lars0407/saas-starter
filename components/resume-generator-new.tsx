'use client';

import { useState, useEffect } from 'react';
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
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonalInfo } from './resume-sections/personal-info';
import { Education } from './resume-sections/education';
import { Experience } from './resume-sections/experience';
import { Skills } from './resume-sections/skills';
import { saveResume, fetchDocument } from '@/lib/api-client';

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

interface ResumeGeneratorNewProps {
  documentId?: number;
}

export function ResumeGeneratorNew({ documentId }: ResumeGeneratorNewProps) {
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
  const [isLoading, setIsLoading] = useState(false);

  // Load existing document when documentId is provided
  useEffect(() => {
    if (documentId) {
      loadExistingDocument();
    }
  }, [documentId]);

  const loadExistingDocument = async () => {
    if (!documentId) return;
    
    setIsLoading(true);
    try {
      const response = await fetchDocument(documentId);
      const document = response.document;
      
      if (document && document.content) {
        const content = document.content;
        
        // Transform API data to component format
        const transformedData: ResumeData = {
          personalInfo: {
            fullName: `${content.basics?.first_name || ''} ${content.basics?.surname || ''}`.trim(),
            email: content.basics?.email || '',
            phone: content.basics?.telephone || '',
            location: content.basics?.adresse_city || '',
            website: '',
            linkedin: '',
            github: '',
            summary: content.basics?.description || '',
          },
          education: content.education?.map((edu: any, index: number) => ({
            id: `edu-${index}`,
            institution: edu.school || '',
            degree: edu.degree || '',
            field: edu.subject || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            current: !edu.endDate,
            description: edu.description || '',
            gpa: edu.grade || '',
          })) || [],
          experience: content.experience?.map((exp: any, index: number) => ({
            id: `exp-${index}`,
            company: exp.company || '',
            position: exp.title || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: !exp.endDate,
            description: exp.description || '',
            achievements: [],
          })) || [],
          skills: content.skill?.map((skill: any, index: number) => ({
            id: `skill-${index}`,
            name: skill.name || '',
            category: skill.category || 'technical',
            level: skill.level || 'intermediate',
          })) || [],
        };
        
        setResumeData(transformedData);
        toast.success('Lebenslauf erfolgreich geladen! 📄');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Fehler beim Laden des Lebenslaufs');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSave = async () => {
    try {
      // Convert resume data to API format
      const apiData = {
        link: [],
        skill: resumeData.skills.map(skill => ({
          name: skill.name,
          level: skill.level,
          category: skill.category
        })),
        basics: {
          email: resumeData.personalInfo.email,
          image: "",
          surname: resumeData.personalInfo.fullName.split(' ').slice(-1).join(' ') || "",
          birthdate: "",
          telephone: resumeData.personalInfo.phone || "",
          first_name: resumeData.personalInfo.fullName.split(' ')[0] || "",
          description: resumeData.personalInfo.summary || "",
          nationality: "",
          title_after: "",
          adresse_city: resumeData.personalInfo.location,
          title_before: "",
          adresse_street: "",
          adresse_country: "",
          adresse_postcode: ""
        },
        language: [],
        education: resumeData.education.map(edu => ({
          grade: edu.gpa || "",
          degree: edu.degree,
          school: edu.institution,
          endDate: edu.current ? "" : edu.endDate,
          subject: edu.field,
          startDate: edu.startDate,
          description: edu.description || "",
          location_city: "",
          location_country: ""
        })),
        experience: resumeData.experience.map(exp => ({
          title: exp.position,
          company: exp.company,
          endDate: exp.current ? "" : exp.endDate,
          location: exp.location,
          startDate: exp.startDate,
          description: exp.description
        }))
      };

      const result = await saveResume(
        documentId || 0, // Use documentId if available, otherwise 0 for new document
        `${resumeData.personalInfo.fullName || 'Mein'} Lebenslauf`,
        apiData
        // template_id defaults to 8
      );

      toast.success(`Lebenslauf erfolgreich gespeichert! 🎉`);
      console.log('Resume saved:', result);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error(`Fehler beim Speichern: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
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

  // Show loading state while fetching document
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Lade Lebenslauf...</p>
          <p className="text-sm text-muted-foreground">Bitte warten Sie einen Moment</p>
        </div>
      </div>
    );
  }

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
      <div className="lg:w-1/2 flex flex-col min-h-0">
        {/* Progress Bar - Fixed at top */}
        <div className="flex-shrink-0 mb-6">
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

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 min-h-0">
          {/* Reload button for existing documents */}
          {documentId && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Bestehender Lebenslauf geladen</p>
                    <p className="text-xs text-muted-foreground">
                      Dokument ID: {documentId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadExistingDocument}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Neu laden
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drag & Drop Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">💡 Tipp: Reihenfolge ändern</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Du kannst die Reihenfolge deiner Ausbildung und Erfahrung ändern, indem du die Einträge per Drag & Drop verschiebst oder die Pfeil-Buttons verwendest. 
                    Die wichtigsten Stationen sollten oben stehen!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
              
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!isStepComplete(0)} // Only require personal info to be complete
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button
                  onClick={generateResume}
                  disabled={isGenerating || !Object.values(STEPS.slice(0, -1)).every((_, index) => isStepComplete(index))}
                  className="flex-1"
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
      </div>

      {/* Right Column - Preview */}
      <div className="lg:w-1/2 flex flex-col min-h-0">
        <Card className="h-full flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Live Vorschau
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              So sieht dein Lebenslauf aus
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 min-h-0">
            <div className="min-h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg p-8">
              <div className="text-center">
                <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm mb-2">Live Vorschau</p>
                <p className="text-xs text-gray-400">
                  {resumeData.personalInfo.fullName ? 
                    `Lebenslauf für ${resumeData.personalInfo.fullName}` : 
                    'Fülle die Formulare aus, um eine Vorschau zu sehen'
                  }
                </p>
                {resumeData.personalInfo.fullName && (
                  <div className="mt-4 text-left text-xs bg-white p-3 rounded border">
                    <h3 className="font-semibold mb-2">{resumeData.personalInfo.fullName}</h3>
                    <p className="text-gray-600 mb-1">{resumeData.personalInfo.email}</p>
                    <p className="text-gray-600 mb-1">{resumeData.personalInfo.location}</p>
                    {resumeData.education.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-xs">Ausbildung:</p>
                        <p className="text-gray-600 text-xs">{resumeData.education.length} Eintrag{resumeData.education.length !== 1 ? 'e' : ''}</p>
                      </div>
                    )}
                    {resumeData.experience.length > 0 && (
                      <div className="mt-1">
                        <p className="font-medium text-xs">Erfahrung:</p>
                        <p className="text-gray-600 text-xs">{resumeData.experience.length} Eintrag{resumeData.experience.length !== 1 ? 'e' : ''}</p>
                      </div>
                    )}
                    {resumeData.skills.length > 0 && (
                      <div className="mt-1">
                        <p className="font-medium text-xs">Skills:</p>
                        <p className="text-gray-600 text-xs">{resumeData.skills.length} Skill{resumeData.skills.length !== 1 ? 's' : ''}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 