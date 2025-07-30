'use client';

import { JobCardData, JobColumn as JobColumnType } from '@/lib/types';
import { JobCard } from './job-card';
import { JobCardSkeleton } from './job-card-skeleton';
import { EmptyState } from './empty-state';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface JobColumnProps {
  column: JobColumnType;
  jobs: JobCardData[];
  isLoading?: boolean;
  className?: string;
  onSortEnd?: (event: any) => void;
}

export function JobColumn({ column, jobs, isLoading = false, className, onSortEnd }: JobColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Column Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {column.emoji} {column.title}
        </h3>
        <p className="text-sm text-muted-foreground">{column.subtitle}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[400px] rounded-lg border-2 border-dashed transition-colors",
          isOver ? "border-primary bg-primary/5" : "border-muted bg-muted/20"
        )}
      >
        <div className="p-4">
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            // Job cards with SortableContext
            <SortableContext
              items={jobs.map(job => job.id)}
              strategy={verticalListSortingStrategy}
              onSortEnd={onSortEnd}
            >
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
            </SortableContext>
          ) : (
            // Empty state
            <EmptyState message={column.emptyMessage} />
          )}
        </div>
      </div>
    </div>
  );
} 