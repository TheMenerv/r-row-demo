import { IState } from '../../IStates';
import { Orc } from '../Orc';
import { OrcChaseState } from './OrcChaseState';
import { OrcIdleState } from './OrcIdleState';
import { OrcTurnState } from './OrcTurnState';

export class OrcWalkState implements IState {
  public name = 'OrcWalkState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
    const animationName = `walk_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
  }

  public update(dt: number): void {
    if (this.character.isInChaseRange()) {
      this.character.state = new OrcChaseState(this.character);
      return;
    }

    if (this.character.isRandomOnThousand(5)) {
      this.character.state = new OrcTurnState(this.character);
      return;
    }

    if (this.character.isRandomOnThousand(5)) {
      this.character.state = new OrcIdleState(this.character);
      return;
    }

    if (this.character.moveAndReturnIsBlocked(dt)) {
      this.character.state = new OrcTurnState(this.character);
      return;
    }
  }
}
