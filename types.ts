
export enum Player {
  X = 'X',
  O = 'O',
}

export type CellState = Player | null;

export type BoardState = CellState[][];

export enum GamePhase {
  PLACEMENT = 'PLACEMENT',
  MOVEMENT = 'MOVEMENT',
  GAME_OVER = 'GAME_OVER',
}

export interface PiecePosition {
  row: number;
  col: number;
}

export enum GameMode {
  SINGLE_PLAYER = 'SINGLE_PLAYER',
  TWO_PLAYERS = 'TWO_PLAYERS',
}
