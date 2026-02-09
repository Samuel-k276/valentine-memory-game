"use client"

import { HeartCrack } from "lucide-react"

interface GameOverProps {
  onReset: () => void
}

export function GameOver({ onReset }: GameOverProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
      <div className="animate-fade-in-up bg-card rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm text-center border border-border">
        <HeartCrack className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3 text-balance">
          Oh no!
        </h2>
        <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-6">
          You ran out of lives, but love never gives up!
          Give it another try.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
