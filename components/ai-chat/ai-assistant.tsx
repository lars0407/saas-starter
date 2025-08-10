'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantProps {
  className?: string;
  context?: {
    currentPage?: string;
    userData?: any;
    pageData?: any;
  };
}

export default function AIAssistant({ className, context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState('laechelnd');
  const [isHovered, setIsHovered] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-assistant-chat');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('ai-assistant-chat', JSON.stringify(messages));
  }, [messages]);

  // Update mood based on conversation
  useEffect(() => {
    if (messages.length === 0) {
      setCurrentMood('laechelnd');
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        setCurrentMood('denkend');
      } else {
        setCurrentMood('laechelnd');
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check authentication status first
    if (!checkAuthStatus()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert messages to the required format for the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the current user message to the history
      chatHistory.push({
        role: 'user',
        content: userMessage.content
      });

      // Get token from cookies instead of localStorage
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const authToken = getCookie('token');
      console.log('Auth token from cookies:', authToken ? 'Present' : 'Missing');
      console.log('Chat history:', chatHistory);

      // Check if auth token exists and is valid
      if (!authToken) {
        throw new Error('Kein Authentifizierungstoken gefunden. Bitte melden Sie sich erneut an.');
      }

      const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          chat_history: chatHistory
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        // Handle specific error cases
        if (response.status === 401) {
          // Clear invalid token and show login message
          localStorage.removeItem('auth-token');
          throw new Error('Ihr Anmelde-Token ist abgelaufen. Bitte melden Sie sich erneut an.');
        } else if (response.status === 403) {
          throw new Error('Zugriff verweigert. Überprüfen Sie Ihre Berechtigungen.');
        } else {
          throw new Error(`API Fehler: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.response || !data.response.content) {
        throw new Error('Invalid response format from API');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response.content,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('ai-assistant-chat');
  };

  const checkAuthStatus = () => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const authToken = getCookie('token');
    if (!authToken) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '⚠️ Sie sind nicht angemeldet. Bitte melden Sie sich an, um den AI-Assistenten zu nutzen.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return false;
    }
    return true;
  };

  return (
    <>
             {/* Floating AI Assistant Button */}
               <div
          className={cn(
            "fixed bottom-0 right-6 z-50 cursor-pointer animate-in fade-in-0 zoom-in-95 duration-700",
            className
          )}
        >
          <div
            className="relative transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-2 active:scale-95"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
                        <div className="w-24 h-24 rounded-full bg-green-500 shadow-lg relative overflow-hidden">
                           <img
                src={isHovered ? "/images/characters/jobjaeger_chat.png" : "/images/characters/jobjaeger_hide.png"}
                alt={isHovered ? "Jobjäger chat" : "Jobjäger versteckt"}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
              />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
           </div>
           
                       {/* Notification dot */}
            {messages.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-in zoom-in-95 duration-500" />
            )}
         </div>
       </div>

             {/* Chat Window */}
               {isOpen && (
          <div className="fixed bottom-0 right-6 z-50 animate-in slide-in-from-bottom-4 zoom-in-95 duration-500">
           {/* Chat Container */}
           <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                     <img
                       src={`/images/characters/jobjaeger-${currentMood}.png`}
                       alt="Jobjäger"
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <div>
                     <h3 className="font-semibold text-gray-900">Jobjäger</h3>
                     <p className="text-xs text-gray-500">Dein KI-Assistent</p>
                   </div>
                 </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearChat}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Chat löschen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                 {messages.length === 0 ? (
                   <div className="text-center text-gray-500 py-8">
                                           <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                       <img
                         src={`/images/characters/jobjaeger-${currentMood}.png`}
                         alt="Jobjäger"
                         className="w-full h-full object-cover"
                       />
                     </div>
                     <p className="text-sm">Hallo! Ich bin dein Jobjäger Assistent.</p>
                     <p className="text-xs mt-1">Wie kann ich dir heute helfen?</p>
                   </div>
                                 ) : (
                   messages.map((message) => (
                     <div
                       key={message.id}
                                               className={cn(
                          "flex animate-in fade-in-0 slide-in-from-bottom-2 duration-500",
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                     >
                       <div
                         className={cn(
                           "max-w-xs px-4 py-2 rounded-2xl text-sm",
                           message.role === 'user'
                             ? 'bg-green-500 text-white'
                             : 'bg-gray-100 text-gray-900'
                         )}
                       >
                         {message.content}
                       </div>
                     </div>
                   ))
                 )}
                 
                                   {isLoading && (
                    <div className="flex justify-start animate-in fade-in-0 duration-500">
                    <div className="bg-gray-100 text-gray-900 max-w-xs px-4 py-2 rounded-2xl text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nachricht eingeben..."
                                         className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                                     <button
                     onClick={sendMessage}
                     disabled={!inputValue.trim() || isLoading}
                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                    <Send className="w-4 h-4" />
                  </button>
                                 </div>
               </div>
             </div>
           </div>
         )}
     </>
   );
} 