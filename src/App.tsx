import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from './components/ui/button'
import './App.css'

type Player = '○' | '✕' | null
type GameState = 'selecting' | 'playing' | 'win' | 'draw'

function App() {
  const [playerSymbol, setPlayerSymbol] = useState<Player>(null)
  const [computerSymbol, setComputerSymbol] = useState<Player>(null)
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentTurn, setCurrentTurn] = useState<Player>(null)
  const [gameState, setGameState] = useState<GameState>('selecting')
  const [winner, setWinner] = useState<Player>(null)

  useEffect(() => {
    if (gameState !== 'playing' || !currentTurn) return

    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a])
        setGameState('win')
        return
      }
    }

    if (!board.includes(null)) {
      setGameState('draw')
      return
    }

    if (currentTurn === computerSymbol) {
      makeComputerMove()
    }
  }, [board, currentTurn, gameState])

  const handleSymbolSelect = (symbol: Player) => {
    if (symbol === '○') {
      setPlayerSymbol('○')
      setComputerSymbol('✕')
      setCurrentTurn('○') // Player goes first
    } else {
      setPlayerSymbol('✕')
      setComputerSymbol('○')
      setCurrentTurn('○') // Circle always goes first in traditional rules
    }
    setGameState('playing')
  }

  const handleCellClick = (index: number) => {
    if (
      gameState !== 'playing' || 
      board[index] !== null || 
      currentTurn !== playerSymbol
    ) {
      return
    }

    const newBoard = [...board]
    newBoard[index] = playerSymbol
    setBoard(newBoard)
    setCurrentTurn(computerSymbol)
  }

  const makeComputerMove = () => {
    setTimeout(() => {
      const emptyCells = board
        .map((cell, index) => cell === null ? index : -1)
        .filter(index => index !== -1)

      if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        const newBoard = [...board]
        newBoard[randomIndex] = computerSymbol
        setBoard(newBoard)
        setCurrentTurn(playerSymbol)
      }
    }, 500)
  }

  const handleRestart = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    
    if (playerSymbol) {
      setGameState('playing')
      setCurrentTurn('○')
    } else {
      setGameState('selecting')
      setPlayerSymbol(null)
      setComputerSymbol(null)
      setCurrentTurn(null)
    }
  }

  const renderStatus = () => {
    if (gameState === 'selecting') {
      return <h2 className="text-xl font-bold mb-4">Choose your symbol</h2>
    } else if (gameState === 'win') {
      return <h2 className="text-xl font-bold mb-4">{winner === playerSymbol ? 'You win!' : 'Computer wins!'}</h2>
    } else if (gameState === 'draw') {
      return <h2 className="text-xl font-bold mb-4">It's a draw!</h2>
    } else {
      return <h2 className="text-xl font-bold mb-4">Current turn: {currentTurn}</h2>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">○✕ Game</h1>
        
        {renderStatus()}
        
        {gameState === 'selecting' ? (
          <div className="flex justify-center gap-8 mb-6">
            <Button 
              onClick={() => handleSymbolSelect('○')}
              className="text-4xl h-20 w-20 rounded-full"
            >
              ○
            </Button>
            <Button 
              onClick={() => handleSymbolSelect('✕')}
              className="text-4xl h-20 w-20 rounded-full"
            >
              ✕
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`
                    h-24 w-full flex items-center justify-center text-4xl font-bold
                    border-2 border-gray-300 rounded-md transition-colors
                    ${cell ? 'cursor-default' : 'hover:bg-gray-100 cursor-pointer'}
                    ${gameState !== 'playing' || currentTurn !== playerSymbol ? 'cursor-default' : ''}
                  `}
                  disabled={gameState !== 'playing' || currentTurn !== playerSymbol}
                >
                  {cell}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                You: {playerSymbol} | Computer: {computerSymbol}
              </div>
              <Button 
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Restart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
