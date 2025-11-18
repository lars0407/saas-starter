'use client';

import { useAIAssistant } from './ai-assistant-context';
import AIAssistant from './ai-assistant';

export default function AIAssistantWithContext() {
  const { context, isVisible } = useAIAssistant();

  if (!isVisible) {
    return null;
  }

  // Hide on mobile completely
  const hideOnMobile = 'hidden md:block';

  return <AIAssistant context={context} className={hideOnMobile} />;
} 