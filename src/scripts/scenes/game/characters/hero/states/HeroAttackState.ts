import config from '../../../config.json';
import { GameScene } from '../../../GameScene';
import { Character } from '../../Character';
import { IState } from '../../IStates';
import { Orc } from '../../orc/Orc';
import { OrcHitState } from '../../orc/states/OrcHitState';
import { HeroIdleState } from './HeroIdleState';

export class HeroAttackState implements IState {
  public name = 'HeroAttackState';
  public character: Character;
  public orcs: Character[];

  constructor(character: Character) {
    this.character = character;
    const animationName = `attack_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
    this.orcs = GameScene.characters.filter((c) => c !== this.character);
    this.character.attackSound.play();
  }

  public update(dt: number): void {
    if (this.character.spriteSheet.isAnimationEnded) {
      this.character.state = new HeroIdleState(this.character);
      return;
    }

    if (this.character.spriteSheet.currentAnimationFrame !== 2) return;

    this.orcs.forEach((orc) => {
      if (
        orc.position.getDistanceWithPoint(this.character.position) <
          config.hero.attackRange &&
        orc.state.name !== 'OrcHitState' &&
        orc.state.name !== 'OrcDeadState'
      ) {
        orc.health -= config.hero.damage;
        orc.state = new OrcHitState(orc as Orc);
      }
    });
  }
}
