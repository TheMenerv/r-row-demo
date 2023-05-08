import config from '../../../config.json';
import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { OrcIdleState } from './OrcIdleState';
import { OrcAttackState } from './OrcAttackState';
import { GameMap } from '../../../map/GameMap';
import { Point, Rectangle } from 'r-row';
import { Hero } from '../../hero/Hero';

export class OrcChaseState implements IState {
  public name = 'OrcChaseState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
    const animationName = `walk_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName, false);
  }

  public update(dt: number): void {
    if (!this.character.isInChaseRange()) {
      this.character.state = new OrcIdleState(this.character);
      return;
    }

    if (this._isHeroIsInAttackRange()) {
      if (this.character.timerBeforeReAttack <= 0) {
        this.character.state = new OrcAttackState(this.character);
        return;
      } else if (this.character.timerBeforeReAttack > 0) {
        this.character.state = new OrcIdleState(this.character);
      }
    }

    if (!this.character.isInAttackRange()) this._chaseHero(dt);
  }

  private _isHeroIsInAttackRange(): boolean {
    const hero = Hero.player;
    const distanceToHero = this.character.position.getDistanceWithPoint(
      hero.position
    );
    if (distanceToHero <= config.orc.range.attack) return true;
    return false;
  }

  private _chaseHero(dt: number): void {
    const speed = config.orc.speed.chase;
    let moveX = 0;
    let moveY = 0;

    // Set the direction to the hero
    this.character.setFaceToTheHero();

    // Get the direction of the movement
    if (this.character.hDirection === 'left') moveX -= 1;
    if (this.character.hDirection === 'right') moveX += 1;
    if (this.character.vDirection === 'up') moveY -= 1;
    if (this.character.vDirection === 'down') moveY += 1;

    // Normalize the movement vector
    const norm = Math.sqrt(moveX * moveX + moveY * moveY);
    moveX /= norm / (speed * 10 * dt);
    moveY /= norm / (speed * 10 * dt);

    // Move the orc and apply the collisions
    const gameMap = GameMap.instance;
    const x = this.character.position.x + moveX;
    const areaXControl = new Rectangle(
      new Point(x - 4, this.character.position.y - 4),
      new Point(7.5, 7.5)
    );
    if (gameMap.isWalkable(areaXControl)) {
      this.character.position.x = x;
    }
    const y = this.character.position.y + moveY;
    const areaYControl = new Rectangle(
      new Point(this.character.position.x - 4, y - 4),
      new Point(7.5, 7.5)
    );
    if (gameMap.isWalkable(areaYControl)) {
      this.character.position.y = y;
    }
  }
}
