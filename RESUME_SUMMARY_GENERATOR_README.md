# Resume Summary Generator

This feature integrates AI-powered resume summary generation into the resume builder.

## Overview

The resume summary generator allows users to automatically generate a professional summary for their resume using AI. The feature is integrated into the personal information section of the resume builder.

## Components

### 1. ResumeSummaryGenerator Component
- **Location**: `components/resume-summary-generator.tsx`
- **Purpose**: Handles the AI summary generation with loading states and error handling
- **Features**:
  - Loading state with spinner animation
  - Error handling with toast notifications
  - Automatic auth token retrieval from cookies
  - Success feedback

### 2. API Integration
- **Location**: `lib/api-client.ts`
- **Function**: `generateResumeSummary(resumeData: any)`
- **Endpoint**: `https://api.jobjaeger.de/api:6H_xVEFw/artifact/resume/summary/generate`
- **Authentication**: Uses Bearer token from cookies

## Integration Points

### Personal Info Component
- **Location**: `components/resume-sections/personal-info.tsx`
- **Integration**: The summary generator button is placed above the summary textarea
- **Visibility**: Only shows when in editing mode and resume data is available

### Resume Generator
- **Location**: `components/resume-generator-new.tsx`
- **Integration**: Passes full resume data to PersonalInfo component for AI processing

## API Specification

### Request
```json
{
  "resume_data": {
    // Full resume data object
  }
}
```

### Response
```json
{
  "output": "Generated summary text"
}
```

## Usage

1. Navigate to the resume builder
2. Fill in personal information, education, experience, and skills
3. In the personal information section, click "KI Zusammenfassung generieren"
4. The AI will analyze the resume data and generate a professional summary
5. The generated summary will automatically populate the summary textarea
6. Users can edit the generated summary if needed

## Error Handling

- **No resume data**: Shows error message "Keine Lebenslaufdaten verfügbar"
- **Authentication error**: Shows error message "Nicht angemeldet. Bitte melden Sie sich erneut an."
- **API errors**: Shows generic error message with retry suggestion
- **Success**: Shows success toast notification

## Technical Details

- **Auth Token**: Retrieved from browser cookies using the same method as other API calls
- **Loading State**: Button shows spinner and "KI generiert Zusammenfassung..." text
- **Responsive**: Button spans full width and is properly styled for mobile and desktop
- **TypeScript**: Fully typed with proper interfaces and error handling

## Dependencies

- `@/components/ui/button` - Button component
- `@/components/ui/loader` - Loading spinner
- `lucide-react` - Icons (Sparkles, Loader2)
- `sonner` - Toast notifications
- `@/lib/api-client` - API client for making requests 