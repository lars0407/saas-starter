import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2 md:pb-3 px-3 md:px-6">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3 md:h-4 w-3/4" />
          <Skeleton className="h-4 md:h-5 w-16 md:w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 md:px-6 pb-3 md:pb-6 space-y-2 md:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 flex-shrink-0" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 flex-shrink-0" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-4 md:h-5 w-20 md:w-24" />
          <Skeleton className="h-4 md:h-5 w-16 md:w-20" />
        </div>
        
        <Skeleton className="h-8 md:h-9 w-full" />
      </CardContent>
    </Card>
  );
} 