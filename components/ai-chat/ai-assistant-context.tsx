'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AIAssistantContextType {
  context: {
    currentPage: string;
    userData: any;
    pageData: any;
  };
  updateContext: (updates: Partial<AIAssistantContextType['context']>) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [context, setContext] = useState<AIAssistantContextType['context']>({
    currentPage: '',
    userData: null,
    pageData: null,
  });
  const [isVisible, setIsVisible] = useState(true);

  // Update current page when pathname changes
  useEffect(() => {
    setContext(prev => ({
      ...prev,
      currentPage: pathname || '',
    }));
  }, [pathname]);

  const updateContext = (updates: Partial<AIAssistantContextType['context']>) => {
    setContext(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <AIAssistantContext.Provider
      value={{
        context,
        updateContext,
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
} 