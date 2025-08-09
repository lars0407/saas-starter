'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateResumeSummary } from '@/lib/api-client';

interface ResumeSummaryGeneratorProps {
  resumeData: any;
  onSummaryGenerated: (summary: string) => void;
  disabled?: boolean;
}

export function ResumeSummaryGenerator({ 
  resumeData, 
  onSummaryGenerated, 
  disabled = false 
}: ResumeSummaryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!resumeData) {
      toast.error('Keine Lebenslaufdaten verfügbar');
      return;
    }

    setIsGenerating(true);

    try {
      const data = await generateResumeSummary(resumeData);
      
      if (data.output) {
        onSummaryGenerated(data.output);
        toast.success('Zusammenfassung erfolgreich generiert!');
      } else {
        throw new Error('Keine Zusammenfassung in der Antwort erhalten');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Fehler beim Generieren der Zusammenfassung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateSummary}
      disabled={disabled || isGenerating}
      variant="outline"
      size="sm"
      className="text-xs px-3 py-1 h-8"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          KI generiert...
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3 mr-1" />
          KI generieren
        </>
      )}
    </Button>
  );
} 