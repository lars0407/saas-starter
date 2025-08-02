'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Sparkles, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobDetailsData {
  jobTitle: string;
  company: string;
  strengths?: string;
  motivation?: string;
  jobDescription?: string;
}

interface JobDetailsProps {
  data: JobDetailsData;
  onChange: (data: JobDetailsData) => void;
  isEditing: boolean;
  onGenerateWithAI?: () => void;
  isGenerating?: boolean;
}

export function JobDetails({ data, onChange, isEditing, onGenerateWithAI, isGenerating }: JobDetailsProps) {
  const [formData, setFormData] = useState<JobDetailsData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof JobDetailsData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const hasRequiredData = formData.jobTitle.trim() && formData.company.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Details - Optional für KI-Generierung
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fülle diese Felder aus, um ein personalisiertes Anschreiben mit KI zu generieren
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-1">KI-generiertes Anschreiben</p>
              <p className="text-blue-700">
                Fülle mindestens Job-Titel und Unternehmen aus, um ein personalisiertes Anschreiben mit KI zu generieren. 
                Je mehr Details du angibst, desto besser wird das Ergebnis.
              </p>
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium">
            Titel der Stelle 🎯 <span className="text-red-500">*</span>
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
            Unternehmen 🏢 <span className="text-red-500">*</span>
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
            Deine Stärken 💪 <span className="text-gray-500 text-xs">(Optional)</span>
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
            Hilft der KI, dein Anschreiben zu personalisieren
          </p>
        </div>

        {/* Motivation */}
        <div className="space-y-2">
          <Label htmlFor="motivation" className="text-sm font-medium">
            Deine Motivation 🎯 <span className="text-gray-500 text-xs">(Optional)</span>
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
            Macht dein Anschreiben authentischer und überzeugender
          </p>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-sm font-medium">
            Stellenanzeige 📋 <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <Textarea
            id="jobDescription"
            placeholder="Füge hier den Text der Stellenanzeige ein. Die KI analysiert die Anforderungen und passt dein Anschreiben entsprechend an..."
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            rows={4}
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
          <p className="text-xs text-muted-foreground">
            Kopiere den Text der Stellenanzeige hier hinein für optimale Ergebnisse
          </p>
        </div>

        {/* AI Generation Button */}
        {isEditing && hasRequiredData && (
          <div className="pt-4 border-t">
            <Button
              onClick={onGenerateWithAI}
              disabled={isGenerating || !hasRequiredData}
              className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generiere Anschreiben...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Anschreiben mit KI generieren
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Die KI erstellt ein personalisiertes Anschreiben basierend auf deinen Angaben
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 