'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalInfoData {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

interface PersonalInfoProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  isEditing?: boolean;
}

export function PersonalInfo({ data, onChange, isEditing = true }: PersonalInfoProps) {
  const [errors, setErrors] = useState<Partial<PersonalInfoData>>({});

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<PersonalInfoData> = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Name ist erforderlich';
    }

    if (!data.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Gültige E-Mail-Adresse erforderlich';
    }

    if (!data.location.trim()) {
      newErrors.location = 'Standort ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Hey, stell dich kurz vor 👋
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deine Basics - damit Recruiter dich kennenlernen können
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Vollständiger Name 🏷️
            </Label>
            <Input
              id="fullName"
              placeholder="z.B. Max Mustermann"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={cn(
                errors.fullName && "border-red-500",
                "focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20"
              )}
              disabled={!isEditing}
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
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={cn(
                errors.email && "border-red-500",
                "focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20"
              )}
              disabled={!isEditing}
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
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20"
              disabled={!isEditing}
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
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={cn(
                errors.location && "border-red-500",
                "focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20"
              )}
              disabled={!isEditing}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">Socials & Links 🌐</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://..."
                value={data.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20"
                disabled={!isEditing}
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={data.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github" className="text-sm font-medium flex items-center gap-1">
                <Github className="h-3 w-3" />
                GitHub
              </Label>
              <Input
                id="github"
                type="url"
                placeholder="https://github.com/..."
                value={data.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            Kurze Zusammenfassung 💬
          </Label>
          <Textarea
            id="summary"
            placeholder="Erzähl in 2-3 Sätzen, was dich ausmacht und was du suchst..."
            value={data.summary || ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            rows={3}
            disabled={!isEditing}
          />
          <p className="text-xs text-muted-foreground">
            Optional - macht dein Profil persönlicher
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 