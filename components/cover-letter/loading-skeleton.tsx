'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, PenTool } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5 animate-pulse" />
            <PenTool className="h-5 w-5 animate-pulse" />
          </div>
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loading Animation */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-primary">
                Wir schreiben dein Meisterwerk... 🧠✍️
              </p>
              <p className="text-sm text-muted-foreground">
                KI denkt nach – gib ihr ein paar Sekunden
              </p>
            </div>
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Skeleton Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
} 