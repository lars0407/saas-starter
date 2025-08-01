"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Save, FileText, GraduationCap, Briefcase, Zap } from "lucide-react"
import { PersonalInfo } from "@/components/resume-sections/personal-info"
import { Education } from "@/components/resume-sections/education"
import { Experience } from "@/components/resume-sections/experience"
import { Skills } from "@/components/resume-sections/skills"

// Import the interfaces from the resume sections
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

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Resume data state
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

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Lebenslauf wurde aktualisiert. Sieht gut aus! 💅")
      setHasChanges(false)
    } catch (error) {
      toast.error("Uups, da lief was schief. Probier's nochmal.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePersonalInfoChange = (data: PersonalInfoData) => {
    setPersonalInfo(data)
    setHasChanges(true)
  }

  const handleEducationChange = (data: EducationEntry[]) => {
    setEducation(data)
    setHasChanges(true)
  }

  const handleExperienceChange = (data: ExperienceEntry[]) => {
    setExperience(data)
    setHasChanges(true)
  }

  const handleSkillsChange = (data: Skill[]) => {
    setSkills(data)
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Resume Sections */}
      <div className="space-y-6">
        {/* Basics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Deine grundlegenden Informationen für den Lebenslauf
            </p>
          </CardHeader>
          <CardContent>
            <PersonalInfo 
              data={personalInfo} 
              onChange={handlePersonalInfoChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Ausbildung
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Deine Bildungsweg und Qualifikationen
            </p>
          </CardHeader>
          <CardContent>
            <Education 
              data={education} 
              onChange={handleEducationChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Berufserfahrung
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Deine bisherigen Arbeitserfahrungen und Positionen
            </p>
          </CardHeader>
          <CardContent>
            <Experience 
              data={experience} 
              onChange={handleExperienceChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fähigkeiten & Skills
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Deine technischen und soft Skills, Sprachen und Tools
            </p>
          </CardHeader>
          <CardContent>
            <Skills 
              data={skills} 
              onChange={handleSkillsChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="bg-[#0F973D] hover:bg-[#0D7A32] text-white w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Speichern..." : "Lebenslauf speichern"}
          </Button>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-blue-900">Profil-Tipp 💡</h3>
              <p className="text-sm text-blue-700 mt-1">
                Ein vollständiger Lebenslauf hilft der KI dabei, dir bessere Jobvorschläge zu machen. 
                Je mehr Infos, desto smarter die Empfehlungen!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 