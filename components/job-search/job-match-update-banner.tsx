'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobMatchUpdateBannerProps {
  newMatchesCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function JobMatchUpdateBanner({
  newMatchesCount,
  onRefresh,
  isRefreshing = false,
  className,
}: JobMatchUpdateBannerProps) {
  // Don't render if no new matches
  if (newMatchesCount <= 0) {
    return null;
  }

  return (
    <Alert
      className={cn(
        'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        className
      )}
    >
      <AlertTitle className="text-blue-900 dark:text-blue-100">
        Neue Matches verfügbar
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4 text-blue-800 dark:text-blue-200">
        <span>
          {newMatchesCount === 1
            ? '1 neues Match verfügbar'
            : `${newMatchesCount} neue Matches verfügbar`}
          {' – '}
          <span className="font-medium">Liste aktualisieren</span>
        </span>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="shrink-0 border-blue-300 bg-white text-blue-900 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
        >
          <RefreshCw
            className={cn(
              'mr-2 h-4 w-4',
              isRefreshing && 'animate-spin'
            )}
          />
          Aktualisieren
        </Button>
      </AlertDescription>
    </Alert>
  );
}



