"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export interface CardData {
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryCardProps {
  card: CardData
  onClick: (id: number) => void
  disabled: boolean
}

export function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id)
    }
  }

  console.log(`Rendering card ${card.id} - Fli${card.image}`)

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || card.isFlipped || card.isMatched}
      className={cn(
        "relative w-full aspect-[3/4] cursor-pointer [perspective:600px] group",
        (disabled || card.isFlipped || card.isMatched) && "cursor-default"
      )}
      aria-label={card.isFlipped || card.isMatched ? "Card revealed" : "Hidden card"}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
          (card.isFlipped || card.isMatched) && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Back of card (visible when not flipped) */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-lg overflow-hidden shadow-md border-2 border-border hover:border-primary/50 transition-colors">
          <Image
            src="/images/Card_back_01.svg.png"  
            alt="Card back"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 120px"
          />
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        </div>

        {/* Front of card (visible when flipped) */}
        <div
          className={cn(
            "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden shadow-md border-2",
            card.isMatched ? "border-accent ring-2 ring-accent/30" : "border-primary/30"
          )}
        >
          <Image
            src={card.image || "/placeholder.svg"}
            alt="Card front"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 120px"
          />
          {card.isMatched && (
            <div className="absolute inset-0 bg-accent/10" />
          )}
        </div>
      </div>
    </button>
  )
}
