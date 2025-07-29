'use client';

import { AppSidebar } from "@/components/app-sidebar"
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useSWR from 'swr';
import { Suspense } from 'react';
import { User, Activity, Settings, Star, Bell, Search, Plus, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserStatsCard() {
  const { data: user } = useSWR('/api/user', fetcher);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Overview
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Free Plan</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Privacy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profile_image} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-500">
              {user?.name ? user.name.split(' ')[0] : 'User'}
            </div>
            <div className="text-sm text-muted-foreground">Name</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-500">
              {user?.email ? user.email.split('@')[0] : 'user'}
            </div>
            <div className="text-sm text-muted-foreground">Username</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-500">Free</div>
            <div className="text-sm text-muted-foreground">Plan</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <Settings className="h-6 w-6" />
            <span>Account Settings</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <Activity className="h-6 w-6" />
            <span>View Activity</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <Bell className="h-6 w-6" />
            <span>Notifications</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Calendar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchCard() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Quick Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              placeholder="Search anything..."
              className="w-full"
            />
          </div>
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">12</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">89%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">24</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm text-muted-foreground">89%</span>
            </div>
            <Progress value={89} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Task Completion</span>
              <span className="text-sm text-muted-foreground">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Available Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Account Management</h3>
              <Badge variant="secondary" className="text-xs">Available</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Update your profile information and manage your account settings.
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Activity Tracking</h3>
              <Badge variant="secondary" className="text-xs">Available</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              View your account activity and recent actions.
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Security Settings</h3>
              <Badge variant="outline" className="text-xs">Premium</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your password and account security preferences.
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">User Dashboard</h3>
              <Badge variant="secondary" className="text-xs">Available</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Access your personalized dashboard with key information.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="mb-8 h-[200px]">
        <CardHeader><CardTitle>Account Overview</CardTitle></CardHeader>
      </Card>
      <Card className="mb-8 h-[200px]">
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
      </Card>
      <Card className="mb-8 h-[140px]">
        <CardHeader><CardTitle>Quick Search</CardTitle></CardHeader>
      </Card>
      <Card className="mb-8 h-[200px]">
        <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
      </Card>
      <Card className="h-[200px]">
        <CardHeader><CardTitle>Available Features</CardTitle></CardHeader>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg lg:text-2xl font-medium">Dashboard Overview</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <Suspense fallback={<DashboardSkeleton />}>
            <UserStatsCard />
            <QuickActionsCard />
            <SearchCard />
            <StatsCard />
            <FeaturesCard />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
