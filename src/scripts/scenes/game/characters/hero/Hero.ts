import { Character } from '../Character';
import config from '../../config.json';
import animationConfig from './heroAnimations.json';
import { Point, SpriteSheet, SpriteSheetAnimation } from 'r-row';
import { HeroIdleState } from './states/HeroIdleState';

export class Hero extends Character {
  private static _player: Hero;

  private constructor() {
    super(new Point(config.hero.spawnPosition.x, config.hero.spawnPosition.y));
    this.spriteSheet = this._getSpriteSheet();
    this.state = new HeroIdleState(this);
    this.maxHealth = config.hero.health;
    this.health = this.maxHealth;
  }

  public static get player(): Hero {
    if (!this._player) {
      this._player = new Hero();
    }
    return this._player;
  }

  public destroy(): void {
    Hero._player = undefined;
  }

  private _getSpriteSheet(): SpriteSheet {
    const frameSize = new Point(
      animationConfig.frame.width,
      animationConfig.frame.height
    );
    const s = new SpriteSheet('hero', frameSize);
    Object.entries(animationConfig.animations).forEach(([name, animation]) => {
      const a = new SpriteSheetAnimation(
        animation.frames,
        animation.speed,
        animation.loop
      );
      s.addAnimation(name, a);
    });
    return s;
  }
}
