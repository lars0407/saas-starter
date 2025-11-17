"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const [step, setStep] = useState(1)

  const stepContent = [
    {
      title: "Jobempfehlungen",
      description:
        "Basierend auf deinem Profil zeigen wir dir die besten Jobangebote, die zu deinen Skills und Wünschen passen.",
      image: "/welcome/welcome_jobs.png",
    },
    {
      title: "Personalisierung von Lebenslauf",
      description:
        "Nutze unsere KI-Tools, um deinen Lebenslauf zu personalisieren und deine Bewerbungen zu optimieren.",
      image: "/welcome/welcome_lebenslauf.png",
    },
    {
      title: "Tracke deine Bewerbungen",
      description:
        "Behalte den Überblick über alle deine Bewerbungen und verfolge deinen Fortschritt in Echtzeit.",
      image: "/welcome/welcome_tracker.png",
    },
  ]

  const totalSteps = stepContent.length

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onOpenChange(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setStep(1) // Reset to first step when closing
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[400px] [&>button:last-child]:text-white">
        <div className="p-2">
          <img
            className="w-full rounded-lg object-cover"
            src={stepContent[step - 1].image}
            width={382}
            height={216}
            alt="Welcome"
          />
        </div>
        <div className="space-y-6 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>{stepContent[step - 1].description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setStep(index + 1)}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-primary transition-opacity cursor-pointer hover:opacity-60",
                    index + 1 === step ? "bg-primary opacity-100" : "opacity-20",
                  )}
                  aria-label={`Gehe zu Schritt ${index + 1}`}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Überspringen
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                  type="button"
                  onClick={handleContinue}
                >
                  Weiter
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                  >
                    Los geht's!
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

