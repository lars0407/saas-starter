# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

**Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Features

- Marketing landing page (`/`) with animated Terminal element
- Dashboard pages with user profile management
- Xano authentication system with JWT tokens
- Email/password authentication with secure token storage
- Global middleware to protect logged-in routes
- User profile completion tracking
- Modern UI with shadcn/ui components

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Backend**: [Xano](https://xano.com/)
- **Authentication**: Xano Auth with JWT tokens
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

Set up your environment variables:

```bash
# Create .env.local file
echo "NEXT_PUBLIC_XANO_API_URL=https://api.jobjaeger.de/api:cPR_tiTl" > .env.local
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

You can create new users through the `/sign-up` route.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Authentication

The application uses Xano for authentication. Users can:

- Sign up with email and password
- Sign in with their credentials
- View their profile information
- Track profile completion status

## Going to Production

When you're ready to deploy your application to production, follow these steps:

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add the necessary environment variables:

1. `NEXT_PUBLIC_XANO_API_URL`: Set this to your production Xano API URL.
2. `BASE_URL`: Set this to your production domain.

## Other Templates

While this template is intentionally minimal and to be used as a learning resource, there are other paid versions in the community which are more full-featured:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
