'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface ContentData {
  customContent: string;
}

interface ContentProps {
  data: ContentData;
  onChange: (data: ContentData) => void;
  isEditing: boolean;
}

export function Content({ data, onChange, isEditing }: ContentProps) {
  const [formData, setFormData] = useState<ContentData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof ContentData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Inhalt - Anschreiben
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Erstelle oder bearbeite den Inhalt deines Anschreibens
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customContent" className="text-sm font-medium">
            Anschreiben Inhalt 📝
          </Label>
          <Textarea
            id="customContent"
            value={formData.customContent}
            onChange={(e) => handleInputChange('customContent', e.target.value)}
            placeholder="Schreiben Sie hier Ihr Anschreiben..."
            className="min-h-[300px] resize-none"
            disabled={!isEditing}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Schreiben Sie Ihr Anschreiben direkt hier
            </p>
            <p>
              {formData.customContent.length} Zeichen
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 