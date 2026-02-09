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
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
  onClick: (id: number) => void
  disabled: boolean
}

export function MemoryCard({ id, image, isFlipped, isMatched, onClick, disabled }: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id)
    }
  }

  return (
    <button
      data-card-id={id}
      data-image={image}
      type="button"
      onClick={handleClick}
      disabled={disabled || isFlipped || isMatched}
      className={cn(
        "relative w-full aspect-[3/4] cursor-pointer [perspective:600px] group",
        (disabled || isFlipped || isMatched) && "cursor-default"
      )}
      aria-label={isFlipped || isMatched ? "Card revealed" : "Hidden card"}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
          (isFlipped || isMatched) && "[transform:rotateY(180deg)]"
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
            isMatched ? "border-accent ring-2 ring-accent/30" : "border-primary/30"
          )}
        >
          <Image
            src={image}
            alt="Card front"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 120px"
          />
          {(
            <div className="opacity-0 absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded pointer-events-none">
              {image}
            </div>
          )}
          {isMatched && <div className="absolute inset-0 bg-accent/10" />}
        </div>
      </div>
    </button>
  )
}
