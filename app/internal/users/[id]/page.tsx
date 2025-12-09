'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfo } from '@/components/resume-sections/personal-info';
import { Education } from '@/components/resume-sections/education';
import { Experience } from '@/components/resume-sections/experience';
import { Skills } from '@/components/resume-sections/skills';
import { Certifications } from '@/components/resume-sections/certifications';
import { Courses } from '@/components/resume-sections/courses';
import { Publications } from '@/components/resume-sections/publications';
import { Interests } from '@/components/resume-sections/interests';
import { 
  User,
  GraduationCap,
  Briefcase,
  Zap,
  Award,
  BookOpen,
  FileText as FileTextIcon,
  Heart,
  ArrowLeft,
  Shield,
  Building,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Activity,
  Settings
} from 'lucide-react';

interface Residence {
  name: string;
  place_formatted: string;
  language: string;
  country: string;
  place: string;
  street: string;
  latitude: number | null;
  longitude: number | null;
  postcode: string;
}

interface SearchProfileLocation {
  adresse: string;
  location: {
    key: string;
    geo_radius: {
      center: {
        lat: number;
        lon: number;
      };
      radius: number;
    };
  };
}

interface SalaryExpectation {
  type: string;
  amount_eur: string;
}

interface SearchProfile {
  id: number;
  created_at: number;
  salary: number;
  range: string;
  roles: string[];
  profile_id: number;
  job_title: string[];
  search_term: string;
  job_search_activity: string;
  work_location_preference: string;
  work_time_preference: string;
  location: SearchProfileLocation;
  date_published: number;
  employement_type: string[];
  remote_work: string[];
  last_search: number;
  salary_expectation: SalaryExpectation;
}

interface Profile {
  id: number;
  created_at: number;
  user_id: number;
  hobby: string;
  skills: string[];
  gender: string;
  number: string;
  title: string;
  birthday: number | null;
  work_permit: boolean;
  linkedin_url: string;
  last_updated: number;
  profile: Record<string, any>;
  languages: string[];
  residence: Residence;
  search_profile_of_profile?: SearchProfile;
}

