import { NextRequest, NextResponse } from 'next/server';
import { continueGoogleOAuth } from '@/lib/xano';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const redirectUri = searchParams.get('redirect_uri') || `${request.nextUrl.origin}/google/success`;
    
    if (!code) {
      return NextResponse.redirect(`${request.nextUrl.origin}/sign-in?error=missing_code`);
    }
    
    const response = await continueGoogleOAuth(code, redirectUri);
    
    // The response should contain user data and token
    if (response.token) {
      // Set the token in a cookie
      const responseObj = NextResponse.redirect(`${request.nextUrl.origin}/google/success?token=${response.token}&name=${encodeURIComponent(response.name || '')}&email=${encodeURIComponent(response.email || '')}`);
      responseObj.cookies.set('token', response.token, {
        path: '/',
        maxAge: 86400,
        secure: true,
        sameSite: 'strict'
      });
      return responseObj;
    }
    
    // If no token, redirect to success page with error
    return NextResponse.redirect(`${request.nextUrl.origin}/google/success?error=auth_failed`);
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in?error=oauth_failed`);
  }
}
