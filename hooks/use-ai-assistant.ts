import { useAIAssistant } from '@/components/ai-chat/ai-assistant-context';

export function useAIAssistantHook() {
  const { context, updateContext, isVisible, setIsVisible } = useAIAssistant();

  const updatePageData = (data: any) => {
    updateContext({ pageData: data });
  };

  const updateUserData = (data: any) => {
    updateContext({ userData: data });
  };

  const hideAssistant = () => {
    setIsVisible(false);
  };

  const showAssistant = () => {
    setIsVisible(true);
  };

  const toggleAssistant = () => {
    setIsVisible(!isVisible);
  };

  return {
    context,
    isVisible,
    updatePageData,
    updateUserData,
    hideAssistant,
    showAssistant,
    toggleAssistant,
  };
} 