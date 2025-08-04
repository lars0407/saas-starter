'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Plus, Trash2, Star, GripVertical } from 'lucide-react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'technical',
    level: 'intermediate',
  });

  const addSkill = () => {
    try {
      // If no name is provided, add a default skill
      const skillName = newSkill.name?.trim() || 'Neuer Skill';
      
      const skill: Skill = {
        id: Date.now().toString(),
        name: skillName,
        category: newSkill.category || 'technical',
        level: newSkill.level || 'intermediate',
      };
      
      // Ensure data is an array before spreading
      const currentData = Array.isArray(data) ? data : [];
      onChange([...currentData, skill]);
      setNewSkill({ name: '', category: 'technical', level: 'intermediate' });
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const removeSkill = (id: string) => {
    try {
      const currentData = Array.isArray(data) ? data : [];
      onChange(currentData.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    try {
      const currentData = Array.isArray(data) ? data : [];
      onChange(currentData.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      ));
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const getSkillsByCategory = (category: string) => {
    const currentData = Array.isArray(data) ? data : [];
    return currentData.filter(skill => skill.category === category);
  };

  const getLevelIcon = (level: string) => {
    const levelData = SKILL_LEVELS.find(l => l.value === level);
    return levelData?.icon || '⭐';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = SKILL_CATEGORIES.find(c => c.value === category);
    return categoryData?.icon || '💡';
  };

  // Drag and Drop functions for skills within a category
  const handleDragStart = (e: React.DragEvent, index: number, category: string) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', JSON.stringify({ index, category }));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number, dropCategory: string) => {
    e.preventDefault();
    const dragData = JSON.parse(e.dataTransfer.getData('text/html'));
    const { index: dragIndex, category: dragCategory } = dragData;
    
    // Only allow reordering within the same category
    if (dragCategory !== dropCategory) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    if (dragIndex !== dropIndex) {
      const categorySkills = getSkillsByCategory(dropCategory);
      const newCategorySkills = [...categorySkills];
      const [draggedItem] = newCategorySkills.splice(dragIndex, 1);
      newCategorySkills.splice(dropIndex, 0, draggedItem);
      
      // Update the main data array
      const otherSkills = data.filter(skill => skill.category !== dropCategory);
      onChange([...otherSkills, ...newCategorySkills]);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveSkill = (skillId: string, direction: 'up' | 'down') => {
    const skillIndex = data.findIndex(skill => skill.id === skillId);
    if (skillIndex === -1) return;
    
    const skill = data[skillIndex];
    const categorySkills = getSkillsByCategory(skill.category);
    const categoryIndex = categorySkills.findIndex(s => s.id === skillId);
    
    if (direction === 'up' && categoryIndex > 0) {
      const newCategorySkills = [...categorySkills];
      [newCategorySkills[categoryIndex], newCategorySkills[categoryIndex - 1]] = 
      [newCategorySkills[categoryIndex - 1], newCategorySkills[categoryIndex]];
      
      const otherSkills = data.filter(s => s.category !== skill.category);
      onChange([...otherSkills, ...newCategorySkills]);
    } else if (direction === 'down' && categoryIndex < categorySkills.length - 1) {
      const newCategorySkills = [...categorySkills];
      [newCategorySkills[categoryIndex], newCategorySkills[categoryIndex + 1]] = 
      [newCategorySkills[categoryIndex + 1], newCategorySkills[categoryIndex]];
      
      const otherSkills = data.filter(s => s.category !== skill.category);
      onChange([...otherSkills, ...newCategorySkills]);
    }
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
         {(Array.isArray(data) ? data.length : 0) === 0 ? (
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
                  <div className="space-y-2">
                    {categorySkills.map((skill, index) => (
                      <div 
                        key={skill.id} 
                        className={cn(
                          "border rounded-lg p-3 transition-all duration-200",
                          draggedIndex === index && "opacity-50 scale-95",
                          dragOverIndex === index && draggedIndex !== index && "border-primary border-2 bg-primary/5",
                          "hover:shadow-sm"
                        )}
                        draggable={isEditing}
                        onDragStart={(e) => handleDragStart(e, index, category.value)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index, category.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isEditing && (
                              <div 
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                                title="Zum Verschieben ziehen"
                              >
                                <GripVertical className="h-3 w-3 text-gray-400" />
                              </div>
                            )}
                            <span className="text-xs">{getLevelIcon(skill.level)}</span>
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isEditing && categorySkills.length > 1 && (
                              <>
                                {index > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveSkill(skill.id, 'up')}
                                    className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
                                    title="Nach oben verschieben"
                                  >
                                    ↑
                                  </Button>
                                )}
                                {index < categorySkills.length - 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveSkill(skill.id, 'down')}
                                    className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
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
                                onClick={() => removeSkill(skill.id)}
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                title="Löschen"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {isEditing && (
                          <div className="mt-2 space-y-2">
                            <Input
                              placeholder="Skill Name"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              className="text-xs focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
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
          </div>
        )}

        {/* Add new skill form - Always visible when editing */}
        {isEditing && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="text-sm font-semibold">+ Neuen Skill hinzufügen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Skill Name</Label>
                <Input
                  placeholder="z.B. React, Teamführung"
                  value={newSkill.name || ''}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="text-sm focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Kategorie</Label>
                <Select 
                  value={newSkill.category || 'technical'} 
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value as any })}
                >
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
                <Select 
                  value={newSkill.level || 'intermediate'} 
                  onValueChange={(value) => setNewSkill({ ...newSkill, level: value as any })}
                >
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
            <Button
              onClick={addSkill}
              disabled={!newSkill.name?.trim()}
              size="sm"
              className="w-full bg-[#0F973D] hover:bg-[#0F973D]/90 text-white"
            >
              <Plus className="h-3 w-3 mr-2" />
              Skill hinzufügen
            </Button>
          </div>
        )}

                 {/* Quick Add Suggestions */}
         {isEditing && (Array.isArray(data) ? data.length : 0) === 0 && (
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