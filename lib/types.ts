export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'archived';

export interface Company {
  id: number;
  created_at: string;
  uuid?: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  employer_company_type?: string;
  employer_linkedin?: string;
  company_identifier: number;
  about?: string;
  short_description?: string;
  founded?: string;
  company_size?: string;
}

export interface Job {
  id: number;
  created_at: string;
  uuid?: string;
  company_id: number;
  title: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_employement_type: string;
  salary: string;
  seniority: string;
  job_origin: string;
  job_expiration?: boolean;
  job_identifier: number;
  job_posted?: string;
  posted_date?: string;
  date?: string;
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
  job_geopoint: string;
  recruiter: {
    recruiter_name: string;
    recruiter_title: string;
    recruiter_url: string;
  };
  company: Company;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
}

export interface JobTracking {
  id: number;
  created_at: string;
  status: JobStatus;
  joboffer_received: boolean;
  application_date?: string;
  notes?: string;
  interview_question: InterviewQuestion[];
  job: Job[];
}

export interface JobTrackerResponse {
  job_trackings: JobTracking[];
}

export interface JobColumn {
  id: JobStatus;
  title: string;
  subtitle: string;
  emoji: string;
  emptyMessage: string;
}

// Helper interface for the UI
export interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  joboffer_received?: boolean;
  notes?: string;
} 