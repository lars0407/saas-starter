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
  senderAddress: string;
}

interface BasicsProps {
  data: BasicsData;
  onChange: (data: BasicsData) => void;
  isEditing: boolean;
}

export function Basics({ data, onChange, isEditing }: BasicsProps) {
  const [formData, setFormData] = useState<BasicsData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof BasicsData, value: string) => {
    const newData = { ...formData, [field]: value };
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
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
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
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
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
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
        </div>

        {/* Sender Address */}
        <div className="space-y-2">
          <Label htmlFor="senderAddress" className="text-sm font-medium">
            Adresse 🏠
          </Label>
          <Textarea
            id="senderAddress"
            placeholder="Deine vollständige Adresse"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            rows={3}
            disabled={!isEditing}
            className="focus:border-[#0F973D] focus:ring-[#0F973D]/20"
          />
        </div>
      </CardContent>
    </Card>
  );
} 