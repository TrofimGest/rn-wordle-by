export enum GameCondition {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

export interface GameDataState {
  rows: string[][];
  currentRow: number;
  currentColumn: number;
  gameState: GameCondition;
}

interface GameState {
  gameState: string;
  rows: Array<Array<boolean>>;
}

export interface GameData {
  [key: string]: GameState;
}
