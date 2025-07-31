'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
  isLoading: boolean;
  initialData: ResumeData;
}

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

export function ResumeForm({ onSubmit, isLoading, initialData }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeData>(initialData);
  const [errors, setErrors] = useState<Partial<ResumeData>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ResumeData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Gültige E-Mail-Adresse erforderlich';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Standort ist erforderlich';
    }

    if (!formData.profession.trim()) {
      newErrors.profession = 'Berufsbezeichnung ist erforderlich';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Berufserfahrung ist erforderlich';
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Ausbildung ist erforderlich';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Fähigkeiten sind erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.fullName.trim() && 
                     formData.email.trim() && 
                     formData.location.trim() && 
                     formData.profession.trim() && 
                     formData.experience.trim() && 
                     formData.education.trim() && 
                     formData.skills.trim();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Lebenslauf Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Lass uns deinen perfekten Lebenslauf erstellen! 🚀
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">👤 Persönliche Daten</h3>
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Vollständiger Name 🏷️
              </Label>
              <Input
                id="fullName"
                placeholder="z.B. Max Mustermann"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={cn(errors.fullName && "border-red-500")}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-Mail 📧
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="max.mustermann@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(errors.email && "border-red-500")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefonnummer 📱
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+49 123 456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional - für direkten Kontakt
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Standort 📍
              </Label>
              <Input
                id="location"
                placeholder="z.B. Berlin, Deutschland"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={cn(errors.location && "border-red-500")}
                disabled={isLoading}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">💼 Berufliche Informationen</h3>
            
            {/* Profession */}
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium">
                Berufsbezeichnung 🎯
              </Label>
              <Input
                id="profession"
                placeholder="z.B. Senior Frontend Developer"
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className={cn(errors.profession && "border-red-500")}
                disabled={isLoading}
              />
              {errors.profession && (
                <p className="text-sm text-red-500">{errors.profession}</p>
              )}
            </div>

            {/* Target Position */}
            <div className="space-y-2">
              <Label htmlFor="targetPosition" className="text-sm font-medium">
                Gewünschte Position 🎯
              </Label>
              <Input
                id="targetPosition"
                placeholder="z.B. Team Lead, Product Manager..."
                value={formData.targetPosition}
                onChange={(e) => handleInputChange('targetPosition', e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional - hilft bei der Fokussierung
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium">
                Berufserfahrung 💼
              </Label>
              <Textarea
                id="experience"
                placeholder="Beschreibe deine relevanten Arbeitserfahrungen, Projekte und Erfolge..."
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={4}
                className={cn(errors.experience && "border-red-500")}
                disabled={isLoading}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience}</p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium">
                Ausbildung 🎓
              </Label>
              <Textarea
                id="education"
                placeholder="Deine Bildungsabschlüsse, Kurse, Zertifikate..."
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                rows={3}
                className={cn(errors.education && "border-red-500")}
                disabled={isLoading}
              />
              {errors.education && (
                <p className="text-sm text-red-500">{errors.education}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-medium">
                Fähigkeiten & Skills 💪
              </Label>
              <Textarea
                id="skills"
                placeholder="Technische Skills, Soft Skills, Tools, Sprachen..."
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                rows={3}
                className={cn(errors.skills && "border-red-500")}
                disabled={isLoading}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills}</p>
              )}
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label htmlFor="languages" className="text-sm font-medium">
                Sprachen 🌍
              </Label>
              <Input
                id="languages"
                placeholder="z.B. Deutsch (Muttersprache), Englisch (C1), Spanisch (B2)"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional - Sprachkenntnisse mit Niveau
              </p>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <Label htmlFor="certifications" className="text-sm font-medium">
                Zertifikate & Auszeichnungen 🏆
              </Label>
              <Textarea
                id="certifications"
                placeholder="Relevante Zertifikate, Auszeichnungen, Mitgliedschaften..."
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                rows={2}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional - macht dein Profil stärker
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wir erstellen deinen Lebenslauf... 🧠✍️
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Lebenslauf generieren 🚀
              </>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Fülle alle Pflichtfelder aus, um deinen Lebenslauf zu generieren
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 