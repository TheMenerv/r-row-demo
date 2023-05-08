import { Character } from '../../Character';
import { IState } from '../../IStates';
import { HeroDeadState } from './HeroDeadState';
import { HeroIdleState } from './HeroIdleState';

export class HeroHitState implements IState {
  public name = 'HeroHitState';
  public character: Character;

  constructor(character: Character) {
    this.character = character;
    const animationName = `hit_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
  }

  public update(dt: number): void {
    if (this.character.health <= 0) {
      this.character.health = 0;
      this.character.state = new HeroDeadState(this.character);
    }
    if (this.character.spriteSheet.isAnimationEnded) {
      this.character.state = new HeroIdleState(this.character);
    }
  }
}
