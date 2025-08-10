import { useState, useCallback } from 'react'
import { ResumeParserService, ResumeParserResponse } from '@/lib/resume-parser'

interface ResumeParserState {
  isParsing: boolean
  error: string | null
  parsedData: any | null
  selectedFile: File | null
}

export function useResumeParser() {
  const [state, setState] = useState<ResumeParserState>({
    isParsing: false,
    error: null,
    parsedData: null,
    selectedFile: null,
  })

  const parseResume = useCallback(async (file: File) => {
    try {
      setState(prev => ({
        ...prev,
        isParsing: true,
        error: null,
        selectedFile: file,
      }))

      // Get auth token
      const authToken = ResumeParserService.getAuthToken()
      if (!authToken) {
        throw new Error('Bitte melde dich erneut an, um deinen Lebenslauf zu verarbeiten')
      }

      // Parse resume
      const parsedData = await ResumeParserService.parseResume(file, authToken)
      
      // Transform to onboarding format
      const transformedData = ResumeParserService.transformToOnboardingFormat(parsedData)
      
      setState(prev => ({
        ...prev,
        isParsing: false,
        parsedData: transformedData,
        error: null,
      }))

      return {
        method: 'file',
        file: file,
        fileName: file.name,
        parsedData: transformedData,
        originalApiResponse: parsedData
      }
      
    } catch (error) {
      console.error('Error parsing resume:', error)
      
      let errorMessage = 'Fehler beim Verarbeiten des Lebenslaufs'
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = 'Sitzung abgelaufen. Bitte melde dich erneut an.'
        } else if (error.message.includes('API request failed')) {
          errorMessage = 'Server-Fehler. Bitte versuche es später erneut.'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({
        ...prev,
        isParsing: false,
        error: errorMessage,
      }))

      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      isParsing: false,
      error: null,
      parsedData: null,
      selectedFile: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }))
  }, [])

  return {
    ...state,
    parseResume,
    reset,
    clearError,
  }
} 