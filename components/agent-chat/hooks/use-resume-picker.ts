import { useState } from 'react';
import { Document } from '../types';

export function useResumePicker() {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumes, setResumes] = useState<Document[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);

  const fetchResumes = async (autoSelect = false) => {
    setResumesLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents?offset=0&variant=human&type=resume`,
        {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resumes API response:", data);
      
      if (data && data.document) {
        const resumes = data.document.items || [];
        setResumes(resumes);
        
        // Auto-select the latest resume if requested and resumes exist
        if (autoSelect && resumes.length > 0) {
          // Sort by created_at descending to get the latest
          const sortedResumes = resumes.sort((a: Document, b: Document) => b.created_at - a.created_at);
          return sortedResumes[0];
        }
      } else {
        setResumes([]);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  const handleOpenResumeModal = () => {
    setResumeModalOpen(true);
    fetchResumes();
  };

  return {
    resumeModalOpen,
    setResumeModalOpen,
    resumes,
    resumesLoading,
    fetchResumes,
    handleOpenResumeModal,
  };
}
