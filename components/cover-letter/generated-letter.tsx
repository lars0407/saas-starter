'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Edit, Download } from 'lucide-react';

interface GeneratedLetterData {
  content: string;
  id?: string;
}

interface GeneratedLetterProps {
  letter: GeneratedLetterData;
  onSave: () => Promise<void>;
  onRegenerate: () => Promise<void>;
  onEdit: () => void;
}

export function GeneratedLetter({ letter, onSave, onRegenerate, onEdit }: GeneratedLetterProps) {
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([letter.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'anschreiben.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✨ Dein Anschreiben ist ready! 👏
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Hier ist dein personalisiertes Anschreiben. Du kannst es speichern, bearbeiten oder neu generieren.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Letter Content */}
        <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {letter.content}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onSave}
            className="flex-1 bg-[#0F973D] hover:bg-[#0D7A32] text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Übernehmen & loslegen
          </Button>
          
          <Button
            onClick={onRegenerate}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Nope, nochmal bitte 🔁
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1"
          >
            <Edit className="mr-2 h-4 w-4" />
            Will noch was ändern ✍️
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Als TXT herunterladen
          </Button>
        </div>

        {/* Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Tipp:</strong> Nicht 100% zufrieden? Gib uns mehr Kontext für die nächste Runde!
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 