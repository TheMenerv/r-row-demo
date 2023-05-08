import config from '../../../config.json';
import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { GameScene } from '../../../GameScene';

export class OrcDeadState implements IState {
  public name = 'OrcDeadState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
    this.character.spriteSheet.setAnimation('die');
    GameScene.score++;
    this.character.timerBeforeRespawn = config.orc.timer.beforeRespawn;
  }

  public update(dt: number): void {
    this.character.timerBeforeRespawn -= dt;
    if (this.character.timerBeforeRespawn <= 0) {
      this.character.timerBeforeRespawn = 0;
      this.character.respawn();
    }
  }
}
