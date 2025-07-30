'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CoverLetterFormData {
  role: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
}

interface CoverLetterFormProps {
  onSubmit: (data: CoverLetterFormData) => Promise<void>;
  isLoading: boolean;
  initialData: CoverLetterFormData;
}

export function CoverLetterForm({ onSubmit, isLoading, initialData }: CoverLetterFormProps) {
  const [formData, setFormData] = useState<CoverLetterFormData>(initialData);
  const [errors, setErrors] = useState<Partial<CoverLetterFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CoverLetterFormData> = {};

    if (!formData.role.trim()) {
      newErrors.role = 'Titel der Stelle ist erforderlich';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Unternehmen ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CoverLetterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.role.trim() && formData.company.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Anschreiben Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium">
                Titel der Stelle 🎯
              </Label>
              <Input
                id="role"
                placeholder="z.B. Frontend Developer, Marketing Manager..."
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={errors.role ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium">
                Unternehmen 🏢
              </Label>
              <Input
                id="company"
                placeholder="z.B. Google, Microsoft, Startup XYZ..."
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={errors.company ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="strengths" className="text-sm font-medium">
                Deine Stärken 💪
              </Label>
              <Textarea
                id="strengths"
                placeholder="Was macht dich besonders? z.B. Teamplayer, analytisches Denken, Kreativität..."
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="motivation" className="text-sm font-medium">
                Deine Motivation ✨
              </Label>
              <Textarea
                id="motivation"
                placeholder="Warum willst du diesen Job? Was motiviert dich?"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="jobLink" className="text-sm font-medium">
                Job-Link 🔍
              </Label>
              <Input
                id="jobLink"
                type="url"
                placeholder="https://..."
                value={formData.jobLink}
                onChange={(e) => handleInputChange('jobLink', e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - wir analysieren die Stellenanzeige für bessere Ergebnisse
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#0F973D] hover:bg-[#0D7A32] text-white"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                KI denkt nach...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Anschreiben generieren 🚀
              </>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Fülle mindestens Titel und Unternehmen aus, um zu starten
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 