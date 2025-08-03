'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Trash2, BookOpen } from 'lucide-react';

// Helper function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long'
  });
};

export interface CourseEntry {
  id: string;
  title: string;
  provider: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  certificate?: string;
  description?: string;
  url?: string;
  skills?: string[];
}

interface CoursesProps {
  data: CourseEntry[];
  onChange: (data: CourseEntry[]) => void;
  isEditing: boolean;
}

export function Courses({ data, onChange, isEditing }: CoursesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<Partial<CourseEntry>>({
    title: '',
    provider: '',
    startDate: '',
    endDate: '',
    duration: '',
    certificate: '',
    description: '',
    url: '',
    skills: []
  });

  const handleAdd = () => {
    if (!newCourse.title || !newCourse.provider || !newCourse.startDate) {
      return;
    }

    const course: CourseEntry = {
      id: Date.now().toString(),
      title: newCourse.title,
      provider: newCourse.provider,
      startDate: newCourse.startDate,
      endDate: newCourse.endDate || undefined,
      duration: newCourse.duration || undefined,
      certificate: newCourse.certificate || undefined,
      description: newCourse.description || undefined,
      url: newCourse.url || undefined,
      skills: newCourse.skills || []
    };

    onChange([...data, course]);
    setNewCourse({
      title: '',
      provider: '',
      startDate: '',
      endDate: '',
      duration: '',
      certificate: '',
      description: '',
      url: '',
      skills: []
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedCourse: CourseEntry) => {
    const updatedData = data.map(course => 
      course.id === id ? updatedCourse : course
    );
    onChange(updatedData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(course => course.id !== id);
    onChange(updatedData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Keine Kurse hinzugefügt</p>
        ) : (
          <div className="space-y-3">
            {data.map((course) => (
              <Card key={course.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <h3 className="font-medium">{course.title}</h3>
                      {course.certificate && (
                        <Badge variant="secondary" className="text-xs">
                          Zertifikat
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Anbieter: {course.provider}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start: {formatDate(course.startDate)}
                      {course.endDate && ` • Ende: ${formatDate(course.endDate)}`}
                      {course.duration && ` • Dauer: ${course.duration}`}
                    </p>
                    {course.description && (
                      <p className="text-sm mt-2">{course.description}</p>
                    )}
                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
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
      {/* Add New Course */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Kurs hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Kurstitel *</Label>
              <Input
                id="course-title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="z.B. React Advanced Patterns"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-provider">Anbieter *</Label>
              <Input
                id="course-provider"
                value={newCourse.provider}
                onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                placeholder="z.B. Udemy, Coursera, edX"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-start-date">Startdatum *</Label>
              <Input
                id="course-start-date"
                type="date"
                value={newCourse.startDate}
                onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-end-date">Enddatum</Label>
              <Input
                id="course-end-date"
                type="date"
                value={newCourse.endDate}
                onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-duration">Dauer</Label>
              <Input
                id="course-duration"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                placeholder="z.B. 40 Stunden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-certificate">Zertifikat</Label>
              <Input
                id="course-certificate"
                value={newCourse.certificate}
                onChange={(e) => setNewCourse({ ...newCourse, certificate: e.target.value })}
                placeholder="z.B. Certificate of Completion"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-url">Kurs-URL</Label>
              <Input
                id="course-url"
                type="url"
                value={newCourse.url}
                onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
                placeholder="https://course.url/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">Beschreibung</Label>
            <Textarea
              id="course-description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder="Kurze Beschreibung des Kursinhalts und der erworbenen Fähigkeiten..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-skills">Erlernte Fähigkeiten</Label>
            <Input
              id="course-skills"
              value={newCourse.skills?.join(', ') || ''}
              onChange={(e) => setNewCourse({ 
                ...newCourse, 
                skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
              })}
              placeholder="React, TypeScript, State Management (durch Kommas getrennt)"
            />
          </div>

          <Button 
            onClick={handleAdd}
            disabled={!newCourse.title || !newCourse.provider || !newCourse.startDate}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Kurs hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Existing Courses */}
      {data.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deine Kurse</h3>
          {data.map((course) => (
            <CourseEditCard
              key={course.id}
              course={course}
              isEditing={editingId === course.id}
              onEdit={() => handleEdit(course.id)}
              onSave={(updated) => handleSave(course.id, updated)}
              onDelete={() => handleDelete(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseEditCardProps {
  course: CourseEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (course: CourseEntry) => void;
  onDelete: () => void;
}

function CourseEditCard({ course, isEditing, onEdit, onSave, onDelete }: CourseEditCardProps) {
  const [formData, setFormData] = useState<CourseEntry>(course);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(course);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <CardContent className="space-y-4 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kurstitel</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Anbieter</Label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Startdatum</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Enddatum</Label>
              <Input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dauer</Label>
              <Input
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zertifikat</Label>
              <Input
                value={formData.certificate || ''}
                onChange={(e) => setFormData({ ...formData, certificate: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kurs-URL</Label>
              <Input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value || undefined })}
              />
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

          <div className="space-y-2">
            <Label>Erlernte Fähigkeiten</Label>
            <Input
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
              })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
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
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium">{course.title}</h3>
            {course.certificate && (
              <Badge variant="secondary" className="text-xs">
                Zertifikat
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Anbieter: {course.provider}
          </p>
          <p className="text-sm text-muted-foreground">
            Start: {formatDate(course.startDate)}
            {course.endDate && ` • Ende: ${formatDate(course.endDate)}`}
            {course.duration && ` • Dauer: ${course.duration}`}
          </p>
          {course.description && (
            <p className="text-sm mt-2">{course.description}</p>
          )}
          {course.skills && course.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {course.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Button onClick={onEdit} variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 