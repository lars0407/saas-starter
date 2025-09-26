'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  FileText, 
  Link, 
  Briefcase, 
  Send, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { JobDetails, Document } from './types';

interface JobApplicationFormProps {
  jobDetails: JobDetails;
  autoMode: boolean;
  selectedResume: Document | null;
  isProcessingLongText: boolean;
  characterCount: number;
  onJobDetailsChange: (field: string, value: string) => void;
  onAutoModeChange: (value: boolean) => void;
  onResumeSelect: () => void;
  onResumeChange: () => void;
  onStartApplication: () => void;
  onCancel: () => void;
}

export function JobApplicationForm({
  jobDetails,
  autoMode,
  selectedResume,
  isProcessingLongText,
  characterCount,
  onJobDetailsChange,
  onAutoModeChange,
  onResumeSelect,
  onResumeChange,
  onStartApplication,
  onCancel,
}: JobApplicationFormProps) {
  const [activeTab, setActiveTab] = useState('details');

  const isFormValid = useMemo(() => {
    if (activeTab === 'details') {
      return jobDetails.title && jobDetails.description;
    } else {
      return jobDetails.url;
    }
  }, [activeTab, jobDetails.title, jobDetails.description, jobDetails.url]);

  const handleInputChange = useCallback((field: string, value: string) => {
    onJobDetailsChange(field, value);
  }, [onJobDetailsChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.length > 1500) {
      // Let the normal onChange handle the paste
      setTimeout(() => {}, 1000);
    }
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center px-24 py-8">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#0F973D]" />
            🚀 Job-Bewerbung starten
          </CardTitle>
          <p className="text-muted-foreground">
            Gib einfach die Job-Details ein oder füg eine URL hinzu - wir machen den Rest! 💪
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                📝 Job-Details
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2" disabled>
                <Link className="h-4 w-4" />
                🔗 Job-URL (Soon™)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">🎯 Job-Titel *</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="auto-mode" className="text-sm text-muted-foreground">
                        🤖 Auto-Modus
                      </Label>
                      <Switch
                        id="auto-mode"
                        checked={autoMode}
                        onCheckedChange={onAutoModeChange}
                        className="data-[state=checked]:bg-[#0F973D]"
                      />
                    </div>
                  </div>
                  <Input
                    id="title"
                    placeholder="z.B. Senior Software Engineer"
                    value={jobDetails.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    style={{ 
                      '--tw-ring-color': '#0F973D',
                      '--tw-border-color': '#0F973D'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">📋 Job-Beschreibung *</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Erzähl uns was über die Stelle..."
                    value={jobDetails.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    onPaste={handlePaste}
                    rows={8}
                    className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D] resize-y min-h-[200px] max-h-[400px]"
                    style={{ 
                      '--tw-ring-color': '#0F973D',
                      '--tw-border-color': '#0F973D'
                    } as React.CSSProperties}
                  />
                  {isProcessingLongText && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                      <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                      <span className="text-xs text-blue-600">Verarbeite...</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{characterCount} / 50.000 Zeichen</span>
                  {characterCount >= 50000 ? (
                    <span className="text-red-600">🚫 Maximale Textlänge erreicht</span>
                  ) : characterCount > 15000 ? (
                    <span className="text-red-600">⚠️ Sehr langer Text - Langsame Verarbeitung</span>
                  ) : characterCount > 10000 ? (
                    <span className="text-orange-600">⚠️ Langer Text - Verarbeitung kann länger dauern</span>
                  ) : characterCount > 5000 ? (
                    <span className="text-yellow-600">⚡ Optimierte Verarbeitung aktiviert</span>
                  ) : characterCount > 1500 ? (
                    <span className="text-blue-600">🔄 Debouncing aktiviert</span>
                  ) : (
                    <span className="text-green-600">✓ Automatische Größenanpassung aktiviert</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">🔗 Job-URL (optional)</Label>
                <Input
                  id="jobUrl"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={jobDetails.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  type="url"
                  className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                  style={{ 
                    '--tw-ring-color': '#0F973D',
                    '--tw-border-color': '#0F973D'
                  } as React.CSSProperties}
                />
                <p className="text-sm text-muted-foreground">
                  🚀 Wir bewerben uns automatisch für dich! Die URL hilft uns dabei, die perfekte Bewerbung zu erstellen.
                </p>
              </div>

              {/* Resume Picker Section */}
              <div className="space-y-2">
                <Label>📄 Base-Lebenslauf wählen</Label>
                {selectedResume ? (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="w-16 h-20 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                      <PDFViewer
                        pdfUrl={selectedResume.url}
                        showToolbar={false}
                        showNavigation={false}
                        showBorder={false}
                        fallbackMessage=""
                        downloadMessage=""
                        placeholderMessage=""
                        className="w-full h-full -mt-6 -mb-6 pointer-events-none"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedResume.name}</p>
                      <p className="text-xs text-gray-500">ID: {selectedResume.id}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onResumeChange}
                      className="text-xs"
                    >
                      ✏️ Ändern
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={onResumeSelect}
                    className="w-full justify-start text-left h-auto p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Lebenslauf auswählen</p>
                        <p className="text-xs text-muted-foreground">Wähle deinen Base-Lebenslauf für die KI-Generierung</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">
                  🤖 Wähle einen Lebenslauf als Grundlage für die automatische Anpassung
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              ❌ Abbrechen
            </Button>
            <Button
              onClick={onStartApplication}
              disabled={!isFormValid}
              className="bg-[#0F973D] hover:bg-[#0F973D]/90"
            >
              <Send className="h-4 w-4 mr-2" />
              🚀 Bewerbung starten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
