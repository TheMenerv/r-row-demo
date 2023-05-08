import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { OrcDeadState } from './OrcDeadState';
import { OrcIdleState } from './OrcIdleState';

export class OrcHitState implements IState {
  public name = 'OrcHitState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
    const animationName = `hit_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
  }

  public update(dt: number): void {
    if (this.character.health <= 0) {
      this.character.health = 0;
      this.character.state = new OrcDeadState(this.character);
    }
    if (this.character.spriteSheet.isAnimationEnded) {
      this.character.state = new OrcIdleState(this.character);
    }
  }
}
