'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Plus, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface SkillsProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  isEditing?: boolean;
}

const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technische Skills 💻', icon: '⚡' },
  { value: 'soft', label: 'Soft Skills 🤝', icon: '💬' },
  { value: 'language', label: 'Sprachen 🌍', icon: '🗣️' },
  { value: 'tool', label: 'Tools & Software 🛠️', icon: '🔧' },
];

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Anfänger', icon: '⭐' },
  { value: 'intermediate', label: 'Fortgeschritten', icon: '⭐⭐' },
  { value: 'advanced', label: 'Erfahren', icon: '⭐⭐⭐' },
  { value: 'expert', label: 'Experte', icon: '⭐⭐⭐⭐' },
];

export function Skills({ data, onChange, isEditing = true }: SkillsProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      level: 'intermediate',
    };
    onChange([...data, newSkill]);
  };

  const removeSkill = (id: string) => {
    onChange(data.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onChange(data.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const getSkillsByCategory = (category: string) => {
    return data.filter(skill => skill.category === category);
  };

  const getLevelIcon = (level: string) => {
    const levelData = SKILL_LEVELS.find(l => l.value === level);
    return levelData?.icon || '⭐';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = SKILL_CATEGORIES.find(c => c.value === category);
    return categoryData?.icon || '💡';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Fähigkeiten & Skills 💪
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Zeig, was du drauf hast - von Tech bis Teamwork
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Noch keine Skills hinzugefügt</p>
            <p className="text-xs">Füge deine ersten Fähigkeiten hinzu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {SKILL_CATEGORIES.map(category => {
              const categorySkills = getSkillsByCategory(category.value);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category.value} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    {category.icon} {category.label}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{getLevelIcon(skill.level)}</span>
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {isEditing && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Skill Name"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              className="text-xs"
                            />
                            <Select
                              value={skill.level}
                              onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                            >
                              <SelectTrigger className="text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SKILL_LEVELS.map(level => (
                                  <SelectItem key={level.value} value={level.value}>
                                    <div className="flex items-center gap-2">
                                      <span>{level.icon}</span>
                                      <span>{level.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add new skill form */}
            {isEditing && (
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-semibold">+ Neuen Skill hinzufügen</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Skill Name</Label>
                    <Input
                      placeholder="z.B. React, Teamführung"
                      value=""
                      onChange={() => {}}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Kategorie</Label>
                    <Select value="technical" onValueChange={() => {}}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.label.split(' ')[0]}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Level</Label>
                    <Select value="intermediate" onValueChange={() => {}}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <span>{level.icon}</span>
                              <span>{level.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <Button
            onClick={addSkill}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            + Skill hinzufügen
          </Button>
        )}

        {/* Quick Add Suggestions */}
        {isEditing && data.length === 0 && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-3">💡 Schnell-Tipps für Skills:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="space-y-1">
                <p className="font-medium">💻 Tech:</p>
                <p>React, TypeScript, Python, SQL</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">🤝 Soft Skills:</p>
                <p>Teamführung, Kommunikation, Problemlösung</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">🌍 Sprachen:</p>
                <p>Deutsch (Muttersprache), Englisch (C1)</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">🛠️ Tools:</p>
                <p>Figma, Git, Docker, AWS</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 