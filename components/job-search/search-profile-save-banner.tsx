'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchProfileSaveBannerProps {
  onClose: () => void;
  className?: string;
}

export function SearchProfileSaveBanner({
  onClose,
  className,
}: SearchProfileSaveBannerProps) {
  return (
    <Alert
      className={cn(
        'border-[#0F973D]/30 bg-[#F0FDF4] text-[#0B5C24]',
        'flex flex-col gap-1 md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="space-y-1">
        <AlertTitle className="text-[#0B5C24]">
          Suchprofil gespeichert
        </AlertTitle>
        <AlertDescription className="text-sm text-[#166534]">
          Es kann bis zu 2 Minuten dauern, bis der Agent neue Jobs findet und
          analysiert. Wir benachrichtigen dich, sobald neue Empfehlungen bereit
          sind.
        </AlertDescription>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Banner schließen"
        onClick={onClose}
        className="text-[#0B5C24] hover:bg-[#DCFCE7]"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}


