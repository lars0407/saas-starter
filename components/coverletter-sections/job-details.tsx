'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobDetailsData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobLink?: string;
}

interface JobDetailsProps {
  data: JobDetailsData;
  onChange: (data: JobDetailsData) => void;
  isEditing: boolean;
}

export function JobDetails({ data, onChange, isEditing }: JobDetailsProps) {
  const [formData, setFormData] = useState<JobDetailsData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof JobDetailsData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Informationen über die Stelle
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
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
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
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
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
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
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
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
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
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
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
          <p className="text-xs text-muted-foreground">
            Optional - wir analysieren die Stellenanzeige für bessere Ergebnisse
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 