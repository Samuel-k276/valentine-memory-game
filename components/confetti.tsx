"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      "hsl(345, 63%, 47%)",
      "hsl(38, 65%, 58%)",
      "hsl(0, 60%, 94%)",
      "hsl(345, 63%, 67%)",
      "hsl(0, 0%, 100%)",
    ]

    const generate = () => {
      // larger burst and larger pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 24,
        rotation: Math.random() * 360,
      }))
      setPieces(newPieces)
    }

    generate()
    // regenerate bursts while component is mounted
    const interval = setInterval(generate, 1100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.size > 12 ? "50%" : "2px",
            animation: `confetti-fall ${piece.duration}s ${piece.delay}s ease-in-out forwards`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
