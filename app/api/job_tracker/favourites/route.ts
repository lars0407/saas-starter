import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/job/favourites/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching job favourites:', error);
    return Response.json({ error: 'Failed to fetch job favourites' }, { status: 500 });
  }
} 