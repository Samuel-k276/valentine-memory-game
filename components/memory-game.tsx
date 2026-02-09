"use client"

import { useReducer, useCallback, useEffect, useState } from "react"
import { MemoryCard, type CardData } from "./memory-card"
import { HealthBar } from "./health-bar"
import { EnvelopeReveal } from "./envelope-reveal"
import { GameOver } from "./game-over"
import { Trophy } from "lucide-react"

const MAX_HEALTH = 8
const STORAGE_KEY = "memoryGameLives"

// Create pairs: [0.jpg, 0.jpg, 1.jpg, 1.jpg, ..., 11.jpg, 11.jpg]
function createCardPairs(): CardData[] {
  const images = Array.from({ length: 24 }, (_, i) => `/images/${Math.floor(i/2)}.jpg`)
  
  // Shuffle the images array
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  
  // Create cards with shuffled images
  return images.map((image, index) => ({
    id: index,
    image,
    isFlipped: false,
    isMatched: false,
  }))
}

interface GameState {
  cards: CardData[]
  health: number
  matchedPairs: number
  firstPick: { id: number; image: string } | null
  secondPick: { id: number; image: string } | null
  pendingResult: "match" | "mismatch" | null
  isChecking: boolean
  isShaking: boolean
  gameWon: boolean
  gameLost: boolean
  moves: number
}

type GameAction =
  | { type: "FLIP_CARD"; id: number }
  | { type: "RESOLVE" }
  | { type: "STOP_SHAKING" }
  | { type: "SET_WON" }
  | { type: "SET_LOST" }
  | { type: "RESET"; health?: number }
  | { type: "SET_INITIAL_HEALTH"; health: number }

function createInitialState(): GameState {
  return {
    cards: createCardPairs(),
    health: MAX_HEALTH,
    matchedPairs: 0,
    firstPick: null,
    secondPick: null,
    pendingResult: null,
    isChecking: false,
    isShaking: false,
    gameWon: false,
    gameLost: false,
    moves: 0,
  }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "FLIP_CARD": {
      if (state.isChecking || state.gameWon || state.gameLost) return state

      const clickedCard = state.cards.find((c) => c.id === action.id)
      if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return state

      const newCards = state.cards.map((card) =>
        card.id === action.id ? { ...card, isFlipped: true } : card,
      )

      if (state.firstPick === null) {
        return {
          ...state,
          cards: newCards,
          firstPick: { id: clickedCard.id, image: clickedCard.image },
        }
      }

      // Second pick -- determine match/mismatch by comparing image sources
      const isMatch = state.firstPick.image === clickedCard.image

      return {
        ...state,
        cards: newCards,
        secondPick: { id: clickedCard.id, image: clickedCard.image },
        pendingResult: isMatch ? "match" : "mismatch",
        isChecking: true,
        moves: state.moves + 1,
      }
    }

    case "RESOLVE": {
      if (!state.firstPick || !state.secondPick || !state.pendingResult) return state

      if (state.pendingResult === "match") {
        const newCards = state.cards.map((card) =>
          card.id === state.firstPick!.id || card.id === state.secondPick!.id
            ? { ...card, isMatched: true }
            : card,
        )
        return {
          ...state,
          cards: newCards,
          matchedPairs: state.matchedPairs + 1,
          firstPick: null,
          secondPick: null,
          pendingResult: null,
          isChecking: false,
        }
      }

      // mismatch
      const newCards = state.cards.map((card) =>
        card.id === state.firstPick!.id || card.id === state.secondPick!.id
          ? { ...card, isFlipped: false }
          : card,
      )
      return {
        ...state,
        cards: newCards,
        health: state.health - 1,
        firstPick: null,
        secondPick: null,
        pendingResult: null,
        isChecking: false,
        isShaking: true,
      }
    }

    case "STOP_SHAKING":
      return { ...state, isShaking: false }

    case "SET_WON":
      return { ...state, gameWon: true }

    case "SET_LOST":
      return { ...state, gameLost: true }

    case "RESET":
      return {
        ...createInitialState(),
        health: action.health ?? MAX_HEALTH,
      }

    case "SET_INITIAL_HEALTH":
      return { ...state, health: action.health }

    default:
      return state
  }
}

