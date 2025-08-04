import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, GraduationCap, Briefcase, Zap } from "lucide-react"
import { PersonalInfo } from "../resume-sections/personal-info"
import { Education } from "../resume-sections/education"
import { Experience } from "../resume-sections/experience"
import { Skills } from "../resume-sections/skills"

// Types from profile-modal.tsx
interface PersonalInfoData {
  fullName: string;
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
}

export function ProfileContent({
  onComplete,
  onSkip,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("personal")

  // Profile data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: "",
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
        <Button variant="outline" onClick={onSkip} className="text-gray-600 hover:text-gray-800">
          Überspringen
        </Button>
        <Button onClick={handleSave} className="bg-[#0F973D] hover:bg-[#0D7A32] text-white">
          Profil speichern
        </Button>
      </div>
    </div>
  )
} 