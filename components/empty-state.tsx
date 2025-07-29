import { FileText, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  onCreateResume?: () => void
  onCreateCoverLetter?: () => void
}

export function EmptyState({ onCreateResume, onCreateCoverLetter }: EmptyStateProps) {
  return (
    <Card className="border-dashed w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Noch nix am Start 👀
        </h3>
        
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          Zeit, deinen ersten Lebenslauf zu bauen oder ein freshes Anschreiben zu generieren!
        </p>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button 
            onClick={onCreateResume}
            className="flex items-center bg-[#0F973D] hover:bg-[#0D7A32] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Lebenslauf erstellen
          </Button>
          
          <Button 
            variant="outline"
            onClick={onCreateCoverLetter}
            className="flex items-center"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Anschreiben generieren
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 