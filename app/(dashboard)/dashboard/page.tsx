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
import { User, Mail, Calendar, Award, Settings, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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
              {user.name && user.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {user.email}
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Profile Score: {user.profile_completion_score}%
              </Badge>
            </div>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile Completion
              </span>
              <span className="font-medium">{user.profile_completion_score}%</span>
            </div>
            <Progress value={user.profile_completion_score} className="h-2" />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Search Profile
              </span>
              <span className="font-medium">{user.searchprofile_completion_score}%</span>
            </div>
            <Progress value={user.searchprofile_completion_score} className="h-2" />
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
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Account Settings</p>
                <p className="text-sm text-gray-500">Manage your profile and preferences</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/general">
                View
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Profile Status</p>
                <p className="text-sm text-gray-500">Track your completion progress</p>
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
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
