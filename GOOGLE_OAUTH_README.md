# Google OAuth Integration

This project now includes Google OAuth integration using Xano as the backend service.

## How It Works

### 1. OAuth Flow
1. User clicks "Mit Google anmelden" or "Mit Google registrieren" button
2. User is redirected to `/api/auth/google` which initiates the OAuth flow
3. User is redirected to Google's OAuth consent screen
4. After authorization, Google redirects back to `/api/auth/google/callback`
5. The callback processes the OAuth response and sets the authentication token
6. User is redirected to `/google/success` with success/error status
7. On success, user is automatically redirected to the dashboard

### 2. API Endpoints

#### `/api/auth/google`
- **Method**: GET
- **Purpose**: Initiates Google OAuth flow
- **Query Parameters**: 
  - `redirect_uri` (optional): Custom redirect URI, defaults to `/google/success`

#### `/api/auth/google/callback`
- **Method**: GET
- **Purpose**: Handles OAuth callback from Google
- **Query Parameters**:
  - `code`: OAuth authorization code from Google
  - `redirect_uri`: Redirect URI for the OAuth flow

#### `/google/success`
- **Purpose**: Success/error page for OAuth flow
- **Query Parameters**:
  - `token`: Authentication token (on success)
  - `name`: User's name (on success)
  - `email`: User's email (on success)
  - `error`: Error type (on failure)

### 3. Components

#### `GoogleOAuthButton`
A reusable component that handles Google OAuth initiation:
- **Props**:
  - `variant`: "login" | "signup" - Changes button text accordingly
  - `className`: Additional CSS classes
  - `disabled`: Whether the button is disabled

#### Usage:
```tsx
import { GoogleOAuthButton } from "@/components/google-oauth-button"

// For login
<GoogleOAuthButton variant="login" />

// For signup
<GoogleOAuthButton variant="signup" />
```

### 4. Xano Integration

The integration uses Xano's Google OAuth API endpoints:
- **Base URL**: `https://api.jobjaeger.de/api:U0aE1wpF`
- **Endpoints**:
  - `/oauth/google/init` - Start OAuth flow
  - `/oauth/google/continue` - Handle OAuth callback (auto-detects login/signup)
  - `/oauth/google/login` - Login only
  - `/oauth/google/signup` - Signup only

### 5. Security

- OAuth routes are excluded from authentication middleware
- Tokens are set as secure, HTTP-only cookies
- Redirect URIs are validated and encoded
- Error handling for various OAuth failure scenarios

### 6. Error Handling

The system handles various error scenarios:
- Missing OAuth code
- Authentication failures
- OAuth flow failures
- Network errors

Users are redirected to appropriate error pages with retry options.

### 7. Configuration

The redirect URL is configured as `/google/success` as requested. This can be modified in:
- `components/google-oauth-button.tsx` - Button component
- `app/api/auth/google/route.ts` - OAuth initiation route
- `app/api/auth/google/callback/route.ts` - OAuth callback route

### 8. Testing

To test the integration:
1. Click any Google login/signup button
2. Complete Google OAuth flow
3. Verify successful redirect to dashboard
4. Check that authentication token is properly set

### 9. Customization

The integration can be customized by:
- Modifying the redirect URL
- Adding additional OAuth providers
- Customizing success/error messages
- Adding user onboarding flows
- Implementing additional security measures
