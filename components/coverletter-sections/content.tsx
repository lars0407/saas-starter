'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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
  const [richTextContent, setRichTextContent] = useState(data.customContent);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(data);
    setRichTextContent(data.customContent);
  }, [data]);

  const handleInputChange = (field: keyof ContentData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleRichTextChange = (content: string) => {
    setRichTextContent(content);
    handleInputChange('customContent', content);
  };

  const formatText = (command: string, value: string = '') => {
    if (!isEditing) return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      handleRichTextChange(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      handleRichTextChange(content);
    }
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

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Rich Text Editor ✨
          </Label>
          
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-t-md bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Fett"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Kursiv"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('underline')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Unterstrichen"
            >
              <Underline className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('insertUnorderedList')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Aufzählungsliste"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('insertOrderedList')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Nummerierte Liste"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('justifyLeft')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Linksbündig"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('justifyCenter')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Zentriert"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('justifyRight')}
              disabled={!isEditing}
              className="h-8 w-8 p-0"
              title="Rechtsbündig"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable={isEditing}
            onInput={(e) => {
              const content = e.currentTarget.innerHTML;
              handleRichTextChange(content);
            }}
            onPaste={handlePaste}
            className="min-h-[200px] p-3 border border-gray-200 rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] overflow-y-auto"
            style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: richTextContent }}
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Rich Text Editor mit Formatierungsoptionen
            </p>
            <p>
              {richTextContent.replace(/<[^>]*>/g, '').length} Zeichen
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 