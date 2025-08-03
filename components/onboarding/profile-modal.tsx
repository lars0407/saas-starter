"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PersonalInfo } from "@/components/resume-sections/personal-info"
import { Education } from "@/components/resume-sections/education"
import { Experience } from "@/components/resume-sections/experience"
import { Skills } from "@/components/resume-sections/skills"
import { Certifications } from "@/components/resume-sections/certifications"
import { Courses } from "@/components/resume-sections/courses"
import { Publications } from "@/components/resume-sections/publications"
import { Interests } from "@/components/resume-sections/interests"
import { User, GraduationCap, Briefcase, Zap, Award, BookOpen, Heart, AlertTriangle } from "lucide-react"

// Import interfaces
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

import type { CertificationEntry } from "@/components/resume-sections/certifications"
import type { CourseEntry } from "@/components/resume-sections/courses"
import type { PublicationEntry } from "@/components/resume-sections/publications"
import type { InterestEntry } from "@/components/resume-sections/interests"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (profileData: any) => void
}

export function ProfileModal({
  isOpen,
  onClose,
  onComplete,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false)

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
  const [certifications, setCertifications] = useState<CertificationEntry[]>([])
  const [courses, setCourses] = useState<CourseEntry[]>([])
  const [publications, setPublications] = useState<PublicationEntry[]>([])
  const [interests, setInterests] = useState<InterestEntry[]>([])

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

  const handleCertificationsChange = (data: CertificationEntry[]) => {
    setCertifications(data)
  }

  const handleCoursesChange = (data: CourseEntry[]) => {
    setCourses(data)
  }

  const handlePublicationsChange = (data: PublicationEntry[]) => {
    setPublications(data)
  }

  const handleInterestsChange = (data: InterestEntry[]) => {
    setInterests(data)
  }

  const handleSave = () => {
    const profileData = {
      personalInfo,
      education,
      experience,
      skills,
      certifications,
      courses,
      publications,
      interests,
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Profil erstellen
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fülle deine persönlichen Informationen aus, um dein Profil zu erstellen.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
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

            <div className="mt-6">
              <TabsContent value="personal">
                <PersonalInfo 
                  data={personalInfo} 
                  onChange={handlePersonalInfoChange} 
                  isEditing={true} 
                />
              </TabsContent>

              <TabsContent value="education">
                <Education 
                  data={education} 
                  onChange={handleEducationChange} 
                  isEditing={true} 
                />
              </TabsContent>

              <TabsContent value="experience">
                <Experience 
                  data={experience} 
                  onChange={handleExperienceChange} 
                  isEditing={true} 
                />
              </TabsContent>

              <TabsContent value="skills">
                <Skills 
                  data={skills} 
                  onChange={handleSkillsChange} 
                  isEditing={true} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleSkip} className="text-gray-600 hover:text-gray-800">
            Überspringen
          </Button>
          <Button onClick={handleSave} className="bg-[#0F973D] hover:bg-[#0D7A32] text-white">
            Profil speichern
          </Button>
        </div>
      </DialogContent>

      {/* Skip Confirmation Modal */}
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
    </Dialog>
  )
} 