"use client"

import React, { useState, useEffect } from "react"
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
import { onboardingProfileStorage, OnboardingProfileData } from "@/lib/localStorage"

// Import interfaces
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

import type { CertificationEntry } from "@/components/resume-sections/certifications"
import type { CourseEntry } from "@/components/resume-sections/courses"
import type { PublicationEntry } from "@/components/resume-sections/publications"
import type { InterestEntry } from "@/components/resume-sections/interests"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (profileData: any) => void
  initialData?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

// Helper function to transform component data to target format
const transformToTargetFormat = (
  personalInfo: PersonalInfoData,
  education: EducationEntry[],
  experience: ExperienceEntry[],
  skills: Skill[],
  certifications: CertificationEntry[],
  courses: CourseEntry[],
  publications: PublicationEntry[],
  interests: InterestEntry[]
): OnboardingProfileData => {
  // Use separate first name and last name fields
  const firstName = personalInfo.firstName.trim();
  const surname = personalInfo.lastName.trim();

  // Transform links
  const links = [];
  if (personalInfo.website) {
    links.push({ url: personalInfo.website, label: 'Website' });
  }
  if (personalInfo.linkedin) {
    links.push({ url: personalInfo.linkedin, label: 'LinkedIn' });
  }
  if (personalInfo.github) {
    links.push({ url: personalInfo.github, label: 'GitHub' });
  }

  // Transform skills
  const transformedSkills = skills.map(skill => ({
    label: skill.category,
    skill: skill.name
  }));

  // Transform education
  const transformedEducation = education.map(edu => ({
    grade: edu.gpa || '',
    degree: edu.degree,
    school: edu.institution,
    endDate: edu.endDate,
    subject: edu.field,
    startDate: edu.startDate,
    description: edu.description || '',
    location_city: edu.location.split(',')[0]?.trim() || '',
    location_country: edu.location.split(',').slice(1).join(',').trim() || ''
  }));

  // Transform experience
  const transformedExperience = experience.map(exp => ({
    title: exp.position,
    company: exp.company,
    endDate: exp.endDate,
    location: exp.location,
    startDate: exp.startDate,
    description: exp.description
  }));

  // Transform certifications
  const transformedCertifications = certifications.map(cert => ({
    name: cert.name || '',
    organization: cert.issuer || '',
    endDate: '', // Not available in CertificationEntry
    issue_date: cert.issueDate || '',
  }));

  // Transform courses
  const transformedCourses = courses.map(course => ({
    courseTitle: course.title || '',
    provider: course.provider || '',
    startDate: course.startDate || '',
    endDate: course.endDate || '',
    duration: course.duration || '',
    certificate: course.certificate || '',
    description: course.description || '',
    skillsLearned: course.skills || [],
  }));

  // Transform publications
  const transformedPublications = publications.map(pub => ({
    title: pub.title || '',
    type: pub.type || '',
    authors: Array.isArray(pub.authors) ? pub.authors : [pub.authors || ''],
    publicationDate: pub.publicationDate || '',
    journal: pub.journal || '',
    doi: pub.doi || '',
    publisher: pub.publisher || '',
    url: pub.url || '',
    abstract: pub.abstract || '',
  }));

  // Transform interests
  const transformedInterests = interests.map(interest => ({
    name: interest.name || '',
    category: interest.category || '',
    description: interest.description || '',
  }));

  return {
    link: links,
    skill: transformedSkills,
    basics: {
      email: personalInfo.email,
      image: '', // Not currently supported in the form
      surname: surname,
      birthdate: '', // Not currently supported in the form
      telephone: personalInfo.phone || '',
      first_name: firstName,
      description: personalInfo.summary || '',
      nationality: '', // Not currently supported in the form
      gender: '', // Not currently supported in the form
      title_after: '', // Not currently supported in the form
      adresse_city: personalInfo.adresse_city,
      title_before: '', // Not currently supported in the form
      adresse_street: personalInfo.adresse_street || '',
      adresse_country: personalInfo.adresse_country || '',
      adresse_postcode: personalInfo.adresse_postcode || ''
    },
    language: [], // Not currently supported in the form
    education: transformedEducation,
    experience: transformedExperience,
    certifications: transformedCertifications,
    courses: transformedCourses,
    publications: transformedPublications,
    interests: transformedInterests
  };
};

