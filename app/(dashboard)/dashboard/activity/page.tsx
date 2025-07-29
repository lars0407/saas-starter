'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  Activity,
  Clock,
} from 'lucide-react';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full p-2 w-9 h-9 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center py-12">
          <Clock className="h-12 w-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Activity tracking coming soon
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Activity logging is managed through the Xano platform. 
            Your recent sign-ins and account activities are tracked securely.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md">
            <p className="text-sm text-blue-800">
              <strong>Current Session:</strong> You are currently signed in and your session is active.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActivityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-2">
          View your recent account activity and session information.
        </p>
      </div>

      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityInfo />
      </Suspense>
    </div>
  );
}
