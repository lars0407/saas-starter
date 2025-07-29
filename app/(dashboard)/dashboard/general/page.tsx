'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield } from 'lucide-react';
import useSWR from 'swr';
import { Suspense } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

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

function AccountInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="animate-pulse">
            <Label className="mb-2">Name</Label>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <Label className="mb-2">Email</Label>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountInfo() {
  const { data: user, error } = useSWR<XanoUser>('/api/user', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  if (!user || error) {
    return <AccountInfoSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              value={user.name}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Profile Completion
            </Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${user.profile_completion_score}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{user.profile_completion_score}%</span>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> User information is managed through Xano. 
            To update your profile, please contact your administrator or use the Xano dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeneralPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>General Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600 mt-2">
            View your account information and profile status.
          </p>
        </div>

        <Suspense fallback={<AccountInfoSkeleton />}>
          <AccountInfo />
        </Suspense>
      </div>
    </>
  );
}
