import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { OrcChaseState } from './OrcChaseState';
import { OrcWalkState } from './OrcWalkState';

export class OrcIdleState implements IState {
  public name = 'OrcIdleState';
  public character: Orc;

  constructor(character: Orc) {
    this.character = character;
    const animationName = `idle_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
  }

  public update(dt: number): void {
    if (this.character.isInChaseRange() && !this.character.isInAttackRange()) {
      this.character.state = new OrcChaseState(this.character);
      return;
    }

    if (this.character.isRandomOnThousand(10)) {
      this.character.state = new OrcWalkState(this.character);
    }
  }
}
