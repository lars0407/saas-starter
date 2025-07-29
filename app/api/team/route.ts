export async function GET() {
  // Team functionality is not available with Xano auth
  return Response.json({ 
    message: 'Team functionality is not available',
    note: 'This application uses Xano for authentication without team management'
  });
}
