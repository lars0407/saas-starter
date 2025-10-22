'use client';

import { AgentEvent, ApplicationDetails } from '../types';
import { EventCard } from './event-card';
import { LoadingState } from './loading-state';
import { LoadingEvent, LoadingTask } from '../types';
import { Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventTimelineProps {
  events: AgentEvent[];
  applicationDetails: ApplicationDetails | null;
  expandedEvents: Set<string>;
  isLoading: boolean;
  loadingEvent: LoadingEvent | null;
  loadingTasks: LoadingTask[];
  onToggleEventExpansion: (eventId: string) => void;
}

export function EventTimeline({
  events,
  applicationDetails,
  expandedEvents,
  isLoading,
  loadingEvent,
  loadingTasks,
  onToggleEventExpansion,
}: EventTimelineProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 py-4 pb-32 space-y-4">
      {/* Queued Status Message */}
      {applicationDetails?.application?.status === 'application_queued' && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600 animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🔥 Wir arbeiten an deiner Bewerbung!
                </h3>
                <p className="text-gray-700 mb-3">
                  Chill, wir haben deine Bewerbung in der Pipeline und optimieren alles für dich. 
                  Das dauert normalerweise so ~5 Minuten.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Komm später wieder oder wir informieren dich direkt! 📱</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          applicationDetails={applicationDetails}
          expandedEvents={expandedEvents}
          onToggleExpansion={onToggleEventExpansion}
        />
      ))}
      
      {/* Loading State */}
      <LoadingState
        isLoading={isLoading}
        loadingEvent={loadingEvent}
        loadingTasks={loadingTasks}
      />
    </div>
  );
}
