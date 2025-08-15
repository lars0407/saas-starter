'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  publishDate,
  getActivePublishedDates,
  formatTimeRemaining,
  isDateActive,
  getIntervalLabel,
  getIntervalDescription,
  getIntervalValue,
  type PublishedDate,
  type DatePublishingOptions
} from '@/lib/date-publisher';
import { savePublishedDate } from '@/lib/api-client';

interface DatePublisherProps {
  onDatePublished?: (publishedDate: PublishedDate) => void;
  metadata?: Record<string, any>;
  className?: string;
}

export function DatePublisher({ onDatePublished, metadata, className }: DatePublisherProps) {
  const [activeDates, setActiveDates] = useState<PublishedDate[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Refresh active dates
  const refreshActiveDates = () => {
    const dates = getActivePublishedDates();
    setActiveDates(dates);
  };

  // Load active dates on component mount
  useEffect(() => {
    refreshActiveDates();
    
    // Set up interval to refresh dates every minute
    const interval = setInterval(refreshActiveDates, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle date publishing
  const handlePublishDate = async (interval: '1d' | '3d' | '7d' | '30d') => {
    try {
      setIsPublishing(true);
      
      // Publish date locally
      const publishedDate = publishDate(interval, {
        metadata: {
          ...metadata,
          source: 'resume-generator',
          timestamp: new Date().toISOString()
        }
      });
      
      // Save to database if documentId is available
      if (metadata?.documentId) {
        try {
          const intervalValue = getIntervalValue(interval);
          await savePublishedDate(
            metadata.documentId,
            intervalValue, // Speichert 1, 3, 7 oder 30 in der Datenbank
            {
              ...metadata,
              interval,
              publishedAt: new Date().toISOString()
            }
          );
          console.log(`Date published in database with value: ${intervalValue}`);
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Don't fail the entire operation if database save fails
          toast.warning('Lokal gespeichert, aber Datenbank-Update fehlgeschlagen');
        }
      }
      
      // Refresh active dates
      refreshActiveDates();
      
      // Notify parent component
      if (onDatePublished) {
        onDatePublished(publishedDate);
      }
      
      toast.success(`Datum erfolgreich veröffentlicht für ${getIntervalLabel(interval)}! 🗓️`);
    } catch (error) {
      console.error('Error publishing date:', error);
      toast.error('Fehler beim Veröffentlichen des Datums');
    } finally {
      setIsPublishing(false);
    }
  };

  // Get interval button variant based on active dates
  const getIntervalButtonVariant = (interval: '1d' | '3d' | '7d' | '30d') => {
    const hasActiveDate = activeDates.some(date => date.interval === interval && isDateActive(date));
    return hasActiveDate ? 'default' : 'outline';
  };

  // Get interval button icon
  const getIntervalButtonIcon = (interval: '1d' | '3d' | '7d' | '30d') => {
    const hasActiveDate = activeDates.some(date => date.interval === interval && isDateActive(date));
    return hasActiveDate ? <CheckCircle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Datum veröffentlichen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Publishing Options */}
          <div className="grid grid-cols-2 gap-3">
            {(['1d', '3d', '7d', '30d'] as const).map((interval) => (
              <Button
                key={interval}
                variant={getIntervalButtonVariant(interval)}
                onClick={() => handlePublishDate(interval)}
                disabled={isPublishing}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                {getIntervalButtonIcon(interval)}
                <span className="font-medium">{getIntervalLabel(interval)}</span>
                <span className="text-xs opacity-75">{getIntervalDescription(interval)}</span>
              </Button>
            ))}
          </div>

          {/* Active Dates Display */}
          {activeDates.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Aktive Veröffentlichungen
              </h4>
              <div className="space-y-2">
                {activeDates.map((date) => (
                  <div
                    key={date.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {getIntervalLabel(date.interval)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Veröffentlicht am {date.date.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatTimeRemaining(date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Text */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Veröffentlichte Daten werden automatisch nach Ablauf der gewählten Zeit gelöscht. 
                Sie können mehrere Veröffentlichungen mit unterschiedlichen Zeiträumen gleichzeitig haben.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
