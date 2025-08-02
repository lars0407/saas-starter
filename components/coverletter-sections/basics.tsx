'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BasicsData {
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderStreet: string;
  senderPostcode: string;
  senderCity: string;
  senderCountry: string;
}

interface BasicsProps {
  data: BasicsData;
  onChange: (data: BasicsData) => void;
  isEditing: boolean;
}

export function Basics({ data, onChange, isEditing }: BasicsProps) {
  const [formData, setFormData] = useState<BasicsData>(data);

  useEffect(() => {
    console.log('Basics component received data:', data);
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof BasicsData, value: string) => {
    console.log(`Basics input change: ${field} = "${value}"`);
    const newData = { ...formData, [field]: value };
    console.log('Basics new data:', newData);
    setFormData(newData);
    onChange(newData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Basics - Absender
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deine Kontaktdaten für das Anschreiben
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sender Name */}
        <div className="space-y-2">
          <Label htmlFor="senderName" className="text-sm font-medium">
            Name 👤
          </Label>
          <Input
            id="senderName"
            placeholder="Dein vollständiger Name"
            value={formData.senderName}
            onChange={(e) => handleInputChange('senderName', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Sender Phone */}
        <div className="space-y-2">
          <Label htmlFor="senderPhone" className="text-sm font-medium">
            Telefon 📞
          </Label>
          <Input
            id="senderPhone"
            placeholder="Deine Telefonnummer"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange('senderPhone', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Sender Email */}
        <div className="space-y-2">
          <Label htmlFor="senderEmail" className="text-sm font-medium">
            E-Mail 📧
          </Label>
          <Input
            id="senderEmail"
            type="email"
            placeholder="deine.email@example.com"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Sender Address */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Adresse 🏠
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {/* Street */}
            <div className="space-y-1">
              <Label htmlFor="senderStreet" className="text-xs text-muted-foreground">
                Straße & Hausnummer
              </Label>
              <Input
                id="senderStreet"
                placeholder="Musterstraße 123"
                value={formData.senderStreet}
                onChange={(e) => handleInputChange('senderStreet', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Postcode and City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="senderPostcode" className="text-xs text-muted-foreground">
                  PLZ
                </Label>
                <Input
                  id="senderPostcode"
                  placeholder="12345"
                  value={formData.senderPostcode}
                  onChange={(e) => handleInputChange('senderPostcode', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="senderCity" className="text-xs text-muted-foreground">
                  Stadt
                </Label>
                <Input
                  id="senderCity"
                  placeholder="Musterstadt"
                  value={formData.senderCity}
                  onChange={(e) => handleInputChange('senderCity', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <Label htmlFor="senderCountry" className="text-xs text-muted-foreground">
                Land
              </Label>
              <Input
                id="senderCountry"
                placeholder="Deutschland"
                value={formData.senderCountry}
                onChange={(e) => handleInputChange('senderCountry', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 