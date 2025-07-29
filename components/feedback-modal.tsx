"use client"

import { useState } from "react"
import { MessageSquare, Bug, Lightbulb } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
}

export function FeedbackModal({ open, onOpenChange, userEmail }: FeedbackModalProps) {
  const [type, setType] = useState("general")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState(userEmail || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Uff, schreib doch was rein! 😅")
      return
    }

    if (message.trim().length < 10) {
      toast.error("Das ist ein bisschen kurz. Erzähl uns mehr! 📝")
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Das sieht nicht nach einer echten E-Mail aus! 📧")
      return
    }

    // Check if user is authenticated
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      toast.error("Du musst dich erst anmelden, um Feedback zu senden! 🔐")
      return
    }

    setLoading(true)
    try {
      // Get the authentication token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch("https://api.jobjaeger.de/api:O72K2wiB/feedback", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          type,
          user_email: email || userEmail,
          message: message.trim(),
          user_agent: navigator.userAgent,
          current_url: window.location.href,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(errorData.message || "Network response was not ok");
      }

      toast.success("Danke dir! Dein Feedback ist angekommen. 💙")
      onOpenChange(false)
      setMessage("")
      setType("general")
    } catch (error) {
      console.error("Feedback submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("Authentication required")) {
        toast.error("Du musst dich erst anmelden! 🔐")
      } else {
        toast.error("Uff, da ging was schief. Probier's nochmal, okay? 😅")
      }
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (feedbackType: string) => {
    switch (feedbackType) {
      case "bug":
        return <Bug className="h-4 w-4" />
      case "idea":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeLabel = (feedbackType: string) => {
    switch (feedbackType) {
      case "bug":
        return "🐞 Bug – Irgendwas läuft nicht rund"
      case "idea":
        return "💡 Idee – Ich hab da was im Kopf!"
      default:
        return "💬 Allgemein – Just some thoughts"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] [&>button]:hover:text-[#0F973D] [&>button]:hover:bg-[#0F973D]/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Gib uns dein Feedback
          </DialogTitle>
          <DialogDescription>
            Sag uns, was dich nervt, was fehlt oder was du einfach nice findest.
            Ob Bug, Idee oder einfach Gedanken – wir hören zu. 🙌
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Feedback-Typ</Label>
            <RadioGroup value={type} onValueChange={setType} className="space-y-3">
              {["bug", "idea", "general"].map((feedbackType) => (
                <div key={feedbackType} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={feedbackType} 
                    id={feedbackType}
                    className="data-[state=checked]:border-[#0F973D] data-[state=checked]:bg-white [&[data-state=checked]>span]:bg-[#0F973D]"
                  />
                  <Label
                    htmlFor={feedbackType}
                    className={`flex items-center gap-2 text-sm cursor-pointer ${
                      type === feedbackType ? 'text-[#0F973D] font-medium' : ''
                    }`}
                  >
                    {getTypeIcon(feedbackType)}
                    {getTypeLabel(feedbackType)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium">
              Was sollen wir wissen? Hau raus!
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Erzähl uns alles! Je mehr Details, desto besser können wir helfen. 🚀"
              className="min-h-[120px] resize-none focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-1"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {message.length}/1000
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              E-Mail (optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wenn du willst, schreib deine Mail rein. Vielleicht melden wir uns."
              className="text-sm focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-1"
            />
            <p className="text-xs text-muted-foreground">
              Kein Spam. Ehrenwort. 🤝
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
              className="flex-1 bg-[#0F973D] hover:bg-[#0D7A32] disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback abschicken
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 