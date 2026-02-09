"use client"

import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface HealthBarProps {
  currentHealth: number
  maxHealth: number
  shaking: boolean
}

export function HealthBar({ currentHealth, maxHealth, shaking }: HealthBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-sans text-muted-foreground mr-1">Lives</span>
      <div className={cn("flex gap-1.5", shaking && "animate-shake")}>
        {Array.from({ length: maxHealth }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              "w-6 h-6 transition-all duration-300",
              i < currentHealth
                ? "text-primary fill-primary"
                : "text-border fill-transparent"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="sr-only">{currentHealth} lives remaining out of {maxHealth}</span>
    </div>
  )
}
