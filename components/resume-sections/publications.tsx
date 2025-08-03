'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Trash2, FileText, ExternalLink } from 'lucide-react';

// Helper function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long'
  });
};

// Helper function for type labels
const getTypeLabel = (type: string) => {
  const labels = {
    article: 'Artikel',
    book: 'Buch',
    conference: 'Konferenz',
    thesis: 'Abschlussarbeit',
    patent: 'Patent',
    other: 'Sonstiges'
  };
  return labels[type as keyof typeof labels] || type;
};

export interface PublicationEntry {
  id: string;
  title: string;
  authors: string;
  publicationDate: string;
  journal?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  type: 'article' | 'book' | 'conference' | 'thesis' | 'patent' | 'other';
}

interface PublicationsProps {
  data: PublicationEntry[];
  onChange: (data: PublicationEntry[]) => void;
  isEditing: boolean;
}

export function Publications({ data, onChange, isEditing }: PublicationsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPublication, setNewPublication] = useState<Partial<PublicationEntry>>({
    title: '',
    authors: '',
    publicationDate: '',
    journal: '',
    publisher: '',
    doi: '',
    url: '',
    abstract: '',
    type: 'article'
  });

  const handleAdd = () => {
    if (!newPublication.title || !newPublication.authors || !newPublication.publicationDate) {
      return;
    }

    const publication: PublicationEntry = {
      id: Date.now().toString(),
      title: newPublication.title,
      authors: newPublication.authors,
      publicationDate: newPublication.publicationDate,
      journal: newPublication.journal || undefined,
      publisher: newPublication.publisher || undefined,
      doi: newPublication.doi || undefined,
      url: newPublication.url || undefined,
      abstract: newPublication.abstract || undefined,
      type: newPublication.type || 'article'
    };

    onChange([...data, publication]);
    setNewPublication({
      title: '',
      authors: '',
      publicationDate: '',
      journal: '',
      publisher: '',
      doi: '',
      url: '',
      abstract: '',
      type: 'article'
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedPublication: PublicationEntry) => {
    const updatedData = data.map(pub => 
      pub.id === id ? updatedPublication : pub
    );
    onChange(updatedData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(pub => pub.id !== id);
    onChange(updatedData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Keine Publikationen hinzugefügt</p>
        ) : (
          <div className="space-y-3">
            {data.map((publication) => (
              <Card key={publication.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <h3 className="font-medium">{publication.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(publication.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Autoren: {publication.authors}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Veröffentlicht: {formatDate(publication.publicationDate)}
                      {publication.journal && ` • Journal: ${publication.journal}`}
                      {publication.publisher && ` • Verlag: ${publication.publisher}`}
                    </p>
                    {publication.abstract && (
                      <p className="text-sm mt-2">{publication.abstract}</p>
                    )}
                    {(publication.doi || publication.url) && (
                      <div className="flex gap-2 mt-2">
                        {publication.doi && (
                          <a 
                            href={`https://doi.org/${publication.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            DOI: {publication.doi}
                          </a>
                        )}
                        {publication.url && (
                          <a 
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Link
                          </a>
                        )}
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
      {/* Add New Publication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Publikation hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pub-title">Titel *</Label>
              <Input
                id="pub-title"
                value={newPublication.title}
                onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                placeholder="Titel der Publikation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-type">Typ</Label>
              <select
                id="pub-type"
                value={newPublication.type}
                onChange={(e) => setNewPublication({ ...newPublication, type: e.target.value as PublicationEntry['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="article">Artikel</option>
                <option value="book">Buch</option>
                <option value="conference">Konferenz</option>
                <option value="thesis">Abschlussarbeit</option>
                <option value="patent">Patent</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pub-authors">Autoren *</Label>
              <Input
                id="pub-authors"
                value={newPublication.authors}
                onChange={(e) => setNewPublication({ ...newPublication, authors: e.target.value })}
                placeholder="Autoren (durch Kommas getrennt)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-date">Veröffentlichungsdatum *</Label>
              <Input
                id="pub-date"
                type="date"
                value={newPublication.publicationDate}
                onChange={(e) => setNewPublication({ ...newPublication, publicationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pub-journal">Journal/Zeitschrift</Label>
              <Input
                id="pub-journal"
                value={newPublication.journal}
                onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })}
                placeholder="Name des Journals"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-publisher">Verlag</Label>
              <Input
                id="pub-publisher"
                value={newPublication.publisher}
                onChange={(e) => setNewPublication({ ...newPublication, publisher: e.target.value })}
                placeholder="Name des Verlags"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pub-doi">DOI</Label>
              <Input
                id="pub-doi"
                value={newPublication.doi}
                onChange={(e) => setNewPublication({ ...newPublication, doi: e.target.value })}
                placeholder="10.1000/xyz123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-url">URL</Label>
              <Input
                id="pub-url"
                type="url"
                value={newPublication.url}
                onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-abstract">Abstract</Label>
            <Textarea
              id="pub-abstract"
              value={newPublication.abstract}
              onChange={(e) => setNewPublication({ ...newPublication, abstract: e.target.value })}
              placeholder="Kurze Zusammenfassung der Publikation..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAdd}
            disabled={!newPublication.title || !newPublication.authors || !newPublication.publicationDate}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Publikation hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Existing Publications */}
      {data.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deine Publikationen</h3>
          {data.map((publication) => (
            <PublicationEditCard
              key={publication.id}
              publication={publication}
              isEditing={editingId === publication.id}
              onEdit={() => handleEdit(publication.id)}
              onSave={(updated) => handleSave(publication.id, updated)}
              onDelete={() => handleDelete(publication.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PublicationEditCardProps {
  publication: PublicationEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (publication: PublicationEntry) => void;
  onDelete: () => void;
}

function PublicationEditCard({ publication, isEditing, onEdit, onSave, onDelete }: PublicationEditCardProps) {
  const [formData, setFormData] = useState<PublicationEntry>(publication);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(publication);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <CardContent className="space-y-4 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PublicationEntry['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="article">Artikel</option>
                <option value="book">Buch</option>
                <option value="conference">Konferenz</option>
                <option value="thesis">Abschlussarbeit</option>
                <option value="patent">Patent</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Autoren</Label>
              <Input
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Veröffentlichungsdatum</Label>
              <Input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Journal/Zeitschrift</Label>
              <Input
                value={formData.journal || ''}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Verlag</Label>
              <Input
                value={formData.publisher || ''}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>DOI</Label>
              <Input
                value={formData.doi || ''}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Abstract</Label>
            <Textarea
              value={formData.abstract || ''}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value || undefined })}
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
            <FileText className="h-4 w-4 text-purple-600" />
            <h3 className="font-medium">{publication.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel(publication.type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Autoren: {publication.authors}
          </p>
          <p className="text-sm text-muted-foreground">
            Veröffentlicht: {formatDate(publication.publicationDate)}
            {publication.journal && ` • Journal: ${publication.journal}`}
            {publication.publisher && ` • Verlag: ${publication.publisher}`}
          </p>
          {publication.abstract && (
            <p className="text-sm mt-2">{publication.abstract}</p>
          )}
          {(publication.doi || publication.url) && (
            <div className="flex gap-2 mt-2">
              {publication.doi && (
                <a 
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  DOI: {publication.doi}
                </a>
              )}
              {publication.url && (
                <a 
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Link
                </a>
              )}
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