import config from '../../../config.json';
import { Point, Rectangle, ServiceContainer } from 'r-row';
import { Character } from '../../Character';
import { IState } from '../../IStates';
import { HeroAttackState } from './HeroAttackState';
import { HeroIdleState } from './HeroIdleState';
import { GameMap } from '../../../map/GameMap';

export class HeroWalkState implements IState {
  public name = 'HeroWalkState';
  public character: Character;

  constructor(character: Character) {
    this.character = character;
  }

  public update(dt: number): void {
    const KB = ServiceContainer.Keyboard;
    const isAttackStarted = KB.isJustDown('Space');
    const isMoveEnded =
      KB.isUp('ArrowUp') &&
      KB.isUp('ArrowDown') &&
      KB.isUp('ArrowLeft') &&
      KB.isUp('ArrowRight');

    if (isAttackStarted) {
      this.character.state = new HeroAttackState(this.character);
      return;
    }

    if (isMoveEnded) {
      this.character.state = new HeroIdleState(this.character);
      return;
    }

    this._move(dt);
  }

  private _move(dt: number): void {
    const KB = ServiceContainer.Keyboard;
    const speed = config.hero.speed;
    let moveX = 0;
    let moveY = 0;

    // Get the direction of the movement
    if (KB.isDown('ArrowUp')) moveY -= 1;
    if (KB.isDown('ArrowDown')) moveY += 1;
    if (KB.isDown('ArrowLeft')) moveX -= 1;
    if (KB.isDown('ArrowRight')) moveX += 1;

    // If the movement is null, set the idle state
    if (moveX === 0 && moveY === 0) {
      this.character.state = new HeroIdleState(this.character);
      return;
    }

    // Normalize the movement vector
    const norm = Math.sqrt(moveX * moveX + moveY * moveY);
    moveX /= norm / (speed * 10 * dt);
    moveY /= norm / (speed * 10 * dt);

    // Move the character and apply the collisions
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

    // Set the directions
    if (moveY > 0) {
      this.character.vDirection = 'down';
      this.character.animationVDirection = 'down';
    } else if (moveY === 0) {
      this.character.vDirection = null;
    } else if (moveY < 0) {
      this.character.vDirection = 'up';
      this.character.animationVDirection = 'up';
    }
    if (moveX > 0) {
      this.character.hDirection = 'right';
      this.character.animationHDirection = 'right';
    } else if (moveX === 0) {
      this.character.hDirection = null;
    } else if (moveX < 0) {
      this.character.hDirection = 'left';
      this.character.animationHDirection = 'left';
    }

    // Set the animation
    const animationName = `walk_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    if (this.character.spriteSheet.currentAnimationName !== animationName) {
      this.character.spriteSheet.setAnimation(animationName);
    }
  }
}
