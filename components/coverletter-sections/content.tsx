'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          Inhalt - Rich Text Editor
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Erstelle oder bearbeite den Inhalt deines Anschreibens
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rich Text Editor */}
        <div className="space-y-2">
          <Label htmlFor="customContent" className="text-sm font-medium">
            Anschreiben Inhalt 📝
          </Label>
          <div className="border rounded-md">
            {/* Toolbar */}
            <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
              <button
                type="button"
                className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => document.execCommand('bold', false)}
                title="Fett"
                disabled={!isEditing}
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => document.execCommand('italic', false)}
                title="Kursiv"
                disabled={!isEditing}
              >
                <em>I</em>
              </button>
              <button
                type="button"
                className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => document.execCommand('underline', false)}
                title="Unterstrichen"
                disabled={!isEditing}
              >
                <u>U</u>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button
                type="button"
                className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => document.execCommand('insertUnorderedList', false)}
                title="Aufzählung"
                disabled={!isEditing}
              >
                • Liste
              </button>
              <button
                type="button"
                className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => document.execCommand('insertOrderedList', false)}
                title="Nummerierte Liste"
                disabled={!isEditing}
              >
                1. Liste
              </button>
            </div>
            {/* Editor */}
            <div
              id="customContent"
              contentEditable={isEditing}
              className={cn(
                "p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#0F973D] focus:ring-opacity-20",
                !isEditing && "bg-gray-50 cursor-not-allowed"
              )}
              onInput={(e) => handleInputChange('customContent', e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: formData.customContent }}
              style={{ 
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Nutze die Toolbar für Formatierung oder schreibe dein Anschreiben direkt hier
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 