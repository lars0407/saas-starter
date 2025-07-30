import { updateJobTrackingStatus } from '@/lib/xano';
import { cookies } from 'next/headers';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { status } = body;
    
    // Update the job tracking status using the real API
    const trackingId = parseInt(params.id);
    const updatedJob = await updateJobTrackingStatus(token, trackingId, status);
    
    return Response.json(updatedJob);
  } catch (error) {
    console.error('Error updating job status:', error);
    return Response.json({ error: 'Failed to update job' }, { status: 500 });
  }
} 