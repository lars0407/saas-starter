import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, GraduationCap, Briefcase, Zap, AlertTriangle } from "lucide-react"
import { PersonalInfo } from "../resume-sections/personal-info"
import { Education } from "../resume-sections/education"
import { Experience } from "../resume-sections/experience"
import { Skills } from "../resume-sections/skills"

// Types from profile-modal.tsx
interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  adresse_street?: string;
  adresse_city: string;
  adresse_postcode?: string;
  adresse_country?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface ProfileContentProps {
  onComplete: (profileData: any) => void
  onSkip?: () => void
  onBack?: () => void
  firstName?: string
  lastName?: string
}

export function ProfileContent({
  onComplete,
  onSkip,
  onBack,
  firstName,
  lastName,
}: ProfileContentProps) {
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false)

  // Profile data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: firstName || "",
    lastName: lastName || "",
    email: "",
    phone: "",
    location: "",
    adresse_street: "",
    adresse_city: "",
    adresse_postcode: "",
    adresse_country: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  })

  const [education, setEducation] = useState<EducationEntry[]>([])
  const [experience, setExperience] = useState<ExperienceEntry[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  // Load data from localStorage on component mount
  React.useEffect(() => {
    // First, try to load parsed resume data if available
    try {
      const parsedResumeData = localStorage.getItem('onboarding_parsed_resume');
      if (parsedResumeData) {
        const parsed = JSON.parse(parsedResumeData);
        console.log('ProfileContent: Loading parsed resume data:', parsed);
        
        if (parsed.basics) {
          console.log('ProfileContent: Setting personal info from parsed resume:', parsed.basics);
          setPersonalInfo({
            firstName: parsed.basics.first_name || firstName || "",
            lastName: parsed.basics.surname || lastName || "",
            email: parsed.basics.email || "",
            phone: parsed.basics.telephone || "",
            location: parsed.basics.adresse_city || "",
            adresse_street: parsed.basics.adresse_street || "",
            adresse_city: parsed.basics.adresse_city || "",
            adresse_postcode: parsed.basics.adresse_postcode || "",
            adresse_country: parsed.basics.adresse_country || "",
            website: parsed.link?.find((l: any) => l.label === 'website')?.url || "",
            linkedin: parsed.link?.find((l: any) => l.label === 'linkedin')?.url || "",
            github: parsed.link?.find((l: any) => l.label === 'github')?.url || "",
            summary: parsed.basics.description || "",
          });
          
          // Transform education data
          const transformedEducation: EducationEntry[] = (parsed.education || []).map((edu: any, index: number) => ({
            id: `edu-${index}`,
            institution: edu.school || "",
            degree: edu.degree || "",
            field: edu.subject || "",
            location: `${edu.location_city || ''}, ${edu.location_country || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            current: false,
            description: edu.description || "",
            gpa: edu.grade || "",
          }));
          
          console.log('ProfileContent: Setting education from parsed resume:', transformedEducation);
          setEducation(transformedEducation);
          
          // Transform experience data
          const transformedExperience: ExperienceEntry[] = (parsed.experience || []).map((exp: any, index: number) => ({
            id: `exp-${index}`,
            company: exp.company || "",
            position: exp.title || "",
            location: exp.location || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            current: false,
            description: exp.description || "",
            achievements: exp.achievements || [],
          }));
          
          console.log('ProfileContent: Setting experience from parsed resume:', transformedExperience);
          setExperience(transformedExperience);
          
          // Transform skills data
          const transformedSkills: Skill[] = (parsed.skill || []).map((skill: any, index: number) => ({
            id: `skill-${index}`,
            name: typeof skill.skill === 'number' ? skill.skill.toString() : skill.skill || "",
            category: (skill.label || 'technical') as 'technical' | 'soft' | 'language' | 'tool',
            level: 'intermediate',
          }));
          
          console.log('ProfileContent: Setting skills from parsed resume:', transformedSkills);
          setSkills(transformedSkills);
          
          // Clear the parsed resume data from localStorage since we've loaded it
          localStorage.removeItem('onboarding_parsed_resume');
          console.log('ProfileContent: Cleared onboarding_parsed_resume from localStorage');
          return; // Don't load other data sources
        }
      }
    } catch (error) {
      console.error('ProfileContent: Error loading parsed resume data:', error);
    }

    // Fallback to regular saved data
    try {
      const onboardingData = localStorage.getItem('onboarding_data');
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        console.log('ProfileContent: Found onboarding data:', parsed);
        
        if (parsed.profileData && parsed.profileData.personalInfo) {
          console.log('ProfileContent: Loading from onboarding profile data:', parsed.profileData);
          const personalData = parsed.profileData.personalInfo;
          console.log('ProfileContent: Setting personal info:', personalData);
          setPersonalInfo(personalData);
          setEducation(parsed.profileData.education || []);
          setExperience(parsed.profileData.experience || []);
          setSkills(parsed.profileData.skills || []);
        }
      }
    } catch (error) {
      console.error('ProfileContent: Error loading onboarding data:', error);
    }
  }, [firstName, lastName]);

  const handlePersonalInfoChange = (data: PersonalInfoData) => {
    setPersonalInfo(data)
  }

  const handleEducationChange = (data: EducationEntry[]) => {
    setEducation(data)
  }

  const handleExperienceChange = (data: ExperienceEntry[]) => {
    setExperience(data)
  }

  const handleSkillsChange = (data: Skill[]) => {
    setSkills(data)
  }

  const handleSave = () => {
    const profileData = {
      personalInfo,
      education,
      experience,
      skills,
    }
    onComplete(profileData)
  }

  const handleSkip = () => {
    setShowSkipConfirmation(true)
  }

  const handleSkipConfirm = () => {
    setShowSkipConfirmation(false)
    onComplete({ method: 'skipped' })
  }

  const handleSkipCancel = () => {
    setShowSkipConfirmation(false)
  }

  return (
    <div className="space-y-6 [&_[data-slot=card]]:md:border [&_[data-slot=card]]:border-0 [&_.border.rounded-lg]:md:border [&_.border.rounded-lg]:border-0">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Profil vervollständigen
        </h2>
        <p className="text-gray-600">
          Ergänze deine Informationen, damit wir dir die besten Jobangebote zeigen können.
        </p>
      </div>

      {/* All sections in a single scrollable flow */}
      <div className="space-y-8 pb-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 md:border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Persönlich</h4>
          </div>
          <PersonalInfo 
            data={personalInfo} 
            onChange={handlePersonalInfoChange} 
            isEditing={true} 
          />
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 md:border-b border-gray-200">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Ausbildung</h4>
          </div>
          <Education 
            data={education} 
            onChange={handleEducationChange} 
            isEditing={true} 
          />
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 md:border-b border-gray-200">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Erfahrung</h4>
          </div>
          <Experience 
            data={experience} 
            onChange={handleExperienceChange} 
            isEditing={true} 
          />
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 md:border-b border-gray-200">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Fähigkeiten</h4>
          </div>
          <Skills 
            data={skills} 
            onChange={handleSkillsChange} 
            isEditing={true} 
          />
        </div>
      </div>

      {/* Buttons now part of the scrollable content */}
      <div className="flex justify-between pt-4 md:border-t border-gray-100 mt-6">
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="text-gray-600 hover:text-gray-800">
              Zurück
            </Button>
          )}
          <Button variant="outline" onClick={handleSkip} className="text-gray-600 hover:text-gray-800">
            Überspringen
          </Button>
        </div>
        <Button onClick={handleSave} className="bg-[#0F973D] hover:bg-[#0D7A32] text-white">
          Profil speichern
        </Button>
      </div>

      {/* Skip Confirmation Dialog */}
      <Dialog open={showSkipConfirmation} onOpenChange={handleSkipCancel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Moment mal! 🤔
              </DialogTitle>
            </div>
            <div className="text-gray-600 text-left">
              <div className="mb-4">
                <strong>Hey, bevor du das überspringst:</strong>
              </div>
              <div className="mb-3">
                Dein Profil ist <span className="font-semibold text-[#0F973D]">super wichtig</span> für unsere KI! 🤖✨
              </div>
              <div className="mb-3">
                <strong>Warum?</strong> Ohne deine Infos kann die KI:
              </div>
              <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
                <li>❌ Keine personalisierten Job-Vorschläge machen</li>
                <li>❌ Deine Skills nicht richtig einschätzen</li>
                <li>❌ Passende Anschreiben generieren</li>
                <li>❌ Deine Erfahrung berücksichtigen</li>
              </ul>
              <div className="text-sm text-gray-500">
                <strong>Pro-Tipp:</strong> Nimm dir 2-3 Minuten Zeit - es lohnt sich! 💪
              </div>
            </div>
          </DialogHeader>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleSkipCancel} className="flex-1">
              Zurück zum Profil
            </Button>
            <Button onClick={handleSkipConfirm} variant="destructive" className="flex-1">
              Trotzdem überspringen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 