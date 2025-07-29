'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Trash2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-gray-900 mb-6">
        Security Settings
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Password management is handled through Xano authentication. 
              Please use the password reset functionality if you need to change your password.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Password changes are managed by Xano</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Account deletion is handled through Xano. Please contact support to delete your account.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Trash2 className="h-4 w-4" />
              <span>Account deletion requires support assistance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
