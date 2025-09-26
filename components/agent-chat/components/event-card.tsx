'use client';

import { 
  CheckCircle, 
  Clock,
  AlertCircle,
  Zap,
  Building2,
  MapPin,
  DollarSign,
  Bot,
  Link,
  Download,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
  FileText,
  Settings,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PDFViewer } from "@/components/ui/pdf-viewer";
import Image from "next/image";
import { AgentEvent, ApplicationDetails } from '../types';

interface EventCardProps {
  event: AgentEvent;
  applicationDetails: ApplicationDetails | null;
  expandedEvents: Set<string>;
  onToggleExpansion: (eventId: string) => void;
}

export function EventCard({
  event,
  applicationDetails,
  expandedEvents,
  onToggleExpansion,
}: EventCardProps) {
  // Debug logging
  if (event.metadata && !event.metadata.isSuccessfulApplication) {
    console.log('Event metadata for job display:', {
      ...event.metadata,
      jobDescriptionLength: event.metadata.jobDescription?.length || 0
    });
  }
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventIcon = (event: AgentEvent) => {
    switch (event.type) {
      case 'message':
        return <Bot className="h-5 w-5 text-blue-500" />;
      case 'action':
        if (event.status === 'pending') {
          return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
        } else if (event.status === 'success') {
          return (
            <div className="relative w-5 h-5">
              <Image
                src="/images/characters/jobjaeger-laechelnd.png"
                alt="Jobjaeger"
                width={20}
                height={20}
                className="object-contain w-full h-full"
              />
            </div>
          );
        } else if (event.status === 'error') {
          return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'status':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventDescription = (event: AgentEvent) => {
    return {
      action: event.content,
      status: event.status === 'success' ? 'Fertig' : event.status === 'error' ? 'Fehler' : 'Läuft...'
    };
  };

  const getRelatedDocument = (event: AgentEvent) => {
    if (!applicationDetails?.documents?.document_list) return null;
    
    const content = event.content.toLowerCase();
    
    if (content.includes('resume') || content.includes('lebenslauf')) {
      return applicationDetails.documents.document_list.find(doc => doc.type === 'resume');
    } else if (content.includes('coverletter') || content.includes('anschreiben') || content.includes('cover_letter')) {
      return applicationDetails.documents.document_list.find(doc => doc.type === 'cover letter');
    }
    
    return null;
  };

  const getEventStyle = (event: AgentEvent) => {
    switch (event.type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'action':
        if (event.status === 'pending') {
          return 'bg-yellow-50 border-yellow-200';
        } else if (event.status === 'success') {
          return 'bg-green-50 border-green-200';
        } else if (event.status === 'error') {
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

  const eventDesc = getEventDescription(event);
  const relatedDocument = getRelatedDocument(event);

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${getEventStyle(event)}`}>
      <div className="flex-shrink-0">
        {getEventIcon(event)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {event.type === 'message' ? 'Jobjaeger Agent' : 'Jobjaeger'}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(event.timestamp)}
          </span>
          <Badge 
            variant={event.status === 'success' ? 'default' : event.status === 'error' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {eventDesc.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-700 font-medium mb-1">{eventDesc.action}</p>
        {event.type === 'message' && (
          <p className="text-sm text-gray-600">{event.content}</p>
        )}

        {/* Step Details Dropdown */}
        {event.stepCount && event.stepCount > 0 && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpansion(event.id)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 p-0 h-auto"
            >
              {expandedEvents.has(event.id) ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {event.stepCount} abgeschlossene Schritte
            </Button>
            
            {expandedEvents.has(event.id) && event.stepDetails && (
              <div className="mt-2 bg-gray-50 rounded-lg p-3 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {event.stepDetails.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3 text-xs">
                      <div className="flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">{step.description}</span>
                          {step.url && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Globe className="h-3 w-3" />
                              <span className="text-xs">{step.url}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* PDF Preview for related documents */}
        {(relatedDocument || (event.metadata && event.metadata.documentLink)) && (
          <div className="mt-3 p-3 bg-white rounded-md border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                {relatedDocument ? 
                  (relatedDocument.type === 'resume' ? 'Lebenslauf' : 'Anschreiben') :
                  (event.metadata?.documentType === 'resume' ? 'Lebenslauf' : 'Anschreiben')
                }
              </span>
              <Badge variant="outline" className="text-xs">
                Vorschau
              </Badge>
            </div>
            <div className="w-32 h-40 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <PDFViewer
                pdfUrl={relatedDocument?.link || event.metadata?.documentLink || ''}
                showToolbar={false}
                showNavigation={false}
                showBorder={false}
                fallbackMessage=""
                downloadMessage=""
                placeholderMessage=""
                className="w-full h-full -mt-6 -mb-6 pointer-events-none"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <a 
                  href={relatedDocument?.link || event.metadata?.documentLink || ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <Link className="h-3 w-3" />
                  Öffnen
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open(relatedDocument?.link || event.metadata?.documentLink || '', '_blank')}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}
      
        {/* Application Success Information */}
        {event.metadata?.isSuccessfulApplication && (
          <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-black">Bewerbung erfolgreich eingereicht!</h4>
            </div>
            
            {/* Job URLs */}
            {event.metadata.jobUrls && event.metadata.jobUrls.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-2">Beworbene Stellen:</h5>
                <div className="space-y-2">
                  {event.metadata.jobUrls.map((url: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-black hover:text-gray-600 underline break-all"
                      >
                        {url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Output Video */}
            {event.metadata.outputVideoUrl && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-2">Agentvideo:</h5>
                <div className="space-y-2">
                  <video 
                    controls 
                    className="w-full max-w-md rounded-lg border border-green-200"
                    preload="metadata"
                  >
                    <source src={event.metadata.outputVideoUrl} type="video/webm" />
                    <source src={event.metadata.outputVideoUrl} type="video/mp4" />
                    Ihr Browser unterstützt das Video-Element nicht.
                  </video>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="border-gray-300 text-black hover:bg-gray-100"
                    >
                      <a 
                        href={event.metadata.outputVideoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Video in neuem Tab öffnen
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {event.metadata.additionalInfo && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-2">Zusätzliche Informationen:</h5>
                <p className="text-sm text-black bg-white p-2 rounded border">
                  {event.metadata.additionalInfo}
                </p>
              </div>
            )}
          </div>
        )}
      
        {/* Job Metadata */}
        {event.metadata && !event.metadata.isSuccessfulApplication && (event.metadata.jobTitle || event.metadata.jobDescription || event.metadata.jobOrigin) && (
          <div className="mt-3 p-3 bg-white rounded-md border">
            <div className="space-y-3">
              {/* Job Title */}
              {event.metadata.jobTitle && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-sm text-gray-900">{event.metadata.jobTitle}</span>
                </div>
              )}
              
              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {event.metadata.company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-gray-500" />
                    <span>{event.metadata.company}</span>
                  </div>
                )}
                {event.metadata.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span>{event.metadata.location}</span>
                  </div>
                )}
                {event.metadata.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span>{event.metadata.salary}</span>
                  </div>
                )}
                {event.metadata.employmentType && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>{event.metadata.employmentType}</span>
                  </div>
                )}
                {event.metadata.seniority && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-gray-500" />
                    <span>{event.metadata.seniority}</span>
                  </div>
                )}
              </div>
              
              {/* Job Description */}
              {event.metadata.jobDescription && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Job Description:</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {event.metadata.jobDescription}
                  </div>
                </div>
              )}
              
              {/* Job Origin URL */}
              {event.metadata.jobOrigin && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Source:</div>
                  <a 
                    href={event.metadata.jobOrigin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {event.metadata.jobOrigin}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}