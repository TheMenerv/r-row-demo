import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { OrcWalkState } from './OrcWalkState';

export class OrcTurnState implements IState {
  public name = 'OrcTurnState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
  }

  public update(dt: number): void {
    this._setRandomDirection();
    this.character.state = new OrcWalkState(this.character);
  }

  private _setRandomDirection(): void {
    const rand = Math.round(Math.random() * 7);
    switch (rand) {
      case 0:
        this.character.hDirection = null;
        this.character.vDirection = 'up';
        this.character.animationVDirection = 'up';
        break;
      case 1:
        this.character.hDirection = 'right';
        this.character.vDirection = 'up';
        this.character.animationHDirection = 'right';
        this.character.animationVDirection = 'up';
        break;
      case 2:
        this.character.hDirection = 'right';
        this.character.vDirection = null;
        this.character.animationHDirection = 'right';
        break;
      case 3:
        this.character.hDirection = 'right';
        this.character.vDirection = 'down';
        this.character.animationHDirection = 'right';
        this.character.animationVDirection = 'down';
        break;
      case 4:
        this.character.hDirection = null;
        this.character.vDirection = 'down';
        this.character.animationVDirection = 'down';
        break;
      case 5:
        this.character.hDirection = 'left';
        this.character.vDirection = 'down';
        this.character.animationHDirection = 'left';
        this.character.animationVDirection = 'down';
        break;
      case 6:
        this.character.hDirection = 'left';
        this.character.vDirection = null;
        this.character.animationHDirection = 'left';
        break;
      case 7:
        this.character.hDirection = 'left';
        this.character.vDirection = 'up';
        this.character.animationHDirection = 'left';
        this.character.animationVDirection = 'up';
        break;
    }
  }
}
