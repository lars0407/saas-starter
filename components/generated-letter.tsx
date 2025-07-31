'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  RefreshCw, 
  Edit3, 
  Check, 
  X, 
  FileText,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedLetterProps {
  content: string;
  timestamp: Date;
  isEditing: boolean;
  onRegenerate: () => void;
  onSave: () => void;
  onEdit: () => void;
  onEditSave: (content: string) => void;
  onEditCancel: () => void;
}

export function GeneratedLetter({
  content,
  timestamp,
  isEditing,
  onRegenerate,
  onSave,
  onEdit,
  onEditSave,
  onEditCancel,
}: GeneratedLetterProps) {
  const [editedContent, setEditedContent] = useState(content);

  const handleEditSave = () => {
    onEditSave(editedContent);
    toast.success('Anschreiben gespeichert! ✨');
  };

  const handleSave = () => {
    onSave();
    toast.success('Anschreiben übernommen! 🎉');
  };

  const handleRegenerate = () => {
    onRegenerate();
    toast.info('Generiere neues Anschreiben... 🔄');
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Dein Anschreiben ist ready! 👏</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimestamp(timestamp)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Nicht 100% zufrieden? Gib uns mehr Kontext für die nächste Runde!
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 mb-6">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="h-full min-h-[400px] resize-none font-mono text-sm"
              placeholder="Dein Anschreiben..."
            />
          ) : (
            <div className="bg-muted/30 rounded-lg p-4 h-full overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {content}
              </pre>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleEditSave}
                className="flex items-center gap-2"
                size="sm"
              >
                <Check className="h-4 w-4" />
                Speichern
              </Button>
              <Button
                onClick={onEditCancel}
                variant="outline"
                className="flex items-center gap-2"
                size="sm"
              >
                <X className="h-4 w-4" />
                Abbrechen
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                size="sm"
              >
                <Save className="h-4 w-4" />
                Übernehmen & loslegen
              </Button>
              <Button
                onClick={onEdit}
                variant="outline"
                className="flex items-center gap-2"
                size="sm"
              >
                <Edit3 className="h-4 w-4" />
                Will noch was ändern ✍️
              </Button>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="flex items-center gap-2"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
                Nope, nochmal bitte 🔁
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tipp:</strong> Du kannst das Anschreiben nach deinen Wünschen anpassen oder 
            es neu generieren lassen, wenn es nicht ganz passt!
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 