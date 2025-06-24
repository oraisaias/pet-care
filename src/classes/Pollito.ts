import { PollitoState, IPollitoBehavior } from '../types';

export class Pollito implements IPollitoBehavior {
  private currentState: PollitoState;
  private hungerLevel: number;
  private points: number = 0;
  private readonly maxHunger: number = 100;
  private readonly hungerDecreaseRate: number = 1; // Puntos por segundo
  private readonly feedAmount: number = 3; // 3 puntos (3% del máximo)
  private readonly hungerThreshold: number = 50; // Umbral para considerar hambriento
  private readonly fullHungerDuration: number = 10000; // 10 segundos cuando está lleno
  private hungerTimer: NodeJS.Timeout | null = null;
  private eatingTimer: NodeJS.Timeout | null = null;
  private fullHungerTimer: NodeJS.Timeout | null = null;
  private readonly EATING_DURATION = 3000; // 3 segundos

  constructor() {
    this.currentState = PollitoState.FELIZ;
    this.hungerLevel = this.maxHunger;
    this.startHungerDecrease();
  }

  public getCurrentState(): PollitoState {
    return this.currentState;
  }

  public getHungerLevel(): number {
    return this.hungerLevel;
  }

  public getMaxHunger(): number {
    return this.maxHunger;
  }

  public getPoints(): number {
    return this.points;
  }

  public feed(): void {
    this.clearTimers();
    this.currentState = PollitoState.COMIENDO;
    
    // Incrementar puntos por alimentar
    this.points += 1;
    
    // Aumentar el nivel de hambre (máximo 3 puntos)
    this.hungerLevel = Math.min(this.maxHunger, this.hungerLevel + this.feedAmount);
    
    // Después de 3 segundos, vuelve a estar feliz
    this.eatingTimer = setTimeout(() => {
      this.currentState = PollitoState.FELIZ;
      this.checkFullHungerState();
    }, this.EATING_DURATION);
  }

  public isHungry(): boolean {
    return this.hungerLevel <= this.hungerThreshold;
  }

  public updateState(): void {
    // Verificar si debe cambiar a estado hambriento
    if (this.currentState === PollitoState.FELIZ && this.isHungry()) {
      this.currentState = PollitoState.HAMBRIENTO;
    }
  }

  private checkFullHungerState(): void {
    if (this.hungerLevel >= this.maxHunger) {
      this.currentState = PollitoState.LLENO;
      // Después de 10 segundos, vuelve a estar feliz y comienza a disminuir el hambre
      this.fullHungerTimer = setTimeout(() => {
        this.currentState = PollitoState.FELIZ;
        this.startHungerDecrease();
      }, this.fullHungerDuration);
    } else {
      this.startHungerDecrease();
    }
  }

  private startHungerDecrease(): void {
    this.hungerTimer = setInterval(() => {
      this.hungerLevel = Math.max(0, this.hungerLevel - this.hungerDecreaseRate);
      this.updateState();
    }, 1000); // Actualizar cada segundo
  }

  private clearTimers(): void {
    if (this.hungerTimer) {
      clearInterval(this.hungerTimer);
      this.hungerTimer = null;
    }
    if (this.eatingTimer) {
      clearTimeout(this.eatingTimer);
      this.eatingTimer = null;
    }
    if (this.fullHungerTimer) {
      clearTimeout(this.fullHungerTimer);
      this.fullHungerTimer = null;
    }
  }

  public destroy(): void {
    this.clearTimers();
  }
} 