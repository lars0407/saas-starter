'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { JobCardData, JobStatus, JobColumn } from '@/lib/types';
import { JobColumn as JobColumnComponent } from './job-column';
import { JobCard } from './job-card';
import { toast } from 'sonner';

const COLUMNS: JobColumn[] = [
  {
    id: 'saved',
    title: 'Gespeichert',
    subtitle: 'vielleicht später 🤔',
    emoji: '💾',
    emptyMessage: 'Noch nix gespeichert. Füge Jobs hinzu, die du spannend findest!',
  },
  {
    id: 'applied',
    title: 'Bewerbung',
    subtitle: 'raus – Daumen drücken ✨',
    emoji: '📤',
    emptyMessage: 'Du hast noch keine Bewerbung rausgeschickt. Let\'s go!',
  },
  {
    id: 'interviewing',
    title: 'Interview',
    subtitle: 'Zeit zu glänzen 💼',
    emoji: '🎯',
    emptyMessage: 'Aktuell kein Interview – bald ist\'s soweit!',
  },
  {
    id: 'archived',
    title: 'Archiv',
    subtitle: 'beim nächsten Mal klappt\'s 💪',
    emoji: '📁',
    emptyMessage: 'Hier landen alle Bewerbungen, die vorbei sind. Next time 💥',
  },
];

export function JobtrackerBoard() {
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<JobCardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/job_tracker');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Fehler beim Laden der Jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: JobStatus) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update job status');

      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );

      toast.success('Job Status aktualisiert!');
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Fehler beim Aktualisieren des Job Status');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find(j => j.id === event.active.id);
    setActiveJob(job || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    // Find the job and check if status actually changed
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status === newStatus) return;

    // Update job status
    updateJobStatus(jobId, newStatus);
  };

  const getJobsForColumn = (status: JobStatus) => {
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Jobtracker</h1>
        <p className="text-muted-foreground">
          Verwalte deine Jobbewerbungen visuell
        </p>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col min-w-0">
                <SortableContext
                  items={getJobsForColumn(column.id).map(job => job.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <JobColumnComponent
                    column={column}
                    jobs={getJobsForColumn(column.id)}
                    isLoading={isLoading}
                  />
                </SortableContext>
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
} 