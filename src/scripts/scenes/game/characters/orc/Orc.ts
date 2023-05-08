import config from '../../config.json';
import animationConfig from './orcAnimations.json';
import { Point, Rectangle, SpriteSheet, SpriteSheetAnimation } from 'r-row';
import { Character } from '../Character';
import { OrcTurnState } from './states/OrcTurnState';
import { GameMap } from '../../map/GameMap';
import { Hero } from '../hero/Hero';

export class Orc extends Character {
  private _spawnPosition: Point;
  public timerBeforeRespawn: number;
  public timerBeforeReAttack: number;

  constructor(spawnPosition: Point) {
    super(spawnPosition);
    this._spawnPosition = spawnPosition.clone();
    this.maxHealth = config.orc.health;
    this.spriteSheet = this._getSpriteSheet();
    this.respawn();
  }

  public update(dt: number): void {
    super.update(dt);
    if (this.timerBeforeReAttack === 0) return;
    this.timerBeforeReAttack -= dt;
    if (this.timerBeforeReAttack < 0) this.timerBeforeReAttack = 0;
  }

  public respawn(): void {
    this.position = this._spawnPosition.clone();
    this.health = this.maxHealth;
    this.state = new OrcTurnState(this);
    this.timerBeforeReAttack = 0;
  }

  public isInChaseRange(): boolean {
    const hero = Hero.player;
    const distance = this.position.getDistanceWithPoint(hero.position);
    if (distance <= config.orc.range.chase) {
      return true;
    }
    return false;
  }

  public isInAttackRange(): boolean {
    const hero = Hero.player;
    const distance = this.position.getDistanceWithPoint(hero.position);
    if (distance <= config.orc.range.attack) {
      return true;
    }
    return false;
  }

  public isRandomOnThousand(probability: number): boolean {
    const turnRand = Math.round(Math.random() * 1000);
    if (turnRand <= probability) {
      return true;
    }
    return false;
  }

  public moveAndReturnIsBlocked(dt: number): boolean {
    const speed = config.orc.speed.walk;
    let moveX = 0;
    let moveY = 0;

    // Get the direction of the movement
    if (this.hDirection === 'left') moveX -= 1;
    if (this.hDirection === 'right') moveX += 1;
    if (this.vDirection === 'up') moveY -= 1;
    if (this.vDirection === 'down') moveY += 1;

    // Normalize the movement vector
    const norm = Math.sqrt(moveX * moveX + moveY * moveY);
    moveX /= norm / (speed * 10 * dt);
    moveY /= norm / (speed * 10 * dt);

    // Move the orc and apply the collisions
    let isBlocked = true;
    const gameMap = GameMap.instance;
    const x = this.position.x + moveX;
    const areaXControl = new Rectangle(
      new Point(x - 4, this.position.y - 4),
      new Point(7.5, 7.5)
    );
    if (gameMap.isWalkable(areaXControl)) {
      this.position.x = x;
      isBlocked = false;
    }
    const y = this.position.y + moveY;
    const areaYControl = new Rectangle(
      new Point(this.position.x - 4, y - 4),
      new Point(7.5, 7.5)
    );
    if (gameMap.isWalkable(areaYControl)) {
      this.position.y = y;
      isBlocked = false;
    }
    return isBlocked;
  }

  public setFaceToTheHero(): void {
    const hero = Hero.player;
    const initialAnimationHDirection = this.animationHDirection;
    const initialAnimationVDirection = this.animationVDirection;

    if (this.position.x < hero.position.x) {
      this.hDirection = 'right';
      this.animationHDirection = 'right';
    } else if (this.position.x > hero.position.x) {
      this.hDirection = 'left';
      this.animationHDirection = 'left';
    } else {
      this.hDirection = null;
    }

    if (this.position.y < hero.position.y) {
      this.vDirection = 'down';
      this.animationVDirection = 'down';
    } else if (this.position.y > hero.position.y) {
      this.vDirection = 'up';
      this.animationVDirection = 'up';
    } else {
      this.vDirection = null;
    }

    if (
      this.animationHDirection !== initialAnimationHDirection ||
      this.animationVDirection !== initialAnimationVDirection
    ) {
      const animationName = `walk_${this.animationHDirection}_${this.animationVDirection}`;
      this.spriteSheet.setAnimation(animationName, false);
    }
  }

  private _getSpriteSheet(): SpriteSheet {
    const frameSize = new Point(
      animationConfig.frame.width,
      animationConfig.frame.height
    );
    const s = new SpriteSheet('orc', frameSize);
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
