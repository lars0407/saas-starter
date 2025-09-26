'use client';

import { CheckCircle, Bot, Clock, Loader2, FileText, Building2, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingEvent, LoadingTask } from '../types';

interface LoadingStateProps {
  isLoading: boolean;
  loadingEvent: LoadingEvent | null;
  loadingTasks: LoadingTask[];
}

export function LoadingState({
  isLoading,
  loadingEvent,
  loadingTasks,
}: LoadingStateProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventStyle = (type: string, status: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'action':
        if (status === 'pending') {
          return 'bg-yellow-50 border-yellow-200';
        } else if (status === 'success') {
          return 'bg-green-50 border-green-200';
        } else if (status === 'error') {
          return 'bg-red-50 border-red-200';
        }
        return 'bg-gray-50 border-gray-200';
      case 'status':
        return 'bg-gray-50 border-gray-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isLoading || !loadingEvent) {
    return null;
  }

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${getEventStyle(loadingEvent.type, 'pending')}`}>
      <div className="flex-shrink-0">
        {loadingEvent.type === 'message' ? (
          <Bot className="h-5 w-5 text-blue-500 animate-pulse" />
        ) : (
          <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {loadingEvent.type === 'message' ? 'Jobjäger Agent' : 'Jobjäger'}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(new Date())}
          </span>
          <Badge variant="secondary" className="text-xs">
            In Bearbeitung
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">{loadingEvent.content}</p>
          {!loadingTasks.length && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          )}
        </div>

        {/* Loading task checklist */}
        {loadingTasks.length > 0 && (
          <div className="mt-3 space-y-2">
            {loadingTasks.map((task, idx) => (
              <div key={`lt_${idx}`} className="flex items-center gap-2 text-sm">
                {task.done ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                )}
                <span className={task.done ? 'text-gray-600 line-through' : 'text-gray-700'}>{task.text}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading Metadata */}
        {loadingEvent.metadata && (
          <div className="mt-3 p-3 bg-white rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {loadingEvent.metadata.jobTitle && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">{loadingEvent.metadata.jobTitle}</span>
                </div>
              )}
              {loadingEvent.metadata.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-gray-500" />
                  <span>{loadingEvent.metadata.company}</span>
                </div>
              )}
              {loadingEvent.metadata.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span>{loadingEvent.metadata.location}</span>
                </div>
              )}
              {loadingEvent.metadata.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-500" />
                  <span>{loadingEvent.metadata.salary}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
