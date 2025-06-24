import { PollitoState, IPollitoBehavior } from '../types';
import { Pollito } from './Pollito';

export class PetCareGame implements IPollitoBehavior {
  private pollito: Pollito;
  private stateUpdateTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.pollito = new Pollito();
    this.startStateMonitoring();
  }

  public getCurrentState(): PollitoState {
    return this.pollito.getCurrentState();
  }

  public getHungerLevel(): number {
    return this.pollito.getHungerLevel();
  }

  public getMaxHunger(): number {
    return this.pollito.getMaxHunger();
  }

  public feed(): void {
    this.pollito.feed();
  }

  public isHungry(): boolean {
    return this.pollito.isHungry();
  }

  public updateState(): void {
    this.pollito.updateState();
  }

  public feedPollito(): void {
    this.feed();
  }

  public canFeed(): boolean {
    return this.getCurrentState() !== PollitoState.COMIENDO;
  }

  private startStateMonitoring(): void {
    this.stateUpdateTimer = setInterval(() => {
      this.updateState();
    }, 1000); // Verificar cada segundo
  }

  public destroy(): void {
    if (this.stateUpdateTimer) {
      clearInterval(this.stateUpdateTimer);
    }
    this.pollito.destroy();
  }
} 