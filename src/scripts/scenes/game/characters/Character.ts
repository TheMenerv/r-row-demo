import { Point, Sound, SpriteSheet } from 'r-row';
import { IState } from './IStates';

export class Character {
  public state: IState;
  public position: Point;
  public vDirection: 'up' | 'down';
  public hDirection: 'left' | 'right';
  public animationVDirection: 'up' | 'down';
  public animationHDirection: 'left' | 'right';
  public spriteSheet: SpriteSheet;
  public attackSound: Sound;
  public health: number;
  public maxHealth: number;

  protected constructor(position: Point) {
    this.position = position;
    this.vDirection = 'down';
    this.hDirection = 'right';
    this.animationVDirection = 'down';
    this.animationHDirection = 'right';
    this.attackSound = new Sound('punch');
  }

  public update(dt: number): void {
    this.state.update(dt);
    this.spriteSheet.position = this.position;
    this.spriteSheet.update(dt);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.spriteSheet.draw(ctx);
  }

  public isTouched(attacker: Character, victime: Character): boolean {
    const a =
      this._angle(attacker.position, victime.position) * (180 / Math.PI);
    switch (attacker.spriteSheet.currentAnimationName) {
      case 'attack_right_up':
        return a >= -110 && a <= 20;
      case 'attack_left_up':
        return (a <= -70 && a >= -180) || (a <= 160 && a >= 180);
      case 'attack_right_down':
        return a >= -20 && a <= 110;
      case 'attack_left_down':
        return (a >= -180 && a <= -160) || (a >= 70 && a <= 180);
      default:
        return false;
    }
  }

  private _angle(p1: Point, p2: Point): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
}
