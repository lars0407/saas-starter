import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { job_id } = body;
    
    const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/job_favourite/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        job_id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error toggling job favourite:', error);
    return Response.json({ error: 'Failed to toggle job favourite' }, { status: 500 });
  }
} 