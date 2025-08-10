export interface ResumeParserResponse {
  message: {
    link: Array<{
      url: string;
      label: string;
    }>;
    skill: Array<{
      label: string;
      skill: number;
    }>;
    basics: {
      email: string;
      image: string;
      gender: string;
      surname: string;
      birthdate: string;
      telephone: string;
      first_name: string;
      description: string;
      nationality: string;
      title_after: string;
      adresse_city: string;
      title_before: string;
      adresse_street: string;
      adresse_country: string;
      adresse_postcode: string;
    };
    courses: Array<{
      name: string;
      endDate: string;
      startDate: string;
      description: string;
      institution: string;
    }>;
    language: string[];
    education: Array<{
      grade: string;
      degree: string;
      school: string;
      endDate: string;
      subject: string;
      startDate: string;
      description: string;
      location_city: string;
      location_country: string;
    }>;
    interests: any[];
    experience: Array<{
      title: string;
      company: string;
      endDate: string;
      location: string;
      startDate: string;
      description: string;
      achievements: string[];
    }>;
    publications: any[];
    certifications: any[];
  };
}

export class ResumeParserService {
  private static readonly API_URL = 'https://api.jobjaeger.de/api:O72K2wiB/v2/resume/parser';

  /**
   * Parse a resume file using the JobJaeger API
   * @param file - The PDF file to parse
   * @param authToken - Authentication token from cookies
   * @returns Parsed resume data
   */
  static async parseResume(file: File, authToken: string): Promise<ResumeParserResponse> {
    if (!authToken) {
      throw new Error('Authentication token is required');
    }

    if (!file) {
      throw new Error('Resume file is required');
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('resume_file', file);

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the status text
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result as ResumeParserResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to parse resume');
    }
  }

  /**
   * Get authentication token from cookies
   * @returns The authentication token or null if not found
   */
  static getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || null;
  }

  /**
   * Transform parsed resume data to match the onboarding profile format
   * @param parsedData - The parsed resume data from the API
   * @returns Transformed data in onboarding profile format
   */
  static transformToOnboardingFormat(parsedData: ResumeParserResponse) {
    const { message } = parsedData;
    
    return {
      link: message.link || [],
      skill: message.skill || [],
      basics: {
        email: message.basics?.email || '',
        image: message.basics?.image || '',
        surname: message.basics?.surname || '',
        birthdate: message.basics?.birthdate || '',
        telephone: message.basics?.telephone || '',
        first_name: message.basics?.first_name || '',
        description: message.basics?.description || '',
        nationality: message.basics?.nationality || '',
        gender: message.basics?.gender || '',
        title_after: message.basics?.title_after || '',
        adresse_city: message.basics?.adresse_city || '',
        title_before: message.basics?.title_before || '',
        adresse_street: message.basics?.adresse_street || '',
        adresse_country: message.basics?.adresse_country || '',
        adresse_postcode: message.basics?.adresse_postcode || '',
      },
      language: message.language || [],
      education: message.education || [],
      experience: message.experience || [],
      courses: message.courses || [],
      publications: message.publications || [],
      certifications: message.certifications || [],
      interests: message.interests || [],
    };
  }
} 