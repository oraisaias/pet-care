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
  private readonly fullHungerDuration: number = 10000; // 10 segundos cuando está lleno
  private hungerTimer: NodeJS.Timeout | null = null;
  private eatingTimer: NodeJS.Timeout | null = null;
  private fullHungerTimer: NodeJS.Timeout | null = null;
  private readonly EATING_DURATION = 3000; // 3 segundos
  private isFullState: boolean = false; // Bandera para controlar el período de estar lleno

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
    
    // Después de 3 segundos, verificar el estado
    this.eatingTimer = setTimeout(() => {
      // Verificar si debe estar lleno inmediatamente
      if (this.hungerLevel >= this.maxHunger) {
        this.currentState = PollitoState.LLENO;
        this.isFullState = true;
        this.stopHungerDecrease();
        // Después de 10 segundos, permitir que la barra baje
        this.fullHungerTimer = setTimeout(() => {
          console.log('Saliendo de estado lleno', {
            hungerLevel: this.hungerLevel,
            currentState: this.currentState,
            isFullState: this.isFullState
          });
          this.isFullState = false;
          this.startHungerDecrease();
        }, this.fullHungerDuration);
      } else {
        this.currentState = PollitoState.FELIZ;
        this.startHungerDecrease();
      }
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
    console.log('[POLLITO][updateState] hungerLevel:', this.hungerLevel, 'currentState:', this.currentState);
    // Verificar si debe cambiar a estado muerto
    if (this.hungerLevel <= 0) {
      if (this.currentState !== PollitoState.MUERTO) {
        console.log('[POLLITO][STATE_CHANGE] -> MUERTO');
        this.currentState = PollitoState.MUERTO;
        this.stopHungerDecrease();
        this.revivePoints += 1;
      }
      return;
    }
    if (this.hungerLevel >= this.maxHunger && this.currentState !== PollitoState.LLENO) {
      console.log('[POLLITO][STATE_CHANGE] -> LLENO');
      this.currentState = PollitoState.LLENO;
      this.isFullState = true;
      this.stopHungerDecrease();
      this.fullHungerTimer = setTimeout(() => {
        console.log('[POLLITO][SALIR_LLENO] hungerLevel:', this.hungerLevel, 'currentState:', this.currentState, 'isFullState:', this.isFullState);
        this.isFullState = false;
        this.startHungerDecrease();
      }, this.fullHungerDuration);
      return;
    }
    if (this.currentState === PollitoState.LLENO && this.hungerLevel < this.maxHunger) {
      console.log('[POLLITO][STATE_CHANGE] LLENO -> FELIZ');
      this.currentState = PollitoState.FELIZ;
    }
    if (this.currentState !== PollitoState.LLENO) {
      if (this.currentState === PollitoState.FELIZ && this.isHungry()) {
        console.log('[POLLITO][STATE_CHANGE] FELIZ -> HAMBRIENTO');
        this.currentState = PollitoState.HAMBRIENTO;
      } else if (this.currentState === PollitoState.HAMBRIENTO && !this.isHungry()) {
        console.log('[POLLITO][STATE_CHANGE] HAMBRIENTO -> FELIZ');
        this.currentState = PollitoState.FELIZ;
      }
    }
  }

  private startHungerDecrease(): void {
    // Solo iniciar si no hay un timer activo y no está lleno
    if (!this.hungerTimer && !this.isFullState) {
      this.hungerTimer = setInterval(() => {
        // Solo procesar si no está en estado lleno
        if (!this.isFullState) {
          this.hungerLevel = Math.max(0, this.hungerLevel - this.hungerDecreaseRate);
          this.updateState();
        }
      }, 1000); // Actualizar cada segundo
    }
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
    if (this.fullHungerTimer) {
      clearTimeout(this.fullHungerTimer);
      this.fullHungerTimer = null;
    }
  }

  public destroy(): void {
    this.clearTimers();
  }
} 