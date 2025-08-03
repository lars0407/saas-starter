'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Trash2, Heart } from 'lucide-react';

// Helper function
const getCategoryLabel = (category: string) => {
  const labels = {
    hobby: 'Hobby',
    sport: 'Sport',
    technology: 'Technologie',
    arts: 'Kunst',
    travel: 'Reisen',
    music: 'Musik',
    reading: 'Lesen',
    cooking: 'Kochen',
    volunteering: 'Ehrenamt',
    other: 'Sonstiges'
  };
  return labels[category as keyof typeof labels] || category;
};

export interface InterestEntry {
  id: string;
  name: string;
  category: 'hobby' | 'sport' | 'technology' | 'arts' | 'travel' | 'music' | 'reading' | 'cooking' | 'volunteering' | 'other';
  description?: string;
}

interface InterestsProps {
  data: InterestEntry[];
  onChange: (data: InterestEntry[]) => void;
  isEditing: boolean;
}

export function Interests({ data, onChange, isEditing }: InterestsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState<Partial<InterestEntry>>({
    name: '',
    category: 'hobby',
    description: ''
  });

  const handleAdd = () => {
    if (!newInterest.name) {
      return;
    }

    const interest: InterestEntry = {
      id: Date.now().toString(),
      name: newInterest.name,
      category: newInterest.category || 'hobby',
      description: newInterest.description || undefined
    };

    onChange([...data, interest]);
    setNewInterest({
      name: '',
      category: 'hobby',
      description: ''
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedInterest: InterestEntry) => {
    const updatedData = data.map(interest => 
      interest.id === id ? updatedInterest : interest
    );
    onChange(updatedData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(interest => interest.id !== id);
    onChange(updatedData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Keine Interessen hinzugefügt</p>
        ) : (
          <div className="space-y-3">
            {data.map((interest) => (
              <Card key={interest.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <h3 className="font-medium">{interest.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(interest.category)}
                      </Badge>
                    </div>
                    {interest.description && (
                      <p className="text-sm text-muted-foreground">
                        {interest.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Interesse hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-name">Name *</Label>
              <Input
                id="interest-name"
                value={newInterest.name}
                onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
                placeholder="z.B. Fotografie, Programmierung, Yoga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-category">Kategorie</Label>
              <select
                id="interest-category"
                value={newInterest.category}
                onChange={(e) => setNewInterest({ ...newInterest, category: e.target.value as InterestEntry['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hobby">Hobby</option>
                <option value="sport">Sport</option>
                <option value="technology">Technologie</option>
                <option value="arts">Kunst</option>
                <option value="travel">Reisen</option>
                <option value="music">Musik</option>
                <option value="reading">Lesen</option>
                <option value="cooking">Kochen</option>
                <option value="volunteering">Ehrenamt</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest-description">Beschreibung</Label>
            <Textarea
              id="interest-description"
              value={newInterest.description}
              onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
              placeholder="Kurze Beschreibung deines Interesses..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAdd}
            disabled={!newInterest.name}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Interesse hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Existing Interests */}
      {data.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deine Interessen</h3>
          {data.map((interest) => (
            <InterestEditCard
              key={interest.id}
              interest={interest}
              isEditing={editingId === interest.id}
              onEdit={() => handleEdit(interest.id)}
              onSave={(updated) => handleSave(interest.id, updated)}
              onDelete={() => handleDelete(interest.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface InterestEditCardProps {
  interest: InterestEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (interest: InterestEntry) => void;
  onDelete: () => void;
}

function InterestEditCard({ interest, isEditing, onEdit, onSave, onDelete }: InterestEditCardProps) {
  const [formData, setFormData] = useState<InterestEntry>(interest);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(interest);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <CardContent className="space-y-4 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InterestEntry['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hobby">Hobby</option>
                <option value="sport">Sport</option>
                <option value="technology">Technologie</option>
                <option value="arts">Kunst</option>
                <option value="travel">Reisen</option>
                <option value="music">Musik</option>
                <option value="reading">Lesen</option>
                <option value="cooking">Kochen</option>
                <option value="volunteering">Ehrenamt</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Beschreibung</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value || undefined })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
              <Edit2 className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Abbrechen
            </Button>
            <Button onClick={onDelete} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <h3 className="font-medium">{interest.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(interest.category)}
            </Badge>
          </div>
          {interest.description && (
            <p className="text-sm text-muted-foreground">
              {interest.description}
            </p>
          )}
        </div>
        <Button onClick={onEdit} variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 