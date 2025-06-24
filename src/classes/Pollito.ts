import { PollitoState, IPollitoBehavior } from '../types';

export class Pollito implements IPollitoBehavior {
  private currentState: PollitoState;
  private lastFedTime: number;
  private hungerTimer: NodeJS.Timeout | null = null;
  private eatingTimer: NodeJS.Timeout | null = null;
  private readonly HUNGER_DELAY = 10000; // 10 segundos
  private readonly EATING_DURATION = 3000; // 3 segundos

  constructor() {
    this.currentState = PollitoState.FELIZ;
    this.lastFedTime = Date.now();
    this.startHungerTimer();
  }

  public getCurrentState(): PollitoState {
    return this.currentState;
  }

  public feed(): void {
    this.clearTimers();
    this.currentState = PollitoState.COMIENDO;
    this.lastFedTime = Date.now();
    
    // Después de 3 segundos, vuelve a estar feliz
    this.eatingTimer = setTimeout(() => {
      this.currentState = PollitoState.FELIZ;
      this.startHungerTimer();
    }, this.EATING_DURATION);
  }

  public isHungry(): boolean {
    return this.currentState === PollitoState.HAMBRIENTO;
  }

  public updateState(): void {
    // Este método puede ser usado para actualizaciones periódicas si es necesario
    if (this.currentState === PollitoState.FELIZ) {
      const timeSinceLastFed = Date.now() - this.lastFedTime;
      if (timeSinceLastFed >= this.HUNGER_DELAY) {
        this.currentState = PollitoState.HAMBRIENTO;
      }
    }
  }

  private startHungerTimer(): void {
    this.hungerTimer = setTimeout(() => {
      this.currentState = PollitoState.HAMBRIENTO;
    }, this.HUNGER_DELAY);
  }

  private clearTimers(): void {
    if (this.hungerTimer) {
      clearTimeout(this.hungerTimer);
      this.hungerTimer = null;
    }
    if (this.eatingTimer) {
      clearTimeout(this.eatingTimer);
      this.eatingTimer = null;
    }
  }

  public destroy(): void {
    this.clearTimers();
  }
} 