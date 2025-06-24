import { PollitoState, IPollitoBehavior } from '../types';

export class Pollito implements IPollitoBehavior {
  private currentState: PollitoState;
  private hungerLevel: number;
  private points: number = 0;
  private revivePoints: number = 0;
  private readonly maxHunger: number = 100;
  private readonly hungerDecreaseRate: number = 1; // Puntos por segundo
  private readonly feedAmount: number = 3; // 3 puntos (3% del máximo)
  private readonly hungerThreshold: number = 50; // Umbral para considerar hambriento
  private hungerTimer: NodeJS.Timeout | null = null;
  private eatingTimer: NodeJS.Timeout | null = null;
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

  public getRevivePoints(): number {
    return this.revivePoints;
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
      this.startHungerDecrease();
    }, this.EATING_DURATION);
  }

  public revive(): void {
    if (this.revivePoints > 0) {
      this.clearTimers();
      this.currentState = PollitoState.COMIENDO;
      
      // Usar un punto de revivir
      this.revivePoints -= 1;
      
      // Revivir con hambre inicial
      this.hungerLevel = this.feedAmount; // Revivir con 3 puntos de hambre
      
      // Después de 3 segundos, vuelve a estar feliz
      this.eatingTimer = setTimeout(() => {
        this.currentState = PollitoState.FELIZ;
        this.startHungerDecrease();
      }, this.EATING_DURATION);
    }
  }

  public isHungry(): boolean {
    return this.hungerLevel <= this.hungerThreshold;
  }

  public updateState(): void {
    // Verificar si debe cambiar a estado muerto
    if (this.hungerLevel <= 0) {
      if (this.currentState !== PollitoState.MUERTO) {
        this.currentState = PollitoState.MUERTO;
        this.stopHungerDecrease();
        // Dar un punto de revivir cuando muere
        this.revivePoints += 1;
      }
      return;
    }

    // Verificar si debe cambiar a estado lleno (solo mientras esté al 100%)
    if (this.hungerLevel >= this.maxHunger) {
      if (this.currentState !== PollitoState.LLENO) {
        this.currentState = PollitoState.LLENO;
      }
    } else {
      // Si no está al 100%, volver al estado normal
      if (this.currentState === PollitoState.LLENO) {
        this.currentState = PollitoState.FELIZ;
      }
    }

    // Verificar si debe cambiar a estado hambriento
    if (this.currentState === PollitoState.FELIZ && this.isHungry()) {
      this.currentState = PollitoState.HAMBRIENTO;
    }
  }

  private checkFullHungerState(): void {
    if (this.hungerLevel >= this.maxHunger) {
      this.currentState = PollitoState.LLENO;
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

  private stopHungerDecrease(): void {
    if (this.hungerTimer) {
      clearInterval(this.hungerTimer);
      this.hungerTimer = null;
    }
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
  }

  public destroy(): void {
    this.clearTimers();
  }
} 