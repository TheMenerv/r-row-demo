import config from './config.json';
import {
  DrawTextOptions,
  Point,
  Rectangle,
  RectangleOptions,
  Scene,
  Sound,
  drawText,
} from 'r-row';
import { initSound } from './sound';
import { Character } from './characters/Character';
import { Hero } from './characters/hero/Hero';
import { GameMap } from './map/GameMap';
import { Orc } from './characters/orc/Orc';

export class GameScene implements Scene {
  public static score: number;
  public static characters: Character[] = [];
  private _music: Sound;
  private _map: GameMap;

  public load(data?: any): void {
    GameScene.score = 0;
    this._music = initSound();
    const hero = Hero.player;
    this._map = GameMap.instance;
    GameScene.characters.push(hero);
    this._addOrcs();
  }

  public unload(): void {
    this._music.stop();
    const hero = Hero.player;
    hero.destroy();
    GameScene.characters = [];
  }

  public update(dt: number): void {
    this._map.update(dt);
    GameScene.characters.forEach((character) => {
      character.update(dt);
    });
    GameScene.characters.sort((a, b) => {
      return a.position.y - b.position.y;
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.scale(config.gameScale, config.gameScale);
    this._map.drawGround(ctx);
    GameScene.characters.forEach((character) => {
      character.draw(ctx);
    });
    this._map.drawWall(ctx);
    GameScene.characters.forEach((character) => {
      this._drawLife(ctx, character);
    });
    ctx.restore();
  }

  private _addOrcs(): void {
    for (let i = 0; i < 10; i++) {
      const position = new Point(40, 50);
      const orc = new Orc(position);
      GameScene.characters.push(orc);
    }
    for (let i = 0; i < 5; i++) {
      const position = new Point(35, 135);
      const orc = new Orc(position);
      GameScene.characters.push(orc);
    }
    for (let i = 0; i < 10; i++) {
      const position = new Point(200, 60);
      const orc = new Orc(position);
      GameScene.characters.push(orc);
    }
  }

  private _drawLife(ctx: CanvasRenderingContext2D, character: Character): void {
    if (
      character.state.name === 'OrcDeadState' &&
      character.spriteSheet.isAnimationEnded
    )
      return;
    const position = character.position.subtract(new Point(3.5, 5.5));
    const options: RectangleOptions = {
      fillColor: 'rgba(0, 0, 0, 0.6)',
      radius: 1,
    };
    const background = new Rectangle(
      position.subtract(new Point(0.7, 4)),
      new Point(8, 4),
      options
    );
    background.draw(ctx);
    const health = character.health;
    let color = '#00ff00';
    if (health <= character.maxHealth / 5) color = '#ff0000';
    else if (health <= character.maxHealth / 2.5) color = '#ffa500';
    else if (health <= character.maxHealth / 1.5) color = '#ffff00';
    const textOptions: DrawTextOptions = {
      fillColor: color,
      align: 'center',
      fontName: 'tinyNostalgia',
      fontSize: '0.3em',
    };
    drawText(
      ctx,
      health.toString(),
      character.position.subtract(new Point(0, 6.5)),
      textOptions
    );
  }
}
