
import React, { useState, useEffect, useCallback } from 'react';
import { Player, BoardState, GamePhase, PiecePosition, CellState, GameMode } from '../types';
import { INITIAL_BOARD, PIECES_PER_PLAYER, WINNING_COMBINATIONS, PLAYER_COLORS, BOARD_SIZE, ADJACENCY_RULES, SVG_BOARD_LINES } from '../constants';
import XIcon from './icons/XIcon';
import OIcon from './icons/OIcon';

interface GameScreenProps {
  gameMode: GameMode;
  onExit: () => void;
}

const DOT_RADIUS = 15;
const SVG_CELL_SIZE = 80; 
const SVG_PADDING = 20; 
const SVG_VIEWBOX_SIZE = SVG_CELL_SIZE * (BOARD_SIZE -1) + SVG_PADDING * 2;


const GameScreen: React.FC<GameScreenProps> = ({ gameMode, onExit }) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.X);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.PLACEMENT);
  const [playerPiecesToPlace, setPlayerPiecesToPlace] = useState<Record<Player, number>>({
    [Player.X]: PIECES_PER_PLAYER,
    [Player.O]: PIECES_PER_PLAYER,
  });
  const [playerPiecesOnBoard, setPlayerPiecesOnBoard] = useState<Record<Player, PiecePosition[]>>({
    [Player.X]: [],
    [Player.O]: [],
  });
  const [selectedPiece, setSelectedPiece] = useState<PiecePosition | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [message, setMessage] = useState<string>('');
  const [winningCells, setWinningCells] = useState<PiecePosition[]>([]);

  const isAdjacent = useCallback((r1: number, c1: number, r2: number, c2: number): boolean => {
    if (r1 === r2 && c1 === c2) return false;
    const key = `${r1},${c1}`;
    const neighbors = ADJACENCY_RULES[key];
    if (neighbors) {
      return neighbors.some(n => n.row === r2 && n.col === c2);
    }
    return false;
  }, []);

  const checkWin = useCallback((currentBoard: BoardState, player: Player): PiecePosition[] | null => {
    for (const combination of WINNING_COMBINATIONS) {
      if (combination.every(pos => currentBoard[pos.row][pos.col] === player)) {
        return combination; 
      }
    }
    return null;
  }, []);

  const updateMessage = useCallback(() => {
    if (winner) {
      setMessage(`Player ${winner} wins!`);
      return;
    }
    if (gamePhase === GamePhase.PLACEMENT) {
      setMessage(`Player ${currentPlayer}, place your piece. (${playerPiecesToPlace[currentPlayer]} left)`);
    } else if (gamePhase === GamePhase.MOVEMENT) {
      if (selectedPiece) {
        setMessage(`Player ${currentPlayer}, move to an adjacent empty spot.`);
      } else {
        setMessage(`Player ${currentPlayer}, select a piece to move.`);
      }
    }
  }, [winner, gamePhase, currentPlayer, playerPiecesToPlace, selectedPiece]);

  useEffect(() => {
    updateMessage();
  }, [updateMessage]);

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(Player.X);
    setGamePhase(GamePhase.PLACEMENT);
    setPlayerPiecesToPlace({ [Player.X]: PIECES_PER_PLAYER, [Player.O]: PIECES_PER_PLAYER });
    setPlayerPiecesOnBoard({ [Player.X]: [], [Player.O]: [] });
    setSelectedPiece(null);
    setWinner(null);
    setWinningCells([]);
    // updateMessage will be called by its own useEffect due to state changes
  }, []); // Removed updateMessage from here as it's covered by its own effect

  useEffect(() => {
    resetGame();
  }, [gameMode, resetGame]);

  // Effect to handle phase transition from PLACEMENT to MOVEMENT
  useEffect(() => {
    if (gamePhase === GamePhase.PLACEMENT) {
      if (playerPiecesToPlace[Player.X] === 0 && playerPiecesToPlace[Player.O] === 0) {
        setGamePhase(GamePhase.MOVEMENT);
      }
    }
  }, [playerPiecesToPlace, gamePhase]);


  const handleCellClick = (row: number, col: number) => {
    if (winner || (gameMode === GameMode.SINGLE_PLAYER && currentPlayer === Player.O && gamePhase !== GamePhase.GAME_OVER) ) return;

    let newBoard = board.map(r => [...r]);

    if (gamePhase === GamePhase.PLACEMENT) {
      if (newBoard[row][col] === null && playerPiecesToPlace[currentPlayer] > 0) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        setPlayerPiecesToPlace(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] - 1 }));
        setPlayerPiecesOnBoard(prev => ({ ...prev, [currentPlayer]: [...prev[currentPlayer], { row, col }] }));
        
        const winningLine = checkWin(newBoard, currentPlayer);
        if (winningLine) {
          setWinner(currentPlayer);
          setWinningCells(winningLine);
          setGamePhase(GamePhase.GAME_OVER);
        } else {
            // Phase transition is now handled by useEffect. Just switch player.
            setCurrentPlayer(currentPlayer === Player.X ? Player.O : Player.X);
        }
      }
    } else if (gamePhase === GamePhase.MOVEMENT) {
      if (selectedPiece) {
        if (newBoard[row][col] === null && isAdjacent(selectedPiece.row, selectedPiece.col, row, col)) {
          newBoard[selectedPiece.row][selectedPiece.col] = null;
          newBoard[row][col] = currentPlayer;
          setBoard(newBoard);

          setPlayerPiecesOnBoard(prev => {
            const updatedPieces = prev[currentPlayer].filter(
              p => !(p.row === selectedPiece.row && p.col === selectedPiece.col)
            );
            updatedPieces.push({ row, col });
            return { ...prev, [currentPlayer]: updatedPieces };
          });
          
          setSelectedPiece(null);
          const winningLine = checkWin(newBoard, currentPlayer);
          if (winningLine) {
            setWinner(currentPlayer);
            setWinningCells(winningLine);
            setGamePhase(GamePhase.GAME_OVER);
          } else {
            setCurrentPlayer(currentPlayer === Player.X ? Player.O : Player.X);
          }
        } else if (board[row][col] === currentPlayer) { 
            setSelectedPiece({row, col});
        } else { 
            setSelectedPiece(null);
        }
      } else { 
        if (newBoard[row][col] === currentPlayer) {
          setSelectedPiece({ row, col });
        }
      }
    }
  };
  
  const performAiMove = useCallback((aiPlayer: Player, humanPlayer: Player, currentBoard: BoardState, currentPhase: GamePhase, aiPiecesToPlaceCount: number, currentAiPiecesOnBoard: PiecePosition[], currentHumanPiecesOnBoard: PiecePosition[]) => {
    let bestMove: { type: 'place', pos: PiecePosition } | { type: 'move', from: PiecePosition, to: PiecePosition } | null = null;

    if (currentPhase === GamePhase.PLACEMENT && aiPiecesToPlaceCount > 0) {
        // Check for AI winning move
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (currentBoard[r][c] === null) {
                    const tempBoard = currentBoard.map(rowArr => [...rowArr]);
                    tempBoard[r][c] = aiPlayer;
                    if (checkWin(tempBoard, aiPlayer)) {
                        bestMove = { type: 'place', pos: { row: r, col: c } };
                        break;
                    }
                }
            }
            if (bestMove) break;
        }

        // Check for human blocking move
        if (!bestMove) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    if (currentBoard[r][c] === null) {
                        const tempBoard = currentBoard.map(rowArr => [...rowArr]);
                        tempBoard[r][c] = humanPlayer;
                        if (checkWin(tempBoard, humanPlayer)) {
                            bestMove = { type: 'place', pos: { row: r, col: c } };
                            break;
                        }
                    }
                }
                if (bestMove) break;
            }
        }
        
        // Strategic placement (center, then random)
        if (!bestMove) {
            if (currentBoard[1][1] === null) {
                bestMove = { type: 'place', pos: { row: 1, col: 1 } };
            } else {
                const emptyCells: PiecePosition[] = [];
                currentBoard.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
                    if (cell === null) emptyCells.push({ row: r, col: c });
                }));
                if (emptyCells.length > 0) {
                    bestMove = { type: 'place', pos: emptyCells[Math.floor(Math.random() * emptyCells.length)] };
                }
            }
        }
    }
    else if (currentPhase === GamePhase.MOVEMENT) {
        // Check for AI winning move
        for (const piece of currentAiPiecesOnBoard) {
            const neighbors = ADJACENCY_RULES[`${piece.row},${piece.col}`] || [];
            for (const neighbor of neighbors) {
                if (currentBoard[neighbor.row][neighbor.col] === null) {
                    const tempBoard = currentBoard.map(r => [...r]);
                    tempBoard[piece.row][piece.col] = null;
                    tempBoard[neighbor.row][neighbor.col] = aiPlayer;
                    if (checkWin(tempBoard, aiPlayer)) {
                        bestMove = { type: 'move', from: piece, to: neighbor };
                        break;
                    }
                }
            }
            if (bestMove) break;
        }

        // Check for human blocking move
        if (!bestMove) {
            for (const humanPiece of currentHumanPiecesOnBoard) { // Iterate through human player's pieces
                const humanNeighbors = ADJACENCY_RULES[`${humanPiece.row},${humanPiece.col}`] || [];
                for (const humanNeighbor of humanNeighbors) { // Iterate through their possible moves
                    if (currentBoard[humanNeighbor.row][humanNeighbor.col] === null) { 
                        const tempBoardHumanWin = currentBoard.map(r => [...r]);
                        tempBoardHumanWin[humanPiece.row][humanPiece.col] = null; // Simulate human moving
                        tempBoardHumanWin[humanNeighbor.row][humanNeighbor.col] = humanPlayer;
                        if (checkWin(tempBoardHumanWin, humanPlayer)) { // If this move makes human win
                            // AI needs to block humanNeighbor. Find an AI piece that can move there.
                            for (const aiBlockPiece of currentAiPiecesOnBoard) {
                                if (isAdjacent(aiBlockPiece.row, aiBlockPiece.col, humanNeighbor.row, humanNeighbor.col) && currentBoard[humanNeighbor.row][humanNeighbor.col] === null) { // Ensure AI can move to the blocking spot
                                    bestMove = { type: 'move', from: aiBlockPiece, to: humanNeighbor };
                                    break;
                                }
                            }
                        }
                    }
                    if (bestMove) break;
                }
                if (bestMove) break;
            }
        }
        
        // Random valid move
        if (!bestMove) {
            const possibleMoves: { type: 'move', from: PiecePosition, to: PiecePosition }[] = [];
            for (const piece of currentAiPiecesOnBoard) {
                 const neighbors = ADJACENCY_RULES[`${piece.row},${piece.col}`] || [];
                 for (const neighbor of neighbors) {
                    if (currentBoard[neighbor.row][neighbor.col] === null) {
                        possibleMoves.push({ type: 'move', from: piece, to: neighbor });
                    }
                }
            }
            if (possibleMoves.length > 0) {
                bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            }
        }
    }

    if (bestMove) {
        let newBoardForAIMove = currentBoard.map(r => [...r]);
        if (bestMove.type === 'place') {
            const placePos = bestMove.pos;
            newBoardForAIMove[placePos.row][placePos.col] = aiPlayer;
            setBoard(newBoardForAIMove);
            
            setPlayerPiecesToPlace(prev => ({ ...prev, [aiPlayer]: prev[aiPlayer] - 1 }));
            setPlayerPiecesOnBoard(prev => ({ ...prev, [aiPlayer]: [...prev[aiPlayer], placePos] }));

            const winningLine = checkWin(newBoardForAIMove, aiPlayer);
            if (winningLine) {
                setWinner(aiPlayer);
                setWinningCells(winningLine);
                setGamePhase(GamePhase.GAME_OVER);
            } else {
                // Phase transition is handled by useEffect. Just switch player.
                setCurrentPlayer(humanPlayer);
            }
        } else if (bestMove.type === 'move') {
            const moveDetails = bestMove;
            newBoardForAIMove[moveDetails.from.row][moveDetails.from.col] = null;
            newBoardForAIMove[moveDetails.to.row][moveDetails.to.col] = aiPlayer;
            setBoard(newBoardForAIMove);

            setPlayerPiecesOnBoard(prev => {
                const pieces = prev[aiPlayer]
                    .filter(p => !(p.row === moveDetails.from.row && p.col === moveDetails.from.col));
                pieces.push({ row: moveDetails.to.row, col: moveDetails.to.col });
                return { ...prev, [aiPlayer]: pieces };
            });
            
            const winningLine = checkWin(newBoardForAIMove, aiPlayer);
            if (winningLine) {
                setWinner(aiPlayer);
                setWinningCells(winningLine);
                setGamePhase(GamePhase.GAME_OVER);
            } else {
                setCurrentPlayer(humanPlayer);
            }
        }
    }
  }, [checkWin, isAdjacent]); // Removed gamePhase from here, as it's passed as an argument


  useEffect(() => {
    if (gameMode === GameMode.SINGLE_PLAYER && currentPlayer === Player.O && !winner && gamePhase !== GamePhase.GAME_OVER) {
      const timer = setTimeout(() => {
        performAiMove(Player.O, Player.X, board, gamePhase, playerPiecesToPlace[Player.O], playerPiecesOnBoard[Player.O], playerPiecesOnBoard[Player.X]);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, gamePhase, board, playerPiecesToPlace, playerPiecesOnBoard, performAiMove]);


  const getCellStylingInfo = (row: number, col: number) => {
    const isWinning = winningCells.some(cell => cell.row === row && cell.col === col);
    let isCurrentlySelectable = false;
    let isCurrentlySelected = false;

    if (!winner && !(gameMode === GameMode.SINGLE_PLAYER && currentPlayer === Player.O)) {
        if (gamePhase === GamePhase.MOVEMENT) {
            if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
                isCurrentlySelected = true;
            } else if (selectedPiece && board[row][col] === null && isAdjacent(selectedPiece.row, selectedPiece.col, row, col)) {
                isCurrentlySelectable = true; 
            } else if (!selectedPiece && board[row][col] === currentPlayer) {
                isCurrentlySelectable = true; 
            }
        } else if (gamePhase === GamePhase.PLACEMENT && board[row][col] === null && playerPiecesToPlace[currentPlayer] > 0) { // Added check for pieces left
            isCurrentlySelectable = true; 
        }
    }
    return { isSelectable: isCurrentlySelectable, isSelected: isCurrentlySelected, isWinningCell: isWinning };
  };

  const playerXColor = PLAYER_COLORS[Player.X].text;
  const playerOColor = PLAYER_COLORS[Player.O].text;

  return (
    <div className="flex flex-col items-center p-4 md:p-6 bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl shadow-xl z-10 w-full max-w-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-1">
        {gameMode === GameMode.SINGLE_PLAYER ? 'Single Player' : 'Two Players'}
      </h2>
      <p className={`text-xl md:text-2xl font-semibold mb-4 h-12 flex items-center justify-center transition-all ${currentPlayer === Player.X ? playerXColor : playerOColor}`}>
        {message}
      </p>
      
      <div className="w-full max-w-xs md:max-w-sm aspect-square mb-6 relative">
        <svg viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`} className="w-full h-full">
          {SVG_BOARD_LINES.map((line, index) => (
            <line
              key={`line-${index}`}
              x1={SVG_PADDING + line.from.col * SVG_CELL_SIZE}
              y1={SVG_PADDING + line.from.row * SVG_CELL_SIZE}
              x2={SVG_PADDING + line.to.col * SVG_CELL_SIZE}
              y2={SVG_PADDING + line.to.row * SVG_CELL_SIZE}
              stroke="rgba(129, 140, 248, 0.6)" 
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}

          {board.map((rowArr, rowIndex) =>
            rowArr.map((cellValue, colIndex) => {
              const cx = SVG_PADDING + colIndex * SVG_CELL_SIZE;
              const cy = SVG_PADDING + rowIndex * SVG_CELL_SIZE;
              const { isSelectable, isSelected, isWinningCell } = getCellStylingInfo(rowIndex, colIndex);
              
              let dotFill = 'rgba(79, 70, 229, 0.7)'; 
              if (isWinningCell) dotFill = 'rgba(34, 197, 94, 0.8)'; 
              else if (isSelected) dotFill = 'rgba(52, 211, 153, 0.9)'; 
              else if (isSelectable) dotFill = 'rgba(250, 204, 21, 0.8)'; 
              
              return (
                <g key={`${rowIndex}-${colIndex}`} onClick={() => handleCellClick(rowIndex, colIndex)} className="cursor-pointer group" role="button" aria-label={`Cell ${rowIndex},${colIndex}`}>
                  <circle
                    cx={cx} cy={cy} r={DOT_RADIUS * 1.8} 
                    fill="transparent" 
                  />
                  <circle
                    cx={cx} cy={cy} r={DOT_RADIUS}
                    fill={dotFill}
                    stroke={isWinningCell ? 'rgba(134, 239, 172, 1)' : (isSelected? "rgba(16,185,129,1)" : "rgba(99, 102, 241, 0.9)")} 
                    strokeWidth={isWinningCell || isSelected ? 3 : 2}
                    className={`transition-all duration-150 ${isWinningCell ? 'animate-pulse' : ''} group-hover:stroke-yellow-300 group-hover:stroke-2`}
                  />
                  {cellValue === Player.X && (
                     <g transform={`translate(${cx - DOT_RADIUS * 1.4 / 2}, ${cy - DOT_RADIUS * 1.4 / 2})`}>
                       <XIcon size={DOT_RADIUS * 1.4} />
                     </g>
                  )}
                  {cellValue === Player.O && (
                    <g transform={`translate(${cx - DOT_RADIUS * 1.4 / 2}, ${cy - DOT_RADIUS * 1.4 / 2})`}>
                      <OIcon size={DOT_RADIUS * 1.4} />
                    </g>
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>


      <div className="flex space-x-4">
        <button
          onClick={resetGame}
          aria-label={winner ? 'Play Again' : 'Reset Game'}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {winner ? 'Play Again' : 'Reset Game'}
        </button>
        <button
          onClick={onExit}
          aria-label="Exit to Menu"
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Exit to Menu
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
    