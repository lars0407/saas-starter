'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

interface EducationProps {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
  isEditing?: boolean;
}

export function Education({ data, onChange, isEditing = true }: EducationProps) {
  const addEducation = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      gpa: '',
    };
    onChange([...data, newEntry]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: any) => {
    onChange(data.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Ausbildung 🎓
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deine Bildungsstationen - von Schule bis Uni
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Noch keine Ausbildung hinzugefügt</p>
            <p className="text-xs">Füge deine erste Bildungsstation hinzu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Ausbildung #{index + 1}
                  </Badge>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Institution */}
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${entry.id}`} className="text-sm font-medium">
                      Institution 🏫
                    </Label>
                    <Input
                      id={`institution-${entry.id}`}
                      placeholder="z.B. Universität Berlin"
                      value={entry.institution}
                      onChange={(e) => updateEducation(entry.id, 'institution', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Degree */}
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${entry.id}`} className="text-sm font-medium">
                      Abschluss 🎯
                    </Label>
                    <Input
                      id={`degree-${entry.id}`}
                      placeholder="z.B. Bachelor of Science"
                      value={entry.degree}
                      onChange={(e) => updateEducation(entry.id, 'degree', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Field of Study */}
                  <div className="space-y-2">
                    <Label htmlFor={`field-${entry.id}`} className="text-sm font-medium">
                      Fachrichtung 📚
                    </Label>
                    <Input
                      id={`field-${entry.id}`}
                      placeholder="z.B. Informatik"
                      value={entry.field}
                      onChange={(e) => updateEducation(entry.id, 'field', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* GPA */}
                  <div className="space-y-2">
                    <Label htmlFor={`gpa-${entry.id}`} className="text-sm font-medium">
                      Notendurchschnitt 📊
                    </Label>
                    <Input
                      id={`gpa-${entry.id}`}
                      placeholder="z.B. 1.8"
                      value={entry.gpa || ''}
                      onChange={(e) => updateEducation(entry.id, 'gpa', e.target.value)}
                      disabled={!isEditing}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional - nur wenn du stolz drauf bist 😉
                    </p>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${entry.id}`} className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Start
                    </Label>
                    <Input
                      id={`startDate-${entry.id}`}
                      type="month"
                      value={entry.startDate}
                      onChange={(e) => updateEducation(entry.id, 'startDate', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${entry.id}`} className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Ende
                    </Label>
                    <Input
                      id={`endDate-${entry.id}`}
                      type="month"
                      value={entry.endDate}
                      onChange={(e) => updateEducation(entry.id, 'endDate', e.target.value)}
                      disabled={!isEditing || entry.current}
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        id={`current-${entry.id}`}
                        type="checkbox"
                        checked={entry.current}
                        onChange={(e) => updateEducation(entry.id, 'current', e.target.checked)}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <Label htmlFor={`current-${entry.id}`} className="text-sm">
                        Läuft noch
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor={`description-${entry.id}`} className="text-sm font-medium">
                    Beschreibung 📝
                  </Label>
                  <Textarea
                    id={`description-${entry.id}`}
                    placeholder="Relevante Kurse, Projekte, Auszeichnungen..."
                    value={entry.description || ''}
                    onChange={(e) => updateEducation(entry.id, 'description', e.target.value)}
                    rows={2}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional - was war besonders spannend?
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <Button
            onClick={addEducation}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            + Neue Ausbildung hinzufügen
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 