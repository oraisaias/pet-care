export enum PollitoState {
  FELIZ = 'feliz',
  HAMBRIENTO = 'hambriento',
  LLENO = 'lleno',
  COMIENDO = 'comiendo',
  MUERTO = 'muerto',
}

export interface Pollito {
  state: PollitoState;
  hunger: number;
  maxHunger: number;
  points: number;
  revivePoints: number;
} 