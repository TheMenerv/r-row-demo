import { Character } from './Character';

export interface IState {
  character: Character;
  name: string;

  update(dt: number): void;
}
