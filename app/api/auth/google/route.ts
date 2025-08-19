import { NextRequest, NextResponse } from 'next/server';
import { initiateGoogleOAuth } from '@/lib/xano';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get('redirect_uri') || `${request.nextUrl.origin}/google/success`;
    
    console.log('Google OAuth initiation started');
    console.log('Redirect URI:', redirectUri);
    
    const response = await initiateGoogleOAuth(redirectUri);
    console.log('Xano response:', response);
    
    // The response should contain the Google OAuth URL to redirect to
    if (response && response.url) {
      console.log('Redirecting to Google OAuth URL:', response.url);
      return NextResponse.redirect(response.url);
    }
    
    // If no URL in response, check if there's an error
    if (response && response.error) {
      console.error('Xano returned error:', response.error);
      return NextResponse.redirect(`${request.nextUrl.origin}/google/success?error=oauth_failed&message=${encodeURIComponent(response.error)}`);
    }
    
    // If response is empty or unexpected, redirect to error page
    console.error('Unexpected response from Xano:', response);
    return NextResponse.redirect(`${request.nextUrl.origin}/google/success?error=oauth_failed&message=${encodeURIComponent('Unexpected response from OAuth provider')}`);
    
  } catch (error: any) {
    console.error('Google OAuth initiation error:', error);
    
    // Redirect to error page with error details
    const errorMessage = error.message || 'Unknown error occurred';
    return NextResponse.redirect(`${request.nextUrl.origin}/google/success?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`);
  }
}
