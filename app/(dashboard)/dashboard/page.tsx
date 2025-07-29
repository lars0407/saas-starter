'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useSWR from 'swr';
import { Suspense } from 'react';
import { User, Mail, Calendar, Award, Settings } from 'lucide-react';
import Link from 'next/link';

// Define Xano user type
type XanoUser = {
  name: string;
  email: string;
  profile_image?: string;
  profile_completion_score: number;
  searchprofile_completion_score: number;
  message: boolean;
};

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

function UserProfileSkeleton() {
  return (
    <Card className="mb-8 h-[200px]">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="size-16 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserProfile() {
  const { data: user, error } = useSWR<XanoUser>('/api/user', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  if (!user || error) {
    return <UserProfileSkeleton />;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="size-16">
            <AvatarImage src={user.profile_image} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCompletion() {
  const { data: user, error } = useSWR<XanoUser>('/api/user', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  if (!user || error) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile Completion
            </span>
            <span className="font-semibold">{user.profile_completion_score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${user.profile_completion_score}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Search Profile
            </span>
            <span className="font-semibold">{user.searchprofile_completion_score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${user.searchprofile_completion_score}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <Button asChild className="w-full">
            <Link href="/dashboard/general">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
          
          <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse" />}>
            <ProfileCompletion />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<div className="h-48 bg-gray-100 rounded animate-pulse" />}>
            <QuickActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
