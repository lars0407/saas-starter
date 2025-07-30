import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-muted/30", className)}>
      <CardContent className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground text-center">
          {message}
        </p>
      </CardContent>
    </Card>
  );
} 