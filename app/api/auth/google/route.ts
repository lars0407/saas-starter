import { NextRequest, NextResponse } from 'next/server';
import { initiateGoogleOAuth } from '@/lib/xano';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get('redirect_uri') || `${request.nextUrl.origin}/google/success`;
    
    const response = await initiateGoogleOAuth(redirectUri);
    
    // The response should contain the Google OAuth URL to redirect to
    if (response.url) {
      return NextResponse.redirect(response.url);
    }
    
    // If no URL in response, return the response data
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
