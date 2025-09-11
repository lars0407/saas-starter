import { getCurrentUser } from './xano';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role?: string;
  is_admin?: boolean;
}

/**
 * Check if a user has admin privileges
 * @param user - The user object from getCurrentUser
 * @returns boolean indicating if user is admin
 */
export function isAdminUser(user: any): boolean {
  if (!user) return false;
  
  // Check various admin indicators
  return (
    user.email?.includes('admin') ||
    user.role === 'admin' ||
    user.type === 'admin' ||  // Check type field for admin
    user.is_admin === true ||
    user.email === 'admin@jobjaeger.de' ||
    user.email === 'lars@jobjaeger.de' // Add your admin email here
  );
}

/**
 * Get admin user data with proper typing
 * @param token - Authentication token
 * @returns Promise<AdminUser | null>
 */
export async function getAdminUser(token: string): Promise<AdminUser | null> {
  try {
    const user = await getCurrentUser(token);
    return isAdminUser(user) ? user as AdminUser : null;
  } catch (error) {
    console.error('Failed to get admin user:', error);
    return null;
  }
}

/**
 * Admin email list for easy management
 */
export const ADMIN_EMAILS = [
  'admin@jobjaeger.de',
  'lars@jobjaeger.de',
  // Add more admin emails here
];

/**
 * Check if email is in admin list
 * @param email - Email to check
 * @returns boolean
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
