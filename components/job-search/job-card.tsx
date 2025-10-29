'use client';

import { JobCardData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface JobCardProps {
  job: JobCardData;
  className?: string;
  index?: number;
  onDetailsClick?: (job: JobCardData) => void;
}

export function JobCard({ job, className, index = 0, onDetailsClick }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
        isDragging && "opacity-50",
        className
      )}
    >
        <CardContent className="pt-0 px-2 md:px-4 pb-0 space-y-0.5">
          {/* Status Badge - Above Title */}
          {!job.isActive && (
            <Badge variant="destructive" className="text-xs px-1 py-0.5">
              <AlertCircle className="w-3 h-3" />
              <span className="hidden sm:inline ml-1">Nicht mehr aktiv</span>
              <span className="sm:hidden">Inaktiv</span>
            </Badge>
          )}
          
          {/* Job Title */}
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xs md:text-sm font-medium line-clamp-2 leading-tight mb-0">
              {job.title}
            </CardTitle>
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <span className="hidden sm:inline">Ähnliche Jobs ansehen</span>
              <span className="sm:hidden">Ähnliche</span>
            </Badge>
            {job.status === 'interviewing' && job.joboffer_received && (
              <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600 px-1.5 py-0.5">
                <span className="hidden sm:inline">Job bekommen</span>
                <span className="sm:hidden">Job ✓</span>
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 pt-0.5">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs h-7 md:h-8"
              onClick={(e) => {
                e.stopPropagation();
                onDetailsClick?.(job);
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Details</span>
              <span className="sm:hidden">Info</span>
            </Button>
          </div>
        </CardContent>
      </Card>
  );
} 