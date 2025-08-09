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
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: context,
          history: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Entschuldigung, ich konnte deine Nachricht nicht verarbeiten. Bitte versuche es später erneut.',
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

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 cursor-pointer animate-in fade-in-0 zoom-in-95 duration-500",
          className
        )}
      >
        <div
          className="relative transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 active:scale-95"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg border-4 border-white relative overflow-hidden">
            <img
              src={`/images/characters/jobjaeger-${currentMood}.png`}
              alt="AI Assistant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Notification dot */}
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-in zoom-in-95 duration-300" />
          )}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* Chat Container */}
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Job-Jäger AI</h3>
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
                    <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Hallo! Ich bin dein Job-Jäger AI Assistent.</p>
                    <p className="text-xs mt-1">Wie kann ich dir heute helfen?</p>
                  </div>
                                 ) : (
                   messages.map((message) => (
                     <div
                       key={message.id}
                       className={cn(
                         "flex animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                         message.role === 'user' ? 'justify-end' : 'justify-start'
                       )}
                     >
                       <div
                         className={cn(
                           "max-w-xs px-4 py-2 rounded-2xl text-sm",
                           message.role === 'user'
                             ? 'bg-blue-500 text-white'
                             : 'bg-gray-100 text-gray-900'
                         )}
                       >
                         {message.content}
                       </div>
                     </div>
                   ))
                 )}
                 
                 {isLoading && (
                   <div className="flex justify-start animate-in fade-in-0 duration-300">
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
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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