'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Shield, Key, AlertTriangle } from 'lucide-react';
import useSWR from 'swr';
import { Suspense } from 'react';

// Define Xano user type
type XanoUser = {
  name: string;
  email: string;
  profile_image?: string;
  profile_completion_score: number;
  searchprofile_completion_score: number;
  message: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SecurityInfoSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityInfo() {
  const { data: user } = useSWR<XanoUser>('/api/user', fetcher);

  if (!user) {
    return <SecurityInfoSkeleton />;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Your account is secured with Xano authentication</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Password Changes:</strong> Password management is handled through the Xano platform. 
                To change your password, please contact your administrator or use the Xano dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Authentication Method</h4>
                <p className="text-sm text-gray-600">JWT Token-based</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Session Duration</h4>
                <p className="text-sm text-gray-600">24 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Secure token storage with httpOnly cookies</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Account deletion is non-reversible. Please proceed with caution.
            </p>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Important:</strong> Account deletion is managed through the Xano platform. 
                To delete your account, please contact your administrator or use the Xano dashboard.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              disabled
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Contact Administrator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account security and authentication settings.
        </p>
      </div>

      <Suspense fallback={<SecurityInfoSkeleton />}>
        <SecurityInfo />
      </Suspense>
    </div>
  );
}
