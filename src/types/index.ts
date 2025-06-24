export enum PollitoState {
  FELIZ = 'feliz',
  HAMBRIENTO = 'hambriento',
  COMIENDO = 'comiendo',
  LLENO = 'lleno',
  MUERTO = 'muerto'
}

export interface IPollitoBehavior {
  updateState(): void;
  getCurrentState(): PollitoState;
  feed(): void;
  revive(): void;
  isHungry(): boolean;
  getHungerLevel(): number;
  getMaxHunger(): number;
  getPoints(): number;
  getRevivePoints(): number;
}

export interface IAnimationController {
  playAnimation(): void;
  stopAnimation(): void;
  getCurrentAnimation(): string;
}

export interface PollitoProps {
  pollito: IPollitoBehavior;
  onStateChange: (state: PollitoState) => void;
}

export interface HungryPollitoProps {
  onStateChange: (state: PollitoState) => void;
}

export interface HungerBarProps {
  currentHunger: number;
  maxHunger: number;
  points: number;
  revivePoints: number;
} 