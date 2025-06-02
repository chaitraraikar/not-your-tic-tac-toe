
import { BoardState, Player, PiecePosition } from './types';

export const BOARD_SIZE = 3;
export const PIECES_PER_PLAYER = 3;

export const INITIAL_BOARD: BoardState = Array(BOARD_SIZE)
  .fill(null)
  .map(() => Array(BOARD_SIZE).fill(null));

export const PLAYER_COLORS: Record<Player, { primary: string; gradientFrom: string; gradientTo: string; text: string }> = {
  [Player.X]: { primary: 'bg-orange-500', gradientFrom: 'from-orange-400', gradientTo: 'to-yellow-400', text: 'text-orange-400' }, // Adjusted text color for better contrast on dark bg
  [Player.O]: { primary: 'bg-blue-500', gradientFrom: 'from-blue-400', gradientTo: 'to-cyan-400', text: 'text-sky-400' }, // Adjusted text color
};

export const WINNING_COMBINATIONS: PiecePosition[][] = [
  // Rows
  [{row:0,col:0}, {row:0,col:1}, {row:0,col:2}],
  [{row:1,col:0}, {row:1,col:1}, {row:1,col:2}],
  [{row:2,col:0}, {row:2,col:1}, {row:2,col:2}],
  // Columns
  [{row:0,col:0}, {row:1,col:0}, {row:2,col:0}],
  [{row:0,col:1}, {row:1,col:1}, {row:2,col:1}],
  [{row:0,col:2}, {row:1,col:2}, {row:2,col:2}],
  // Diagonals
  [{row:0,col:0}, {row:1,col:1}, {row:2,col:2}],
  [{row:0,col:2}, {row:1,col:1}, {row:2,col:0}],
];

// Adjacency rules based on the provided image (Nine Men's Morris style connections)
export const ADJACENCY_RULES: Record<string, PiecePosition[]> = {
  '0,0': [{ row:0,col:1 }, { row:1,col:0 }, { row:1,col:1 }],
  '0,1': [{ row:0,col:0 }, { row:0,col:2 }, { row:1,col:1 }],
  '0,2': [{ row:0,col:1 }, { row:1,col:2 }, { row:1,col:1 }],
  '1,0': [{ row:0,col:0 }, { row:2,col:0 }, { row:1,col:1 }],
  '1,1': [
    { row:0,col:0 }, { row:0,col:1 }, { row:0,col:2 }, 
    { row:1,col:0 }, { row:1,col:2 }, 
    { row:2,col:0 }, { row:2,col:1 }, { row:2,col:2 }
  ],
  '1,2': [{ row:0,col:2 }, { row:2,col:2 }, { row:1,col:1 }],
  '2,0': [{ row:1,col:0 }, { row:2,col:1 }, { row:1,col:1 }],
  '2,1': [{ row:2,col:0 }, { row:2,col:2 }, { row:1,col:1 }],
  '2,2': [{ row:1,col:2 }, { row:2,col:1 }, { row:1,col:1 }],
};

// Lines to draw for the SVG board, based on ADJACENCY_RULES to match the image
// Derived to avoid duplicates and ensure all connections are represented once
export const SVG_BOARD_LINES: { from: PiecePosition, to: PiecePosition }[] = [
  // Horizontal
  { from: {row:0,col:0}, to: {row:0,col:1} }, { from: {row:0,col:1}, to: {row:0,col:2} },
  { from: {row:1,col:0}, to: {row:1,col:1} }, { from: {row:1,col:1}, to: {row:1,col:2} },
  { from: {row:2,col:0}, to: {row:2,col:1} }, { from: {row:2,col:1}, to: {row:2,col:2} },
  // Vertical
  { from: {row:0,col:0}, to: {row:1,col:0} }, { from: {row:1,col:0}, to: {row:2,col:0} },
  { from: {row:0,col:1}, to: {row:1,col:1} }, { from: {row:1,col:1}, to: {row:2,col:1} },
  { from: {row:0,col:2}, to: {row:1,col:2} }, { from: {row:1,col:2}, to: {row:2,col:2} },
  // Diagonals to/from center and corners
  { from: {row:0,col:0}, to: {row:1,col:1} },
  { from: {row:0,col:2}, to: {row:1,col:1} },
  { from: {row:2,col:0}, to: {row:1,col:1} },
  { from: {row:2,col:2}, to: {row:1,col:1} },
];
