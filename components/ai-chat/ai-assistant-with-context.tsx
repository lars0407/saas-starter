'use client';

import { useAIAssistant } from './ai-assistant-context';
import AIAssistant from './ai-assistant';
import { usePathname } from 'next/navigation';

export default function AIAssistantWithContext() {
  const { context, isVisible } = useAIAssistant();
  const pathname = usePathname();

  if (!isVisible) {
    return null;
  }

  // Hide on mobile for job-recommend page
  const isJobRecommendPage = pathname?.includes('/dashboard/job-recommend');
  const hideOnMobile = isJobRecommendPage ? 'hidden md:block' : '';

  return <AIAssistant context={context} className={hideOnMobile} />;
} 