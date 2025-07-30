"use client"

import { CoverLetterGenerator } from '@/components/cover-letter/cover-letter-generator';

export default function CoverLetterPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">KI-Anschreiben Generator</h1>
        <p className="text-muted-foreground mt-2">
          Lass KI dein perfektes Anschreiben erstellen! 🚀
        </p>
      </div>
      
      <CoverLetterGenerator />
    </div>
  );
} 