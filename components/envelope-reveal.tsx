"use client"

import { useState } from "react"
import { Confetti } from "./confetti"

interface EnvelopeRevealProps {
  onReset: () => void
}

export function EnvelopeReveal({ onReset }: EnvelopeRevealProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => {
      setShowMessage(true)
      setShowConfetti(true)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
      {showConfetti && <Confetti />}

      <div className="flex flex-col items-center gap-8 animate-fade-in-up">
        {/* Envelope */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpen}
          className="relative w-72 h-48 sm:w-80 sm:h-52 cursor-pointer group"
          aria-label={isOpen ? "Envelope opened" : "Click to open envelope"}
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-primary rounded-lg shadow-2xl" />

          {/* Envelope bottom flap (triangle) */}
          <div
            className="absolute inset-x-0 bottom-0 h-full overflow-hidden rounded-lg"
            aria-hidden="true"
          >
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "160px solid transparent",
                borderRight: "160px solid transparent",
                borderBottom: "120px solid hsl(345, 63%, 40%)",
              }}
            />
          </div>

          {/* Envelope top flap */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-700 ease-in-out ${
              isOpen ? "[transform:rotateX(180deg)]" : ""
            }`}
            aria-hidden="true"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "160px solid transparent",
                borderRight: "160px solid transparent",
                borderTop: "104px solid hsl(345, 63%, 52%)",
              }}
            />
          </div>

          {/* Heart seal */}
          {!isOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse-heart">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="hsl(38, 65%, 58%)"
                className="drop-shadow-lg"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}

          {!isOpen && (
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-sans text-muted-foreground whitespace-nowrap group-hover:text-foreground transition-colors">
              Click to open
            </span>
          )}
        </button>

        {/* Message that rises from envelope */}
        {showMessage && (
          <div className="animate-fade-in-up bg-card rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm text-center border border-border">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="hsl(345, 63%, 47%)"
              className="mx-auto mb-4 animate-pulse-heart"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3 text-balance">
              Will you be my Valentine?
            </h2>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-6">
              You matched all the cards and unlocked my heart.
              Every moment with you is a perfect match.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg"
                onClick={() => {
                  setShowConfetti(false)
                  setTimeout(() => setShowConfetti(true), 50)
                }}
              >
                Yes!
              </button>
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
