import { getJobTracker } from '@/lib/xano';
import { cookies } from 'next/headers';
import { JobTrackerResponse, JobCardData } from '@/lib/types';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const response = await getJobTracker(token);
    const data: JobTrackerResponse = response;
    
    // Transform the API data to match our UI expectations
    const transformedJobs = data.job_trackings
      .map(tracking => {
        // Check if job array exists and has at least one item
        if (!tracking.job || !Array.isArray(tracking.job) || tracking.job.length === 0) {
          console.warn('Job tracking missing job data:', tracking.id);
          return null;
        }
        
        const job = tracking.job[0];
        
        // Check if required job fields exist
        if (!job.title || !job.company) {
          console.warn('Job missing required fields:', tracking.id);
          return null;
        }
        
        return {
          id: tracking.id.toString(),
          title: job.title || 'Unknown Position',
          company: job.company?.employer_name || 'Unknown Company',
          location: job.job_city || job.job_country 
            ? `${job.job_city || ''}, ${job.job_country || ''}`.trim()
            : 'Unknown Location',
          status: tracking.status,
          isActive: !job.job_expiration,
          createdAt: tracking.created_at,
          updatedAt: tracking.application_date,
          joboffer_received: tracking.joboffer_received,
          notes: tracking.notes,
        };
      })
      .filter((job): job is JobCardData => job !== null); // Filter out null values
    
    return Response.json(transformedJobs);
  } catch (error) {
    console.error('Error fetching job tracker data:', error);
    return Response.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { title, company, location } = body;
    
    // For now, return a mock response since we don't have a create endpoint
    const newJob: JobCardData = {
      id: Date.now().toString(),
      title,
      company,
      location,
      status: 'saved',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    return Response.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return Response.json({ error: 'Failed to create job' }, { status: 500 });
  }
}