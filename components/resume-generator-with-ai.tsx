'use client';

import { useEffect } from 'react';
import { ResumeGeneratorNew } from './resume-generator-new';
import { useAIAssistantHook } from '@/hooks/use-ai-assistant';

interface ResumeGeneratorWithAIProps {
  documentId?: number;
}

export function ResumeGeneratorWithAI({ documentId }: ResumeGeneratorWithAIProps) {
  const { updatePageData } = useAIAssistantHook();

  // Update AI Assistant context with resume-specific data
  useEffect(() => {
    updatePageData({
      type: 'resume-generator',
      documentId,
      features: [
        'Persönliche Informationen',
        'Ausbildung',
        'Berufserfahrung',
        'Fähigkeiten',
        'PDF-Vorschau',
        'Download'
      ],
      tips: [
        'Verwende aktionsorientierte Verben für deine Erfahrungen',
        'Quantifiziere deine Erfolge mit konkreten Zahlen',
        'Passe deinen Lebenslauf an die Stellenausschreibung an',
        'Halte ihn auf maximal 2 Seiten',
        'Verwende ein sauberes, professionelles Design'
      ]
    });
  }, [documentId, updatePageData]);

  return <ResumeGeneratorNew documentId={documentId} />;
} 