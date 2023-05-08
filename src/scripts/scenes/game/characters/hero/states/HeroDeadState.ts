import { ServiceContainer } from 'r-row';
import { Character } from '../../Character';
import { IState } from '../../IStates';
import { GameScene } from '../../../GameScene';
import { MenuScene } from '../../../../MenuScene';

export class HeroDeadState implements IState {
  public name = 'HeroDeadState';
  public character: Character;

  constructor(character: Character) {
    this.character = character;
    this.character.spriteSheet.setAnimation('die');
  }

  public update(dt: number): void {
    if (this.character.spriteSheet.isAnimationEnded) {
      ServiceContainer.SceneManager.setScene(new MenuScene(), {
        score: GameScene.score,
      });
    }
  }
}
