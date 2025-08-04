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

    if (!data.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }

    if (!data.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Gültige E-Mail-Adresse erforderlich';
    }

    if (!data.adresse_city.trim()) {
      newErrors.adresse_city = 'Stadt ist erforderlich';
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
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              Vorname 🏷️
            </Label>
            <Input
              id="firstName"
              placeholder="z.B. Max"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={cn(
                errors.firstName && "border-red-500",
                "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              )}
              disabled={!isEditing}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Nachname 🏷️
            </Label>
            <Input
              id="lastName"
              placeholder="z.B. Mustermann"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={cn(
                errors.lastName && "border-red-500",
                "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              )}
              disabled={!isEditing}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
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
                 "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
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
               className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
               disabled={!isEditing}
             />
            <p className="text-xs text-muted-foreground">
              Optional - für direkten Kontakt
            </p>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">Adresse 📮</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="adresse_street" className="text-sm font-medium">
                Straße & Hausnummer
              </Label>
                             <Input
                 id="adresse_street"
                 placeholder="z.B. Musterstraße 123"
                 value={data.adresse_street || ''}
                 onChange={(e) => handleChange('adresse_street', e.target.value)}
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                 disabled={!isEditing}
               />
              <p className="text-xs text-muted-foreground">
                Optional - für vollständige Adresse
              </p>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="adresse_city" className="text-sm font-medium">
                Stadt 🏙️
              </Label>
              <Input
                id="adresse_city"
                placeholder="z.B. Berlin"
                value={data.adresse_city}
                onChange={(e) => handleChange('adresse_city', e.target.value)}
                                             className={cn(
                 errors.adresse_city && "border-red-500",
                 "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
               )}
                disabled={!isEditing}
              />
              {errors.adresse_city && (
                <p className="text-sm text-red-500">{errors.adresse_city}</p>
              )}
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label htmlFor="adresse_postcode" className="text-sm font-medium">
                Postleitzahl
              </Label>
                             <Input
                 id="adresse_postcode"
                 placeholder="z.B. 10115"
                 value={data.adresse_postcode || ''}
                 onChange={(e) => handleChange('adresse_postcode', e.target.value)}
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                 disabled={!isEditing}
               />
              <p className="text-xs text-muted-foreground">
                Optional - für vollständige Adresse
              </p>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="adresse_country" className="text-sm font-medium">
                Land
              </Label>
                             <Input
                 id="adresse_country"
                 placeholder="z.B. Deutschland"
                 value={data.adresse_country || ''}
                 onChange={(e) => handleChange('adresse_country', e.target.value)}
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                 disabled={!isEditing}
               />
              <p className="text-xs text-muted-foreground">
                Optional - Standard: Deutschland
              </p>
            </div>
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
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
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
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
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
                 className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
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