# Next.js SaaS Starter with Xano Authentication

A modern SaaS starter template built with Next.js 15, featuring Xano authentication and a beautiful UI.

## Features

- **🔐 Xano Authentication** - Secure user authentication and management
- **🎨 Modern UI** - Beautiful, responsive design with Tailwind CSS
- **⚡ Next.js 15** - Latest features with App Router and Server Components
- **🔒 TypeScript** - Full type safety throughout the application
- **📱 Responsive** - Works perfectly on all devices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saas-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # Add any environment variables you need for your application
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication

This project uses Xano for authentication. The authentication system includes:

- User registration and login
- JWT token-based authentication
- Password reset functionality
- Email verification
- User profile management

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/              # API routes
│   ├── sign-in/          # Sign-in page
│   └── sign-up/          # Sign-up page
├── components/           # Reusable UI components
├── lib/                  # Utility functions
│   └── xano.ts          # Xano authentication client
└── middleware.ts        # Route protection
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **Xano** - Backend-as-a-Service for authentication
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **SWR** - Data fetching and caching

## Deployment

This project can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
