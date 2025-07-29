import React from "react"
import { cn } from "@/lib/utils"
import { TypingEffect } from "./typing-effect"

interface SpeechBubbleProps {
  text: string
  className?: string
}

export function SpeechBubble({ text, className }: SpeechBubbleProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Speech Bubble */}
      <div className="bg-[#0F973D] text-white px-4 py-3 rounded-2xl max-w-xs shadow-lg">
        <p className="text-sm font-medium leading-relaxed">
          <TypingEffect text={text} speed={60} />
        </p>
        
        {/* Tail pointing to character */}
        <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#0F973D]"></div>
      </div>
    </div>
  )
} 