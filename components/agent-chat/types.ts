export interface StepDetail {
  id: string;
  description: string;
  url?: string;
  status: 'completed' | 'pending' | 'error';
  timestamp?: Date;
}

export interface AgentEvent {
  id: string;
  type: 'message' | 'action' | 'status' | 'error';
  timestamp: Date;
  content: string;
  status?: 'pending' | 'success' | 'error';
  stepCount?: number;
  stepDetails?: StepDetail[];
  metadata?: {
    jobTitle?: string;
    company?: string;
    location?: string;
    salary?: string;
    employmentType?: string;
    seniority?: string;
    jobDescription?: string;
    jobOrigin?: string;
    applicationId?: string;
    isSuccessfulApplication?: boolean;
    jobUrls?: string[];
    additionalInfo?: string;
    outputVideoUrl?: string;
    workflowRuns?: number;
  };
}

export interface Document {
  id: number;
  created_at: number;
  updated_at: number;
  type: "resume" | "cover letter";
  preview_link: string;
  name: string;
  storage_path: string;
  variant: "human" | "ai";
  url: string;
}

export interface ApplicationDetails {
  application: {
    id: number;
    created_at: number;
    job_id: number;
    user_id: number;
    updated_at: number | null;
    status: string;
    mode: string;
    events: Array<{
      event_id: number;
      timestamp: number;
      event_type: string;
      event_status: string;
    }>;
    settings: any;
    stop: boolean;
    job_tracker_id: number;
    document_id: number;
    auto_apply_id: number;
    job: Array<{
      id: number;
      created_at: number;
      uuid: string | null;
      company_id: number;
      title: string;
      job_city: string;
      job_state: string;
      job_country: string;
      job_employement_type: string;
      salary: string;
      seniority: string;
      job_origin: string;
      job_expiration: number | null;
      job_identifier: number;
      job_posted: number | null;
      apply_link: string;
      applicants_number: string;
      working_hours: string;
      remote_work: string;
      source: string;
      auto_apply: boolean;
      recruitment_agency: boolean;
      description: {
        description_original: string;
        description_responsibilities: string;
        description_qualification: string;
        description_benefits: string;
      };
      recruiter: {
        recruiter_name: string;
        recruiter_title: string;
        recruiter_url: string;
      };
      company: {
        id: number;
        created_at: number;
        uuid: string | null;
        employer_name: string;
        employer_logo: string;
        employer_website: string;
        employer_company_type: string;
        employer_linkedin: string;
        company_identifier: number;
        about: string;
        short_description: string;
        founded: string;
        company_size: string;
      };
    }>;
  };
  auto_apply: {
    created_at: number;
    status: string;
    output: string;
    application_data: string;
    output_video_url: string;
    workflow_runs: number;
  };
  documents: {
    document_list: Array<{
      id: number;
      type: string;
      link: string;
      job_tracker_id: number;
    }>;
    job_tracker: {
      id: number;
      created_at: number;
      user_id: number;
      job_id: number;
      status: string;
      joboffer_received: boolean;
      application_date: number | null;
      notes: string;
      interview_question: any[];
    };
  };
}

export interface JobDetails {
  title: string;
  description: string;
  url: string;
}

export interface LoadingEvent {
  type: 'message' | 'action' | 'status' | 'error';
  content: string;
  metadata?: any;
}

export interface LoadingTask {
  text: string;
  done: boolean;
}
