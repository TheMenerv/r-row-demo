/*
  This scene will load all assets and then switch to
  the scene with the name 'menu'.
  Because the assets are not loaded yet, the scene cannot
  use them. So it will draw a simple text to prevent
  the user from seeing a blank screen.
 */

import {
  Button,
  ClickableState,
  DrawTextOptions,
  Point,
  Rectangle,
  Scene,
  ServiceContainer,
  Sound,
  Sprite,
  drawText,
} from 'r-row';
import { GameScene } from './game/GameScene';

export class MenuScene implements Scene {
  private _background: Sprite;
  private _music: Sound;
  private _playButton: Button;
  private _panel: Rectangle;
  private _keyboardImage: Sprite;
  private _score?: number;

  /*
    This method is called when the scene is loaded.
    It will initialize all elements of the scene.
    We use a lot of functions to keep the code clean.
  */
  public load(data?: any): void {
    // on first launch, data is undefined
    // when the game is ended, data receives the score :
    // data = { score: number }
    this._score = data?.score;
    this._initMusicAndPlay();
    this._initBackground();
    this._initPlayButton();
    this._initPanel();
    this._initKeyboardImage();
  }

  /*
    This method is called when the scene is unloaded.
    It will clean up all elements of the scene
    to free up memory.
  */
  public unload(): void {}

  /*
    This method is called every frame.
    It will update all elements of the scene.
  */
  public update(dt: number): void {
    this._playButton.update(dt);
    if (this._playButton.isClicked) {
      this._music.stop();
      ServiceContainer.SceneManager.setScene(new GameScene());
    }
  }

  /*
    This method is called every frame.
    It will draw all elements of the scene.
    ctx is the canvas rendering context used to draw.
  */
  public draw(ctx: CanvasRenderingContext2D): void {
    this._background.draw(ctx);
    this._panel.draw(ctx);
    this._drawTitle(ctx);
    this._drawKeyboard(ctx);
    this._drawPlayButton(ctx);
  }

  /*
    The following methods are used to implement
    each necessary functionality to make the scene work.
    Refer to their names to understand what they do
    (clean code principle).
  */
  private _initMusicAndPlay() {
    this._music = new Sound('musicMenu', true);
    this._music.volume = 0.5;
    this._music.play();
  }

  private _initBackground() {
    this._background = new Sprite('menuBackground');
    const size = ServiceContainer.GameCanvas.baseSize;
    this._background.position = new Point(size.x / 2, size.y / 2);
  }

  private _initPlayButton() {
    const area = this._getButtonsArea();
    const sprites = this._getButtonSprites();
    this._playButton = new Button(area, { sprites });
  }

  private _initPanel() {
    const size = new Point(500, 300);
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const position = new Point(
      baseSize.x / 2 - size.x / 2,
      baseSize.y / 2 - size.y / 2
    );
    this._panel = new Rectangle(position, size, {
      strokeColor: 'black',
      fillColor: 'rgba(0, 0, 0, 0.7)',
      weight: 4,
      radius: 5,
    });
  }

  private _initKeyboardImage() {
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const position = new Point(baseSize.x / 2, 260);
    this._keyboardImage = new Sprite('keyboard');
    this._keyboardImage.position = position;
  }

  private _getButtonsArea(): Rectangle {
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const size = new Point(80, 40);
    const position = new Point(baseSize.x / 2 - size.x / 2, 312);
    return new Rectangle(position, size);
  }

  private _getButtonSprites(): Map<ClickableState, Sprite> {
    const sprites = new Map<ClickableState, Sprite>();
    sprites.set(ClickableState.Clicked, new Sprite('buttonClicked'));
    sprites.set(ClickableState.Disabled, new Sprite('buttonDisabled'));
    sprites.set(ClickableState.Hovered, new Sprite('buttonHovered'));
    sprites.set(ClickableState.Pressed, new Sprite('buttonPressed'));
    sprites.set(ClickableState.Released, new Sprite('buttonReleased'));
    return sprites;
  }

  private _drawTitle(ctx: CanvasRenderingContext2D) {
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const position = new Point(baseSize.x / 2, 180);
    const options: DrawTextOptions = {
      fontName: 'compassPro',
      fontSize: '3em',
      fillColor: 'white',
      align: 'center',
    };
    drawText(ctx, 'R-ROW Demo Project', position, options);
  }

  private _drawKeyboard(ctx: CanvasRenderingContext2D) {
    this._keyboardImage.draw(ctx);
    this._drawF3(ctx);
    this._drawF11(ctx);
    this._drawSpace(ctx);
    this._drawArrow(ctx);
    this._drawScore(ctx);
  }

  private _drawF3(ctx: CanvasRenderingContext2D) {
    const position = this._keyboardImage.position.add(new Point(-115, -30));
    const options: DrawTextOptions = {
      fontName: 'arial',
      fontSize: '0.7em',
      fillColor: 'blue',
    };
    drawText(ctx, 'F3 to Show FPS', position, options);
  }

  private _drawF11(ctx: CanvasRenderingContext2D) {
    const position = this._keyboardImage.position.add(new Point(29, -30));
    const options: DrawTextOptions = {
      fontName: 'arial',
      fontSize: '0.7em',
      fillColor: 'orange',
    };
    drawText(ctx, 'F11 to fullscreen', position, options);
  }

  private _drawSpace(ctx: CanvasRenderingContext2D) {
    const position = this._keyboardImage.position.add(new Point(-71, 37));
    const options: DrawTextOptions = {
      fontName: 'arial',
      fontSize: '0.7em',
      fillColor: 'green',
    };
    drawText(ctx, 'Space to attack', position, options);
  }

  private _drawArrow(ctx: CanvasRenderingContext2D) {
    const position = this._keyboardImage.position.add(new Point(45, 37));
    const options: DrawTextOptions = {
      fontName: 'arial',
      fontSize: '0.7em',
      fillColor: 'red',
    };
    drawText(ctx, 'Arrow to move', position, options);
  }
  private _drawScore(ctx: CanvasRenderingContext2D) {
    if (this._score === undefined) return;
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const options: DrawTextOptions = {
      fontName: 'compassPro',
      fontSize: '1.5em',
      fillColor: 'orange',
      align: 'center',
    };
    const position1 = new Point(baseSize.x / 2, 380);
    drawText(ctx, 'You have been defeated.', position1, options);
    const position2 = position1.add(new Point(0, 25));
    drawText(ctx, `Orcs to gave with you: ${this._score}`, position2, options);
  }

  private _drawPlayButton(ctx: CanvasRenderingContext2D) {
    this._playButton.draw(ctx);
    const baseSize = ServiceContainer.GameCanvas.baseSize;
    const options: DrawTextOptions = {
      fillColor: 'black',
      fontName: 'compassPro',
      fontSize: '2em',
      align: 'center',
    };
    drawText(ctx, 'Play', new Point(baseSize.x / 2, 340), options);
  }
}