// Helper function to transform target format to component data
const transformFromTargetFormat = (targetData: OnboardingProfileData) => {
  // Use separate first name and last name fields
  const firstName = targetData.basics.first_name;
  const lastName = targetData.basics.surname;
  
  // Find website, LinkedIn, and GitHub from links
  const website = targetData.link.find(link => link.label === 'Website')?.url || '';
  const linkedin = targetData.link.find(link => link.label === 'LinkedIn')?.url || '';
  const github = targetData.link.find(link => link.label === 'GitHub')?.url || '';

  const personalInfo: PersonalInfoData = {
    firstName: firstName || '',
    lastName: lastName || '',
    email: targetData.basics.email || '',
    phone: targetData.basics.telephone || '',
    location: targetData.basics.adresse_city || '',
    adresse_street: targetData.basics.adresse_street || '',
    adresse_city: targetData.basics.adresse_city || '',
    adresse_postcode: targetData.basics.adresse_postcode || '',
    adresse_country: targetData.basics.adresse_country || '',
    website: website,
    linkedin: linkedin,
    github: github,
    summary: targetData.basics.description || '',
  };

  // Transform education back
  const education: EducationEntry[] = targetData.education.map((edu, index) => ({
    id: `edu-${index}`,
    institution: edu.school,
    degree: edu.degree,
    field: edu.subject,
    location: `${edu.location_city}, ${edu.location_country}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
    startDate: edu.startDate,
    endDate: edu.endDate,
    current: false, // Not supported in target format
    description: edu.description,
    gpa: edu.grade,
  }));

  // Transform experience back
  const experience: ExperienceEntry[] = targetData.experience.map((exp, index) => ({
    id: `exp-${index}`,
    company: exp.company,
    position: exp.title,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate,
    current: false, // Not supported in target format
    description: exp.description,
    achievements: [], // Not supported in target format
  }));

  // Transform skills back
  const skills: Skill[] = targetData.skill.map((skill, index) => ({
    id: `skill-${index}`,
    name: skill.skill,
    category: skill.label as 'technical' | 'soft' | 'language' | 'tool',
    level: 'intermediate', // Default level since not supported in target format
  }));

  // Transform certifications back
  const certifications: CertificationEntry[] = targetData.certifications.map((cert, index) => ({
    id: `cert-${index}`,
    name: cert.name,
    issuer: cert.organization,
    issueDate: cert.issue_date,
    description: '', // Not available in target format
  }));

  // Transform courses back
  const courses: CourseEntry[] = targetData.courses.map((course, index) => ({
    id: `course-${index}`,
    title: course.courseTitle,
    provider: course.provider,
    startDate: course.startDate,
    endDate: course.endDate,
    duration: course.duration,
    certificate: course.certificate,
    description: course.description,
    skills: course.skillsLearned,
  }));

  // Transform publications back
  const publications: PublicationEntry[] = targetData.publications.map((pub, index) => ({
    id: `pub-${index}`,
    title: pub.title,
    type: pub.type as any,
    authors: Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors,
    publicationDate: pub.publicationDate,
    journal: pub.journal,
    doi: pub.doi,
    publisher: pub.publisher,
    url: pub.url,
    abstract: pub.abstract,
  }));

  // Transform interests back
  const interests: InterestEntry[] = targetData.interests.map((interest, index) => ({
    id: `interest-${index}`,
    name: interest.name,
    category: interest.category as any,
    description: interest.description,
  }));

  return {
    personalInfo,
    education,
    experience,
    skills,
    certifications,
    courses,
    publications,
    interests,
  };
};

export function ProfileModal({
  isOpen,
  onClose,
  onComplete,
  initialData,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false)

  // Profile data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
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

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isOpen) {
      // First, try to load parsed resume data if available
      try {
        const parsedResumeData = localStorage.getItem('onboarding_parsed_resume');
        if (parsedResumeData) {
          const parsed = JSON.parse(parsedResumeData);
          console.log('Loading parsed resume data:', parsed);
          
          if (parsed.basics) {
            setPersonalInfo(parsed.basics);
            setEducation(parsed.education || []);
            setExperience(parsed.experience || []);
            setSkills(parsed.skills || []);
            setCertifications(parsed.certifications || []);
            setCourses(parsed.courses || []);
            setPublications(parsed.publications || []);
            setInterests(parsed.interests || []);
            
            // Clear the parsed resume data from localStorage since we've loaded it
            localStorage.removeItem('onboarding_parsed_resume');
            return; // Don't load other data sources
          }
        }
      } catch (error) {
        console.error('Error loading parsed resume data:', error);
      }

      // Fallback to regular saved data
      const savedData = onboardingProfileStorage.load();
      console.log('Loaded data from localStorage:', savedData);
      
      if (savedData) {
        try {
          // Check if data is in old format (with fullName) and migrate if needed
          if (savedData.basics && !savedData.basics.first_name && !savedData.basics.surname) {
            console.log('Migrating old data format...');
            // Clear old data and start fresh
            onboardingProfileStorage.clear();
            return;
          }
          
          const transformedData = transformFromTargetFormat(savedData as OnboardingProfileData);
          console.log('Transformed data:', transformedData);
          setPersonalInfo(transformedData.personalInfo);
          setEducation(transformedData.education);
          setExperience(transformedData.experience);
          setSkills(transformedData.skills);
          setCertifications(transformedData.certifications);
          setCourses(transformedData.courses);
          setPublications(transformedData.publications);
          setInterests(transformedData.interests);
        } catch (error) {
          console.error('Error loading saved profile data:', error);
        }
      } else if (initialData) {
        // If no saved data but we have initial data, use that
        console.log('Using initial data:', initialData);
        setPersonalInfo(prev => ({
          ...prev,
          firstName: initialData.firstName || prev.firstName,
          lastName: initialData.lastName || prev.lastName,
          email: initialData.email || prev.email,
        }));
      }

      // Also try to load data from onboarding context
      try {
        const onboardingData = localStorage.getItem('onboarding_data');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          console.log('Found onboarding data:', parsed);
          
          if (parsed.profileData && parsed.profileData.personalInfo) {
            console.log('Loading from onboarding profile data:', parsed.profileData);
            const personalData = parsed.profileData.personalInfo;
            console.log('Setting personal info:', personalData);
            setPersonalInfo(personalData);
            setEducation(parsed.profileData.education || []);
            setExperience(parsed.profileData.experience || []);
            setSkills(parsed.profileData.skills || []);
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    }
  }, [isOpen, initialData]);



  // Save data to localStorage whenever any data changes
  useEffect(() => {
    if (isOpen) {
      const targetData = transformToTargetFormat(
        personalInfo, 
        education, 
        experience, 
        skills, 
        certifications, 
        courses, 
        publications, 
        interests
      );
      onboardingProfileStorage.save(targetData);
    }
  }, [personalInfo, education, experience, skills, certifications, courses, publications, interests, isOpen]);

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
    const targetData = transformToTargetFormat(
      personalInfo, 
      education, 
      experience, 
      skills, 
      certifications, 
      courses, 
      publications, 
      interests
    );
    onComplete(targetData)
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} className="text-gray-600 hover:text-gray-800">
              Überspringen
            </Button>
          </div>
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