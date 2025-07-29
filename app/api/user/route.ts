import { getCurrentUser } from '@/lib/xano';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await getCurrentUser(token);
    return Response.json(user);
  } catch (error) {
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
