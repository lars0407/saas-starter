import { updateJobTrackerStatus } from '@/lib/xano';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { job_id, status, application_date, notes, interview_question } = body;
    
    // Update the job tracking status using the real API
    const result = await updateJobTrackerStatus(
      token, 
      job_id, 
      status, 
      application_date, 
      notes, 
      interview_question
    );
    
    return Response.json(result);
  } catch (error) {
    console.error('Error updating job tracker status:', error);
    return Response.json({ error: 'Failed to update job status' }, { status: 500 });
  }
} 