export function MemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)
  const { cards, health, matchedPairs, pendingResult, isChecking, isShaking, gameWon, gameLost } = state
  
  const [storedLives, setStoredLives] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : MAX_HEALTH
  })
  const [gameWasLost, setGameWasLost] = useState(false)
  const [gameWasWon, setGameWasWon] = useState(false)

  // Update game health when storedLives changes on mount
  useEffect(() => {
    dispatch({ type: "SET_INITIAL_HEALTH", health: storedLives })
  }, [])

  // Save lives to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(storedLives))
  }, [storedLives])

  // Track when game is lost
  useEffect(() => {
    if (gameLost) {
      setGameWasLost(true)
    }
  }, [gameLost])

  // Track when game is won
  useEffect(() => {
    if (gameWon) {
      setGameWasWon(true)
    }
  }, [gameWon])

  console.log(cards)

  const resetGame = useCallback(() => {
    // If the game was won, reset to 8 lives
    if (gameWasWon) {
      setStoredLives(MAX_HEALTH)
      dispatch({ type: "RESET", health: MAX_HEALTH })
      setGameWasWon(false)
    } 
    // If the game was lost, add 1 extra life for next game
    else if (gameWasLost) {
      const newLives = storedLives + 1
      setStoredLives(newLives)
      dispatch({ type: "RESET", health: newLives })
      setGameWasLost(false)
    } else {
      dispatch({ type: "RESET", health: storedLives })
    }
  }, [gameWasWon, gameWasLost, storedLives])

  const handleCardClick = useCallback((id: number) => {
    dispatch({ type: "FLIP_CARD", id })
  }, [state.cards])

  // When a pending result is set, schedule resolution after a delay for animation
  useEffect(() => {
    if (pendingResult === null) return

    const delay = pendingResult === "match" ? 600 : 900
    const timer = setTimeout(() => {
      dispatch({ type: "RESOLVE" })
    }, delay)

    return () => clearTimeout(timer)
  }, [pendingResult])

  // Stop shaking after animation
  useEffect(() => {
    if (!isShaking) return
    const timer = setTimeout(() => dispatch({ type: "STOP_SHAKING" }), 500)
    return () => clearTimeout(timer)
  }, [isShaking])

  // Check win/loss conditions
  useEffect(() => {
    if (matchedPairs === 12 && !gameWon) {
      const timer = setTimeout(() => dispatch({ type: "SET_WON" }), 700)
      return () => clearTimeout(timer)
    }
  }, [matchedPairs, gameWon])

  useEffect(() => {
    if (health <= 0 && !gameLost) {
      const timer = setTimeout(() => dispatch({ type: "SET_LOST" }), 600)
      return () => clearTimeout(timer)
    }
  }, [health, gameLost])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-6 pb-4 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-1 text-balance">
          A Game For You
        </h1>
        <p className="text-sm font-sans text-muted-foreground">
          Match all the pairs to reveal a surprise
        </p>
      </header>

      {/* Game Stats */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between bg-card rounded-xl px-4 py-3 shadow-sm border border-border">
          <HealthBar currentHealth={health} maxHealth={storedLives} shaking={isShaking} />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-sm font-sans text-muted-foreground">
                <span className="text-foreground font-medium">{matchedPairs}</span>/12
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-6 gap-2 sm:gap-3" role="grid" aria-label="Memory card game grid">
          {cards.map((card) => (
            <MemoryCard
              image={card.image}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              id={card.id}
              key={card.id}
              onClick={handleCardClick}
              disabled={isChecking || gameWon || gameLost}
            />
          ))}
        </div>
      </main>

      {/* Win state - Envelope Reveal */}
      {gameWon && <EnvelopeReveal onReset={resetGame} />}

      {/* Lose state */}
      {gameLost && <GameOver onReset={resetGame} />}
    </div>
  )
}
