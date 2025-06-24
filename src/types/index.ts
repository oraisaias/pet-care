export enum PollitoState {
  FELIZ = 'feliz',
  HAMBRIENTO = 'hambriento',
  COMIENDO = 'comiendo'
}

export interface IPollitoBehavior {
  updateState(): void;
  getCurrentState(): PollitoState;
  feed(): void;
  isHungry(): boolean;
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