interface User {
  id: number;
  created_at: number;
  name: string;
  email: string | null;
  type: 'talent' | 'admin' | 'company';
  visibility: boolean;
  deleted: number | null;
  pause: boolean;
  pause_date: number | null;
  pause_reason: string;
  onboarding: string;
  searchprofile_completion_score: number;
  profile_completion_score: number;
  code: number;
  active: boolean;
  profile_image: string;
  message: boolean;
  last_search: number;
  search_once: boolean;
  last_login: number;
  google_oauth: {
    id: string;
    name: string;
    email: string;
  };
  profile_of_user?: Profile;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          setError('No authentication token found');
          return;
        }

        const params = new URLSearchParams({
          user_id: userId
        });

        const response = await fetch(`https://api.jobjaeger.de/api:fgXLZBBL/user/id?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User = await response.json();
        setUser(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'company':
        return <Building className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-green-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      admin: 'destructive',
      company: 'default',
      talent: 'secondary'
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Transform admin API profile data to resume section format
  const transformProfileData = () => {
    if (!user) return null;
    if (!user.profile_of_user?.profile) return null;
    
    const profileData = user.profile_of_user.profile;
    const basics = profileData.basics || {};
    
    // Transform personal info
    const personalInfo = {
      firstName: basics.first_name || '',
      lastName: basics.surname || '',
      email: user.email || basics.email || '',
      phone: user.profile_of_user.number || basics.telephone || '',
      location: user.profile_of_user.residence?.place_formatted || '',
      adresse_street: basics.adresse_street || '',
      adresse_city: basics.adresse_city || user.profile_of_user.residence?.name || '',
      adresse_postcode: basics.adresse_postcode || user.profile_of_user.residence?.postcode || '',
      adresse_country: basics.adresse_country || user.profile_of_user.residence?.country || '',
      website: profileData.link?.find((link: any) => link.label === 'website')?.url || '',
      linkedin: profileData.link?.find((link: any) => link.label === 'linkedin')?.url || user.profile_of_user.linkedin_url || '',
      github: profileData.link?.find((link: any) => link.label === 'github')?.url || '',
      summary: basics.description || user.profile_of_user.hobby || '',
    };

    // Transform skills
    const skills = (profileData.skills || profileData.skill || user.profile_of_user.skills || []).map((skill: any, index: number) => ({
      id: index.toString(),
      name: typeof skill === 'string' ? skill : skill.skill || skill.name || '',
      category: (typeof skill === 'object' && skill.label) ? skill.label : 'technical' as const,
      level: 'intermediate' as const,
    }));

    // Transform education
    const education = (profileData.education || []).map((edu: any, index: number) => ({
      id: index.toString(),
      institution: edu.school || '',
      degree: edu.degree || '',
      field: edu.subject || '',
      location: edu.location_city || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      current: false,
      description: edu.description || '',
      gpa: edu.grade || '',
    }));

    // Transform experience
    const experience = (profileData.experience || []).map((exp: any, index: number) => ({
      id: index.toString(),
      company: exp.company || '',
      position: exp.title || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: false,
      description: exp.description || '',
      achievements: exp.achievements && Array.isArray(exp.achievements) ? exp.achievements : [],
    }));

    // Transform certifications
    const certifications = (profileData.certifications || []).map((cert: any, index: number) => ({
      id: index.toString(),
      name: cert.name || '',
      issuer: cert.organization || '',
      issueDate: cert.issue_date || '',
    }));

    // Transform courses
    const courses = (profileData.courses || []).map((course: any, index: number) => ({
      id: index.toString(),
      name: course.name || '',
      institution: course.institution || '',
      completionDate: course.completion_date || '',
    }));

    // Transform publications
    const publications = (profileData.publications || []).map((pub: any, index: number) => ({
      id: index.toString(),
      title: pub.title || '',
      publisher: pub.publisher || '',
      publicationDate: pub.publication_date || '',
      url: pub.url || '',
    }));

    // Transform interests
    const interests = (profileData.interests || []).map((interest: any, index: number) => ({
      id: index.toString(),
      name: typeof interest === 'string' ? interest : interest.name || '',
    }));

    return {
      personalInfo,
      skills,
      education,
      experience,
      certifications,
      courses,
      publications,
      interests,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <>
        <Head>
          <title>User Not Found - Admin</title>
        </Head>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/internal/dashboard">Admin Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/internal/users">User Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">Error: {error || 'User not found'}</div>
                <Button onClick={() => router.push('/internal/users')}>Back to Users</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{user.name} - User Details - Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
      </Head>
      
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/internal/dashboard">Admin Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/internal/users">User Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{user.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/internal/users')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">User Details</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="allgemein" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allgemein">Allgemein</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="searchprofile">Searchprofile</TabsTrigger>
          </TabsList>

          {/* Allgemein Tab */}
          <TabsContent value="allgemein" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-6">
                      <img
                        src={user.profile_image}
                        alt={user.name || 'User'}
                        className="h-24 w-24 rounded-full"
                      />
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold">{user.name || 'No name'}</h2>
                            {getTypeBadge(user.type)}
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{user.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={user.active ? 'default' : 'secondary'}>
                            {user.active ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.pause && (
                            <Badge variant="outline">
                              Paused
                            </Badge>
                          )}
                          {user.visibility && (
                            <Badge variant="outline">
                              Visible
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-mono text-sm">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Code</span>
                        <span className="font-mono text-sm">{user.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created</span>
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                      {user.last_login && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Login</span>
                          <span>{formatDate(user.last_login)}</span>
                        </div>
                      )}
                      {user.last_search && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Search</span>
                          <span>{formatDate(user.last_search)}</span>
                        </div>
                      )}
                      {user.pause_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paused Date</span>
                          <span>{formatDate(user.pause_date)}</span>
                        </div>
                      )}
                      {user.deleted && (
                        <div className="flex justify-between">
                          <span className="text-red-600">Deleted</span>
                          <span>{formatDate(user.deleted)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Search Once</span>
                        <Badge variant={user.search_once ? 'default' : 'secondary'}>
                          {user.search_once ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                {(user.pause_reason || user.onboarding) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.pause_reason && (
                          <div>
                            <span className="text-gray-600 block mb-1">Pause Reason</span>
                            <p>{user.pause_reason}</p>
                          </div>
                        )}
                        {user.onboarding && (
                          <div>
                            <span className="text-gray-600 block mb-1">Onboarding Status</span>
                            <p>{user.onboarding}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Active</span>
                        <Badge variant={user.active ? 'default' : 'secondary'}>
                          {user.active ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Paused</span>
                        <Badge variant={user.pause ? 'destructive' : 'secondary'}>
                          {user.pause ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Visible</span>
                        <Badge variant={user.visibility ? 'default' : 'secondary'}>
                          {user.visibility ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Messages</span>
                        <Badge variant={user.message ? 'default' : 'secondary'}>
                          {user.message ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Profile Completion</span>
                        <span className="font-medium">{user.profile_completion_score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Search Profile Completion</span>
                        <span className="font-medium">{user.searchprofile_completion_score}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Google OAuth */}
                {user.google_oauth && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Google OAuth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {user.google_oauth.name && (
                          <div>
                            <span className="text-gray-600 text-sm">Name</span>
                            <p className="font-medium">{user.google_oauth.name}</p>
                          </div>
                        )}
                        {user.google_oauth.email && (
                          <div>
                            <span className="text-gray-600 text-sm">Email</span>
                            <p className="font-medium">{user.google_oauth.email}</p>
                          </div>
                        )}
                        {user.google_oauth.id && (
                          <div>
                            <span className="text-gray-600 text-sm">ID</span>
                            <p className="font-mono text-xs">{user.google_oauth.id}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {user.profile_of_user ? (() => {
              const transformedData = transformProfileData();
              if (!transformedData) {
                return (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-gray-500">
                        No profile data available
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Persönlich</h4>
                    </div>
                    <PersonalInfo 
                      data={{
                        firstName: transformedData.personalInfo.firstName,
                        lastName: transformedData.personalInfo.lastName,
                        email: transformedData.personalInfo.email,
                        phone: transformedData.personalInfo.phone,
                        location: transformedData.personalInfo.location,
                        adresse_street: transformedData.personalInfo.adresse_street,
                        adresse_city: transformedData.personalInfo.adresse_city,
                        adresse_postcode: transformedData.personalInfo.adresse_postcode,
                        adresse_country: transformedData.personalInfo.adresse_country,
                        website: transformedData.personalInfo.website,
                        linkedin: transformedData.personalInfo.linkedin,
                        github: transformedData.personalInfo.github,
                        summary: transformedData.personalInfo.summary,
                      }}
                      onChange={() => {}} 
                      isEditing={false} 
                    />
                  </div>

                  {/* Education Section */}
                  {transformedData.education.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Ausbildung</h4>
                      </div>
                      <Education 
                        data={transformedData.education} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Experience Section */}
                  {transformedData.experience.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Briefcase className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Berufserfahrung</h4>
                      </div>
                      <Experience 
                        data={transformedData.experience} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Skills Section */}
                  {transformedData.skills.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Zap className="h-5 w-5 text-yellow-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Fähigkeiten</h4>
                      </div>
                      <Skills 
                        data={transformedData.skills} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Certifications Section */}
                  {transformedData.certifications.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Award className="h-5 w-5 text-red-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Zertifikate</h4>
                      </div>
                      <Certifications 
                        data={transformedData.certifications} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Courses Section */}
                  {transformedData.courses.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Kurse</h4>
                      </div>
                      <Courses 
                        data={transformedData.courses} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Publications Section */}
                  {transformedData.publications.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <FileTextIcon className="h-5 w-5 text-teal-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Publikationen</h4>
                      </div>
                      <Publications 
                        data={transformedData.publications} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Interests Section */}
                  {transformedData.interests.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Heart className="h-5 w-5 text-pink-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Interessen</h4>
                      </div>
                      <Interests 
                        data={transformedData.interests} 
                        onChange={() => {}} 
                        isEditing={false} 
                      />
                    </div>
                  )}

                  {/* Languages */}
                  {user.profile_of_user.languages && user.profile_of_user.languages.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <FileTextIcon className="h-5 w-5 text-cyan-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Sprachen</h4>
                      </div>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap gap-2">
                            {user.profile_of_user.languages.map((language, index) => (
                              <Badge key={index} variant="outline">{language}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              );
            })() : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-gray-500">
                    No profile data available
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Searchprofile Tab */}
          <TabsContent value="searchprofile" className="space-y-6 mt-6">
            {user.profile_of_user?.search_profile_of_profile ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 text-sm">Search Profile ID</span>
                          <p className="font-mono text-sm">{user.profile_of_user.search_profile_of_profile.id}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Profile ID</span>
                          <p className="font-mono text-sm">{user.profile_of_user.search_profile_of_profile.profile_id}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Created</span>
                          <p>{formatDate(user.profile_of_user.search_profile_of_profile.created_at)}</p>
                        </div>
                        {user.profile_of_user.search_profile_of_profile.last_search && (
                          <div>
                            <span className="text-gray-600 text-sm">Last Search</span>
                            <p>{formatDate(user.profile_of_user.search_profile_of_profile.last_search)}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 text-sm">Salary</span>
                          <p className="font-medium">{user.profile_of_user.search_profile_of_profile.salary} €</p>
                        </div>
                        {user.profile_of_user.search_profile_of_profile.range && (
                          <div>
                            <span className="text-gray-600 text-sm">Range</span>
                            <p>{user.profile_of_user.search_profile_of_profile.range}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 text-sm">Job Search Activity</span>
                          <Badge variant="default">{user.profile_of_user.search_profile_of_profile.job_search_activity}</Badge>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Work Location Preference</span>
                          <p className="font-medium capitalize">{user.profile_of_user.search_profile_of_profile.work_location_preference}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Work Time Preference</span>
                          <p className="font-medium capitalize">{user.profile_of_user.search_profile_of_profile.work_time_preference}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Date Published</span>
                          <p>{user.profile_of_user.search_profile_of_profile.date_published} days</p>
                        </div>
                        {user.profile_of_user.search_profile_of_profile.search_term && (
                          <div>
                            <span className="text-gray-600 text-sm">Search Term</span>
                            <p>{user.profile_of_user.search_profile_of_profile.search_term}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Titles */}
                {user.profile_of_user.search_profile_of_profile.job_title && user.profile_of_user.search_profile_of_profile.job_title.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Titles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.profile_of_user.search_profile_of_profile.job_title.map((title, index) => (
                          <Badge key={index} variant="default">{title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Employment Types */}
                {user.profile_of_user.search_profile_of_profile.employement_type && user.profile_of_user.search_profile_of_profile.employement_type.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Employment Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.profile_of_user.search_profile_of_profile.employement_type.map((type, index) => (
                          <Badge key={index} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Remote Work */}
                {user.profile_of_user.search_profile_of_profile.remote_work && user.profile_of_user.search_profile_of_profile.remote_work.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Remote Work Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.profile_of_user.search_profile_of_profile.remote_work.map((remote, index) => (
                          <Badge key={index} variant="secondary">{remote}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Roles */}
                {user.profile_of_user.search_profile_of_profile.roles && user.profile_of_user.search_profile_of_profile.roles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.profile_of_user.search_profile_of_profile.roles.map((role, index) => (
                          <Badge key={index} variant="outline">{role}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Location */}
                {user.profile_of_user.search_profile_of_profile.location && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {user.profile_of_user.search_profile_of_profile.location.adresse && (
                          <div>
                            <span className="text-gray-600 text-sm">Address</span>
                            <p className="font-medium">{user.profile_of_user.search_profile_of_profile.location.adresse}</p>
                          </div>
                        )}
                        {user.profile_of_user.search_profile_of_profile.location.location?.geo_radius && (
                          <div>
                            <span className="text-gray-600 text-sm">Geo Radius</span>
                            <div className="mt-1">
                              <p className="text-xs">
                                Center: {user.profile_of_user.search_profile_of_profile.location.location.geo_radius.center.lat}, {user.profile_of_user.search_profile_of_profile.location.location.geo_radius.center.lon}
                              </p>
                              <p className="text-xs">
                                Radius: {user.profile_of_user.search_profile_of_profile.location.location.geo_radius.radius} meters
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Salary Expectation */}
                {user.profile_of_user.search_profile_of_profile.salary_expectation && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Salary Expectation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {user.profile_of_user.search_profile_of_profile.salary_expectation.type && (
                          <div>
                            <span className="text-gray-600 text-sm">Type</span>
                            <p className="font-medium">{user.profile_of_user.search_profile_of_profile.salary_expectation.type}</p>
                          </div>
                        )}
                        {user.profile_of_user.search_profile_of_profile.salary_expectation.amount_eur && (
                          <div>
                            <span className="text-gray-600 text-sm">Amount (EUR)</span>
                            <p className="font-medium">{user.profile_of_user.search_profile_of_profile.salary_expectation.amount_eur}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-gray-500">
                    No search profile data available
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

