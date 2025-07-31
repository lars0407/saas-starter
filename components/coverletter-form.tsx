'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoverLetterFormProps {
  onSubmit: (data: CoverLetterData) => void;
  isLoading: boolean;
  initialData: CoverLetterData;
}

interface CoverLetterData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
}

export function CoverLetterForm({ onSubmit, isLoading, initialData }: CoverLetterFormProps) {
  const [formData, setFormData] = useState<CoverLetterData>(initialData);
  const [errors, setErrors] = useState<Partial<CoverLetterData>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CoverLetterData> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Titel der Stelle ist erforderlich';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Unternehmen ist erforderlich';
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

  const handleInputChange = (field: keyof CoverLetterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.jobTitle.trim() && formData.company.trim();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Anschreiben Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Lass uns dein perfektes Anschreiben erstellen! 🚀
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium">
              Titel der Stelle 🎯
            </Label>
            <Input
              id="jobTitle"
              placeholder="z.B. Frontend Developer, Marketing Manager..."
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className={cn(errors.jobTitle && "border-red-500")}
              disabled={isLoading}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-500">{errors.jobTitle}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Unternehmen 🏢
            </Label>
            <Input
              id="company"
              placeholder="z.B. Google, Microsoft, Startup XYZ..."
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={cn(errors.company && "border-red-500")}
              disabled={isLoading}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company}</p>
            )}
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <Label htmlFor="strengths" className="text-sm font-medium">
              Deine Stärken 💪
            </Label>
            <Textarea
              id="strengths"
              placeholder="Was macht dich besonders? z.B. Teamführung, technische Skills, Kreativität..."
              value={formData.strengths}
              onChange={(e) => handleInputChange('strengths', e.target.value)}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Optional - hilft der KI, dein Anschreiben zu personalisieren
            </p>
          </div>

          {/* Motivation */}
          <div className="space-y-2">
            <Label htmlFor="motivation" className="text-sm font-medium">
              Deine Motivation 🎯
            </Label>
            <Textarea
              id="motivation"
              placeholder="Warum willst du diesen Job? Was reizt dich an dem Unternehmen?"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Optional - macht dein Anschreiben authentischer
            </p>
          </div>

          {/* Job Link */}
          <div className="space-y-2">
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
            <p className="text-xs text-muted-foreground">
              Optional - wir analysieren die Stellenanzeige für bessere Ergebnisse
            </p>
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
                Wir schreiben dein Meisterwerk... 🧠✍️
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