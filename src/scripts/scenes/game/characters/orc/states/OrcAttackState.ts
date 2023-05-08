import config from '../../../config.json';
import { Orc } from '../../orc/Orc';
import { IState } from '../../IStates';
import { OrcIdleState } from './OrcIdleState';
import { HeroHitState } from '../../hero/states/HeroHitState';
import { Hero } from '../../hero/Hero';

export class OrcAttackState implements IState {
  public name = 'OrcAttackState';
  public character: Orc;

  constructor(orc: Orc) {
    this.character = orc;
    this.character.setFaceToTheHero();
    const animationName = `attack_${this.character.animationHDirection}_${this.character.animationVDirection}`;
    this.character.spriteSheet.setAnimation(animationName);
    this.character.attackSound.play();
  }

  public update(dt: number): void {
    const hero = Hero.player;

    if (this.character.spriteSheet.isAnimationEnded) {
      this.character.timerBeforeReAttack = config.orc.timer.beforeNextAttack;
      this.character.state = new OrcIdleState(this.character);
      return;
    }

    if (
      this.character.spriteSheet.currentAnimationFrame === 2 &&
      this.character.isInAttackRange() &&
      this.character.isTouched(this.character, hero) &&
      hero.state.name !== 'HeroHitState' &&
      hero.state.name !== 'HeroDeadState'
    ) {
      hero.health -= config.orc.damage;
      hero.state = new HeroHitState(hero);
      return;
    }
  }
}
