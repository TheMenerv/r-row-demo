import { ServiceContainer } from 'r-row';
import { Character } from '../../Character';
import { IState } from '../../IStates';
import { HeroAttackState } from './HeroAttackState';
import { HeroWalkState } from './HeroWalkState';

export class HeroIdleState implements IState {
  public name = 'HeroIdleState';
  public character: Character;

  constructor(character: Character) {
    this.character = character;
    const animationName = `idle_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
  }

  public update(dt: number): void {
    const KB = ServiceContainer.Keyboard;
    const isAttackStarted = KB.isJustDown('Space');
    const isMoveStarted =
      KB.isDown('ArrowUp') ||
      KB.isDown('ArrowDown') ||
      KB.isDown('ArrowLeft') ||
      KB.isDown('ArrowRight');

    if (isAttackStarted) {
      this.character.state = new HeroAttackState(this.character);
      return;
    }

    if (isMoveStarted) {
      this.character.state = new HeroWalkState(this.character);
      return;
    }
  }
}
