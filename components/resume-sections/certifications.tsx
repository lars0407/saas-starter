'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Trash2, Award } from 'lucide-react';

// Helper function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long'
  });
};

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  description?: string;
}

interface CertificationsProps {
  data: CertificationEntry[];
  onChange: (data: CertificationEntry[]) => void;
  isEditing: boolean;
}

export function Certifications({ data, onChange, isEditing }: CertificationsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCertification, setNewCertification] = useState<Partial<CertificationEntry>>({
    name: '',
    issuer: '',
    issueDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.issueDate) {
      return;
    }

    const certification: CertificationEntry = {
      id: Date.now().toString(),
      name: newCertification.name,
      issuer: newCertification.issuer,
      issueDate: newCertification.issueDate,
      description: newCertification.description || undefined
    };

    onChange([...data, certification]);
    setNewCertification({
      name: '',
      issuer: '',
      issueDate: '',
      description: ''
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedCertification: CertificationEntry) => {
    const updatedData = data.map(cert => 
      cert.id === id ? updatedCertification : cert
    );
    onChange(updatedData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(cert => cert.id !== id);
    onChange(updatedData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Keine Zertifikate hinzugefügt</p>
        ) : (
          <div className="space-y-3">
            {data.map((certification) => (
              <Card key={certification.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <h3 className="font-medium">{certification.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Ausgestellt von: {certification.issuer}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ausgestellt: {formatDate(certification.issueDate)}
                    </p>
                    {certification.description && (
                      <p className="text-sm mt-2">{certification.description}</p>
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
      {/* Add New Certification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Zertifikat hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-name">Zertifikatsname *</Label>
              <Input
                id="cert-name"
                value={newCertification.name}
                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                placeholder="z.B. AWS Certified Solutions Architect"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-issuer">Ausstellende Organisation *</Label>
              <Input
                id="cert-issuer"
                value={newCertification.issuer}
                onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                placeholder="z.B. Amazon Web Services"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cert-issue-date">Ausstellungsdatum *</Label>
            <Input
              id="cert-issue-date"
              type="date"
              value={newCertification.issueDate}
              onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-description">Beschreibung</Label>
            <Textarea
              id="cert-description"
              value={newCertification.description}
              onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
              placeholder="Kurze Beschreibung der Zertifizierung und erworbenen Fähigkeiten..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAdd}
            disabled={!newCertification.name || !newCertification.issuer || !newCertification.issueDate}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Zertifikat hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Existing Certifications */}
      {data.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deine Zertifikate</h3>
          {data.map((certification) => (
            <CertificationEditCard
              key={certification.id}
              certification={certification}
              isEditing={editingId === certification.id}
              onEdit={() => handleEdit(certification.id)}
              onSave={(updated) => handleSave(certification.id, updated)}
              onDelete={() => handleDelete(certification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CertificationEditCardProps {
  certification: CertificationEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (certification: CertificationEntry) => void;
  onDelete: () => void;
}

function CertificationEditCard({ certification, isEditing, onEdit, onSave, onDelete }: CertificationEditCardProps) {
  const [formData, setFormData] = useState<CertificationEntry>(certification);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(certification);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <CardContent className="space-y-4 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zertifikatsname</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ausstellende Organisation</Label>
              <Input
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Ausstellungsdatum</Label>
            <Input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            />
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
            <Award className="h-4 w-4 text-green-600" />
            <h3 className="font-medium">{certification.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Ausgestellt von: {certification.issuer}
          </p>
          <p className="text-sm text-muted-foreground">
            Ausgestellt: {formatDate(certification.issueDate)}
          </p>
          {certification.description && (
            <p className="text-sm mt-2">{certification.description}</p>
          )}
        </div>
        <Button onClick={onEdit} variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 