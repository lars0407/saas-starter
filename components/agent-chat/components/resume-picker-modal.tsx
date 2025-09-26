'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentPreviewCard } from '@/components/job-search/document-preview-card';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { Document } from '../types';

interface ResumePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: Document[];
  resumesLoading: boolean;
  onSelectResume: (resume: Document) => void;
}

export function ResumePickerModal({
  isOpen,
  onClose,
  resumes,
  resumesLoading,
  onSelectResume,
}: ResumePickerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[90vh]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Wähle deinen Base-Lebenslauf 🚀
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Pick dein bestehendes CV als Grundlage für die KI-Generierung
          </p>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {resumesLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <DocumentSkeleton key={index} className="min-w-[300px] flex-shrink-0" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Noch kein Base-Lebenslauf vorhanden 😅
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Erstelle deinen ersten Lebenslauf, um mit der KI-Generierung zu starten
              </p>
              <Button 
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard/resume-generate';
                }}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Lebenslauf erstellen
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {resumes.map((resume) => (
                <div key={resume.id} onClick={() => onSelectResume(resume)} className="flex-shrink-0">
                  <DocumentPreviewCard
                    document={resume}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
