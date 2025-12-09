'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Building,
  User
} from 'lucide-react';

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
  google_oauth?: {
    id: string;
    name: string;
    email: string;
  };
}

interface UsersResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: User[];
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [pagination, setPagination] = useState({
    curPage: 1,
    perPage: 10,
    itemsTotal: 0,
    pageTotal: 0
  });

  const fetchUsers = async (page = 1, search = '', type = 'all') => {
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

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '10'
      });

      if (search) {
        params.append('search', search);
      }

      if (type !== 'all') {
        params.append('type', type);
      }

      const response = await fetch(`https://api.jobjaeger.de/api:fgXLZBBL/user?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersResponse = await response.json();
      setUsers(data.items);
      setPagination({
        curPage: data.curPage,
        perPage: data.perPage,
        itemsTotal: data.itemsTotal,
        pageTotal: data.pageTotal
      });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, searchTerm, filterType);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    fetchUsers(1, searchTerm, type);
  };

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Management - Admin</title>
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
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find and filter users by name, email, or type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'talent' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('talent')}
                >
                  <User className="h-4 w-4 mr-1" />
                  Talent
                </Button>
                <Button
                  variant={filterType === 'admin' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('admin')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Button>
                <Button
                  variant={filterType === 'company' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('company')}
                >
                  <Building className="h-4 w-4 mr-1" />
                  Company
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <Button onClick={() => fetchUsers()}>Retry</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.profile_image}
                              alt={user.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(user.type)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge variant={user.active ? 'default' : 'secondary'}>
                              {user.active ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                              {user.active ? 'Active' : 'Inactive'}
                            </Badge>
                            {user.pause && (
                              <Badge variant="outline" className="text-xs">
                                Paused
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/internal/users/${user.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.pageTotal > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {pagination.curPage} of {pagination.pageTotal}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchUsers(pagination.curPage - 1, searchTerm, filterType)}
                    disabled={pagination.curPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fetchUsers(pagination.curPage + 1, searchTerm, filterType)}
                    disabled={pagination.curPage === pagination.pageTotal}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
