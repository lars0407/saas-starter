'use client';

import { useState, useEffect, useRef } from 'react';
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
  arrayMove,
} from '@dnd-kit/sortable';
import { JobCardData, JobStatus, JobColumn, Job } from '@/lib/types';
import { JobColumn as JobColumnComponent } from './job-column';
import { JobCard } from './job-card';
import { JobDetailComponent } from './job-detail-component';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Network, Mail, StickyNote, Loader2, Save } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

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
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const editorRef = useRef<any>(null);

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

  // Update notes when jobDetails changes
  useEffect(() => {
    if (jobDetails?.notes) {
      setNotes(jobDetails.notes);
    } else if (selectedJob?.notes) {
      setNotes(selectedJob.notes);
    } else {
      setNotes('');
    }
  }, [jobDetails, selectedJob]);

  const saveNotes = async () => {
    if (!selectedJob) return;

    setIsSavingNotes(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        toast.error('Nicht authentifiziert. Bitte melden Sie sich erneut an.');
        return;
      }

      const response = await fetch('/api/job_tracker/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          job_id: parseInt(selectedJob.id), 
          status: selectedJob.status,
          notes: notes
        }),
      });

      if (!response.ok) throw new Error('Failed to update notes');

      toast.success('Notizen gespeichert!');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Fehler beim Speichern der Notizen');
    } finally {
      setIsSavingNotes(false);
    }
  };

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
      const response = await fetch('/api/job_tracker/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          job_id: parseInt(jobId), 
          status: newStatus 
        }),
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
    const overId = over.id as string;

    // Find the job
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Check if dropping on a column (status change)
    const validStatuses: JobStatus[] = ['saved', 'applied', 'interviewing', 'archived'];
    if (validStatuses.includes(overId as JobStatus)) {
      const newStatus = overId as JobStatus;
      if (job.status !== newStatus) {
        updateJobStatus(jobId, newStatus);
      }
      return;
    }

    // Check if dropping on another job
    const targetJob = jobs.find(j => j.id === overId);
    if (targetJob) {
      if (targetJob.status === job.status) {
        // Reordering within the same column - let the sortable context handle it
        // We don't need to manually reorder here since the sortable context will do it
        console.log('Reordering within same column');
      } else {
        // Moving to a different column
        updateJobStatus(jobId, targetJob.status);
      }
    }
  };



  const getJobsForColumn = (status: JobStatus) => {
    return jobs.filter(job => job.status === status);
  };

  const transformJobDetailsToJob = (jobDetails: any): Job | null => {
    if (!jobDetails || !jobDetails.job || !jobDetails.job[0]) return null;

    const apiJob = jobDetails.job[0];
    
    return {
      id: apiJob.id,
      title: apiJob.title || '',
      company: apiJob.company || {},
      job_city: apiJob.job_city || '',
      job_state: apiJob.job_state || '',
      job_country: apiJob.job_country || '',
      job_employement_type: apiJob.job_employement_type || '',
      salary: apiJob.salary || '',
      seniority: apiJob.seniority || '',
      job_posted: apiJob.job_posted || 0,
      apply_link: apiJob.apply_link || '',
      applicants_number: apiJob.applicants_number || '',
      working_hours: apiJob.working_hours || '',
      remote_work: apiJob.remote_work || '',
      source: apiJob.source || '',
      description: apiJob.description || {},
      job_geopoint: apiJob.job_geopoint || '',
      recruiter: apiJob.recruiter || {},
      created_at: apiJob.created_at || 0,
      uuid: apiJob.uuid || '',
      company_id: apiJob.company_id || 0,
      job_origin: apiJob.job_origin || '',
      job_expiration: apiJob.job_expiration || false,
      job_identifier: apiJob.job_identifier || '',
      auto_apply: apiJob.auto_apply || false,
      recruitment_agency: apiJob.recruitment_agency || false,
    };
  };

  const handleDetailsClick = async (job: JobCardData) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
    setIsLoadingDetails(true);
    setJobDetails(null);
    
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        toast.error('Nicht authentifiziert. Bitte melden Sie sich erneut an.');
        return;
      }

      // Fetch job details
      const response = await fetch(
        `https://api.jobjaeger.de/api:9BqVCxJj/job_tracker/single?job_tracker_id=${job.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Nicht autorisiert. Bitte melden Sie sich erneut an.');
        } else if (response.status === 404) {
          toast.error('Job-Details nicht gefunden.');
        } else {
          toast.error(`Fehler beim Laden der Job-Details. Status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setJobDetails(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Fehler beim Laden der Job-Details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 md:mb-6 px-4 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold">Jobtracker</h1>
        <p className="text-sm md:text-base text-muted-foreground">
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
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 h-full overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
            {COLUMNS.map((column) => (
              <div key={column.id} className="min-w-[280px] md:min-w-0 md:w-auto">
                <JobColumnComponent
                  column={column}
                  jobs={getJobsForColumn(column.id)}
                  isLoading={isLoading}
                  onDetailsClick={handleDetailsClick}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Job Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:w-[600px] lg:w-[700px] sm:max-w-[600px] lg:max-w-[700px] overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedJob.title}</SheetTitle>
                <SheetDescription>
                  {selectedJob.company} • {selectedJob.location}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details" className="text-xs">
                    <Eye className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs">
                    <FileText className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="network" className="text-xs">
                    <Network className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="email" className="text-xs">
                    <Mail className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">
                    <StickyNote className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  {isLoadingDetails ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0F973D]" />
                    </div>
                  ) : jobDetails && transformJobDetailsToJob(jobDetails) ? (
                    <div className="overflow-y-auto max-h-[calc(100vh-20rem)] -mx-6 px-6">
                      <JobDetailComponent 
                        job={transformJobDetailsToJob(jobDetails) || undefined} 
                        hideCompanyInfo={false}
                        hideTopLogo={true}
                        hideDocumentsButton={true}
                        hideDocumentsSection={true}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Keine Details verfügbar.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Keine Dokumente für diesen Job vorhanden.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="network" className="mt-4">
                  <div className="text-center py-8">
                    <Network className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Kein Netzwerk für diesen Job vorhanden.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="mt-4">
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Keine E-Mails für diesen Job vorhanden.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="space-y-4 px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notizen</h3>
                      <Button 
                        onClick={saveNotes}
                        disabled={isSavingNotes}
                        size="sm"
                        className="bg-[#0F973D] hover:bg-[#0F973D]/90"
                      >
                        {isSavingNotes ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Speichern...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Speichern
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Editor
                        tinymceScriptSrc='/tinymce/tinymce.min.js'
                        licenseKey='gpl'
                        onInit={(_evt, editor) => {
                          editorRef.current = editor;
                        }}
                        onEditorChange={(content) => {
                          setNotes(content);
                        }}
                        value={notes}
                        init={{
                          height: 400,
                          menubar: false,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding: 16px !important; }',
                          body_class: 'p-4'
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
} 