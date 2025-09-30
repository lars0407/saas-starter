'use client';

import { AgentEvent, ApplicationDetails } from '../types';
import { EventCard } from './event-card';
import { LoadingState } from './loading-state';
import { LoadingEvent, LoadingTask } from '../types';

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
