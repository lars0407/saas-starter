# Internal Admin Dashboard

This directory contains the internal admin dashboard that is not accessible to regular users and is not indexed by search engines.

## Security Features

- **Authentication Required**: Users must be logged in to access
- **Admin Authorization**: Only users with admin privileges can access
- **No Search Engine Indexing**: Multiple layers of protection against indexing
- **No Public Links**: No navigation links lead to this dashboard

## Access Control

Admin access is determined by the `isAdminUser()` function in `lib/admin-utils.ts`. A user is considered an admin if:

- Their email contains 'admin'
- Their role is 'admin'
- Their `is_admin` flag is true
- Their email is in the `ADMIN_EMAILS` list

## Files Structure

```
app/internal/
├── layout.tsx          # Admin layout with authorization check
├── dashboard/
│   └── page.tsx        # Main admin dashboard page
├── metadata.ts         # SEO prevention metadata
└── README.md          # This documentation
```

## SEO Protection

The admin dashboard is protected from search engine indexing through:

1. **Meta Tags**: `noindex`, `nofollow`, `noarchive`, `nosnippet`, `noimageindex`, `nocache`
2. **Robots.txt**: Disallows `/internal/` paths
3. **Middleware**: Redirects unauthorized users
4. **Layout Authorization**: Client-side admin check

## Usage

To access the admin dashboard:

1. Log in with an admin account
2. Navigate directly to `/internal/dashboard`
3. The system will verify admin privileges before allowing access

## Adding New Admin Features

When adding new admin features:

1. Place them in the `app/internal/` directory
2. Ensure they use the admin layout for authorization
3. Add appropriate meta tags for SEO protection
4. Update this README if needed

## Security Notes

- Never add public navigation links to internal routes
- Always verify admin status in both middleware and layout
- Keep admin functionality separate from public features
- Regularly review admin access permissions
