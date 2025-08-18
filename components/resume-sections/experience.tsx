'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Trash2, Calendar, Building2, MapPin, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface ExperienceProps {
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
  isEditing?: boolean;
}

export function Experience({ data, onChange, isEditing = true }: ExperienceProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newEntry: ExperienceEntry = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    };
    onChange([...data, newEntry]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: any) => {
    onChange(data.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const addAchievement = (id: string) => {
    onChange(data.map(entry => 
      entry.id === id 
        ? { ...entry, achievements: [...entry.achievements, ''] }
        : entry
    ));
  };

  const removeAchievement = (id: string, index: number) => {
    onChange(data.map(entry => 
      entry.id === id 
        ? { ...entry, achievements: entry.achievements.filter((_, i) => i !== index) }
        : entry
    ));
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    onChange(data.map(entry => 
      entry.id === id 
        ? { 
            ...entry, 
            achievements: entry.achievements.map((achievement, i) => 
              i === index ? value : achievement
            )
          }
        : entry
    ));
  };

  // Drag and Drop functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    
    if (dragIndex !== dropIndex) {
      const newData = [...data];
      const [draggedItem] = newData.splice(dragIndex, 1);
      newData.splice(dropIndex, 0, draggedItem);
      onChange(newData);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newData = [...data];
    const [movedItem] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedItem);
    onChange(newData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Berufserfahrung 💼
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Zeig, wo du Eindruck gemacht hast – Zahlen wirken Wunder 💥
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Noch keine Berufserfahrung hinzugefügt</p>
            <p className="text-xs">Füge deine erste Arbeitsstation hinzu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((entry, index) => (
              <div 
                key={entry.id} 
                className={cn(
                  "border rounded-lg p-4 space-y-4 transition-all duration-200",
                  draggedIndex === index && "opacity-50 scale-95",
                  dragOverIndex === index && draggedIndex !== index && "border-primary border-2 bg-primary/5",
                  "hover:shadow-md"
                )}
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        title="Zum Verschieben ziehen"
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      Erfahrung #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing && data.length > 1 && (
                      <>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, index - 1)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Nach oben verschieben"
                          >
                            ↑
                          </Button>
                        )}
                        {index < data.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, index + 1)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Nach unten verschieben"
                          >
                            ↓
                          </Button>
                        )}
                      </>
                    )}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(entry.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor={`company-${entry.id}`} className="text-sm font-medium flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Unternehmen
                    </Label>
                    <Input
                      id={`company-${entry.id}`}
                      placeholder="z.B. Google, Startup XYZ"
                      value={entry.company}
                      onChange={(e) => updateExperience(entry.id, 'company', e.target.value)}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label htmlFor={`position-${entry.id}`} className="text-sm font-medium">
                      Position 🎯
                    </Label>
                    <Input
                      id={`position-${entry.id}`}
                      placeholder="z.B. Frontend Developer"
                      value={entry.position}
                      onChange={(e) => updateExperience(entry.id, 'position', e.target.value)}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor={`location-${entry.id}`} className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Standort
                    </Label>
                    <Input
                      id={`location-${entry.id}`}
                      placeholder="z.B. Berlin, Deutschland"
                      value={entry.location}
                      onChange={(e) => updateExperience(entry.id, 'location', e.target.value)}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    />
                  </div>




                </div>

                {/* Date Range - New Line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${entry.id}`} className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Start
                    </Label>
                    <Input
                      id={`startDate-${entry.id}`}
                      type="month"
                      value={entry.startDate}
                      onChange={(e) => updateExperience(entry.id, 'startDate', e.target.value)}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                      min="1900-01"
                      max="2100-12"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: MM/YYYY
                    </p>
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
                      onChange={(e) => updateExperience(entry.id, 'endDate', e.target.value)}
                      disabled={!isEditing || entry.current}
                      className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                      min="1900-01"
                      max="2100-12"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: MM/YYYY
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor={`description-${entry.id}`} className="text-sm font-medium">
                    Was hast du da gerockt? Schreib's hier rein 🚀
                  </Label>
                  <Textarea
                    id={`description-${entry.id}`}
                    placeholder="Beschreibe deine Aufgaben, Verantwortungen und was du gelernt hast..."
                    value={entry.description}
                    onChange={(e) => updateExperience(entry.id, 'description', e.target.value)}
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Erfolge & Highlights ⭐
                    </Label>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addAchievement(entry.id)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Erfolg hinzufügen
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {entry.achievements.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">Noch keine Erfolge hinzugefügt</p>
                        <p className="text-xs">Füge deine ersten Highlights hinzu</p>
                      </div>
                    ) : (
                      entry.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="z.B. Umsatz um 25% gesteigert"
                              value={achievement}
                              onChange={(e) => updateAchievement(entry.id, achievementIndex, e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(entry.id, achievementIndex)}
                              className="text-red-500 hover:text-red-700"
                              title="Erfolg entfernen"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <Button
            onClick={addExperience}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Neue Station hinzufügen
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 