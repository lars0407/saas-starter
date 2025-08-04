import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  onSkip: () => void
  firstName?: string
  lastName?: string
}

export function ProfileContent({
  onComplete,
  onSkip,
  firstName,
  lastName,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("personal")
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
    try {
      const onboardingData = localStorage.getItem('onboarding_data');
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        console.log('Auto-loading from onboarding_data:', parsed);
        
        if (parsed.profileData && parsed.profileData.personalInfo) {
          console.log('Auto-setting personal info:', parsed.profileData.personalInfo);
          
          // Ensure all fields are properly set, even if they're empty
          const personalData = {
            firstName: parsed.profileData.personalInfo.firstName || "",
            lastName: parsed.profileData.personalInfo.lastName || "",
            email: parsed.profileData.personalInfo.email || "",
            phone: parsed.profileData.personalInfo.phone || "",
            location: parsed.profileData.personalInfo.location || "",
            adresse_street: parsed.profileData.personalInfo.adresse_street || "",
            adresse_city: parsed.profileData.personalInfo.adresse_city || "",
            adresse_postcode: parsed.profileData.personalInfo.adresse_postcode || "",
            adresse_country: parsed.profileData.personalInfo.adresse_country || "",
            website: parsed.profileData.personalInfo.website || "",
            linkedin: parsed.profileData.personalInfo.linkedin || "",
            github: parsed.profileData.personalInfo.github || "",
            summary: parsed.profileData.personalInfo.summary || "",
          };
          
          console.log('Auto-setting complete personal data:', personalData);
          setPersonalInfo(personalData);
          setEducation(parsed.profileData.education || []);
          setExperience(parsed.profileData.experience || []);
          setSkills(parsed.profileData.skills || []);
        }
      }
    } catch (error) {
      console.error('Error in auto-load:', error);
    }
  }, []);

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
    <div className="h-[60vh] flex flex-col">
      <div className="text-center flex-shrink-0 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Profil erstellen
        </h3>
        <p className="text-gray-600">
          Fülle deine persönlichen Informationen aus, um dein Profil zu erstellen.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-4 flex-shrink-0 mb-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Persönlich
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Ausbildung
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Erfahrung
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Fähigkeiten
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="personal" className="h-full overflow-y-auto">
            <PersonalInfo 
              data={personalInfo} 
              onChange={handlePersonalInfoChange} 
              isEditing={true} 
            />
          </TabsContent>

          <TabsContent value="education" className="h-full overflow-y-auto">
            <Education 
              data={education} 
              onChange={handleEducationChange} 
              isEditing={true} 
            />
          </TabsContent>

          <TabsContent value="experience" className="h-full overflow-y-auto">
            <Experience 
              data={experience} 
              onChange={handleExperienceChange} 
              isEditing={true} 
            />
          </TabsContent>

          <TabsContent value="skills" className="h-full overflow-y-auto">
            <Skills 
              data={skills} 
              onChange={handleSkillsChange} 
              isEditing={true} 
            />
          </TabsContent>
        </div>
      </Tabs>

             <div className="flex justify-between pt-4 border-t flex-shrink-0 mt-4">
         <Button variant="outline" onClick={handleSkip} className="text-gray-600 hover:text-gray-800">
           Überspringen
         </Button>
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