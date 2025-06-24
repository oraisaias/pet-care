import { PollitoState } from '../types';
import { Pollito } from './Pollito';

export class PetCareGame {
  private pollito: Pollito;
  private currentState: PollitoState;
  private showInitialAnimation: boolean = true;
  private initialAnimationTimer: NodeJS.Timeout | null = null;
  private stateUpdateTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.pollito = new Pollito();
    this.currentState = this.pollito.getCurrentState();
    this.startInitialAnimation();
    this.startStateMonitoring();
  }

  public getCurrentState(): PollitoState {
    return this.currentState;
  }

  public isShowingInitialAnimation(): boolean {
    return this.showInitialAnimation;
  }

  public feedPollito(): void {
    this.pollito.feed();
    this.currentState = this.pollito.getCurrentState();
  }

  public canFeed(): boolean {
    return this.currentState !== PollitoState.COMIENDO;
  }

  private startInitialAnimation(): void {
    this.initialAnimationTimer = setTimeout(() => {
      this.showInitialAnimation = false;
    }, 3000); // 3 segundos para la animación inicial
  }

  private startStateMonitoring(): void {
    this.stateUpdateTimer = setInterval(() => {
      const newState = this.pollito.getCurrentState();
      if (newState !== this.currentState) {
        this.currentState = newState;
      }
    }, 100); // Verificar cada 100ms
  }

  public destroy(): void {
    if (this.initialAnimationTimer) {
      clearTimeout(this.initialAnimationTimer);
    }
    if (this.stateUpdateTimer) {
      clearInterval(this.stateUpdateTimer);
    }
    this.pollito.destroy();
  }
} 