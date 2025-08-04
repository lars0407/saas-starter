// localStorage utility for onboarding profile data

export interface OnboardingProfileData {
  link: Array<{
    url: string;
    label: string;
  }>;
  skill: Array<{
    label: string;
    skill: string;
  }>;
  basics: {
    email: string;
    image: string;
    surname: string;
    birthdate: string;
    telephone: string;
    first_name: string;
    description: string;
    nationality: string;
    gender: string;
    title_after: string;
    adresse_city: string;
    title_before: string;
    adresse_street: string;
    adresse_country: string;
    adresse_postcode: string;
  };
  language: Array<any>; // Define specific structure if needed
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
  experience: Array<{
    title: string;
    company: string;
    endDate: string;
    location: string;
    startDate: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    organization: string;
    endDate: string;
    issue_date: string;
  }>;
  courses: Array<{
    courseTitle: string;
    provider: string;
    startDate: string;
    endDate: string;
    duration: string;
    certificate: string;
    description: string;
    skillsLearned: string[];
  }>;
  publications: Array<{
    title: string;
    type: string;
    authors: string[];
    publicationDate: string;
    journal: string;
    doi: string;
    publisher: string;
    url: string;
    abstract: string;
  }>;
  interests: Array<{
    name: string;
    category: string;
    description: string;
  }>;
}

const ONBOARDING_PROFILE_KEY = 'onboarding_profile';

export const onboardingProfileStorage = {
  // Save profile data to localStorage
  save: (data: Partial<OnboardingProfileData>): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(data));
        console.log('Successfully saved to localStorage:', data);
      }
    } catch (error) {
      console.error('Error saving onboarding profile to localStorage:', error);
    }
  },

  // Load profile data from localStorage
  load: (): Partial<OnboardingProfileData> | null => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(ONBOARDING_PROFILE_KEY);
        const parsed = stored ? JSON.parse(stored) : null;
        console.log('Successfully loaded from localStorage:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error loading onboarding profile from localStorage:', error);
      return null;
    }
  },

  // Clear profile data from localStorage
  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ONBOARDING_PROFILE_KEY);
        console.log('Successfully cleared localStorage');
      }
    } catch (error) {
      console.error('Error clearing onboarding profile from localStorage:', error);
    }
  },

  // Debug function to check localStorage contents
  debug: (): void => {
    try {
      if (typeof window !== 'undefined') {
        const allKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', allKeys);
        
        const profileData = localStorage.getItem(ONBOARDING_PROFILE_KEY);
        console.log('Profile data in localStorage:', profileData);
        
        if (profileData) {
          const parsed = JSON.parse(profileData);
          console.log('Parsed profile data:', parsed);
        }
      }
    } catch (error) {
      console.error('Error debugging localStorage:', error);
    }
  },

  // Get default empty profile structure
  getDefaultProfile: (): OnboardingProfileData => ({
    link: [],
    skill: [],
    basics: {
      email: '',
      image: '',
      surname: '',
      birthdate: '',
      telephone: '',
      first_name: '',
      description: '',
      nationality: '',
      gender: '',
      title_after: '',
      adresse_city: '',
      title_before: '',
      adresse_street: '',
      adresse_country: '',
      adresse_postcode: '',
    },
    language: [],
    education: [],
    experience: [],
    certifications: [],
    courses: [],
    publications: [],
    interests: [],
  }),
}; 