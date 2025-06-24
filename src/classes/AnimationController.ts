import { IAnimationController } from '../types';

export class HungryAnimationController implements IAnimationController {
  private currentAnimation: 'hambre' | 'bell' = 'hambre';
  private animationInterval: NodeJS.Timeout | null = null;
  private readonly ANIMATION_SWITCH_INTERVAL = 1000; // 1 segundo

  constructor() {
    this.startAnimationCycle();
  }

  public playAnimation(): void {
    this.startAnimationCycle();
  }

  public stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  public getCurrentAnimation(): string {
    return this.currentAnimation;
  }

  private startAnimationCycle(): void {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      this.currentAnimation = this.currentAnimation === 'hambre' ? 'bell' : 'hambre';
    }, this.ANIMATION_SWITCH_INTERVAL);
  }

  public destroy(): void {
    this.stopAnimation();
  }
} 