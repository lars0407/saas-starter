import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { Toaster } from '@/components/ui/sonner';
import { CrispChat } from '@/components/crisp-chat';
import { MobileDevModal } from '@/components/mobile-dev-modal';
import { PostHogProvider } from '@/components/posthog-provider';

export const metadata: Metadata = {
  title: 'Jobjäger',
  description: 'Dein intelligenter Jobtracker für eine erfolgreiche Karriere.',
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50" suppressHydrationWarning={true}>
        <SWRConfig
          value={{
            fallback: {
              // User data will be fetched client-side with Xano token
            }
          }}
        >
          {children}
          <Toaster />
          <CrispChat />
          <MobileDevModal />
          <PostHogProvider />
        </SWRConfig>
      </body>
    </html>
  );
}
