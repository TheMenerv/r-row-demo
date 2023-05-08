import { Scene, ServiceContainer } from 'r-row';
import { loadAssets } from '../assets';
import { MenuScene } from './MenuScene';

export class LoadingScene implements Scene {
  private _isAssetsLoadingStarted: boolean;
  private _isAssetsLoaded: boolean;

  public load(data?: any): void {
    this._isAssetsLoadingStarted = false;
    this._isAssetsLoaded = false;
  }

  public unload(): void {}

  public update(dt: number): void {
    if (!this._isAssetsLoadingStarted) {
      this._isAssetsLoadingStarted = true;
      loadAssets().then(() => {
        this._isAssetsLoaded = true;
      });
    }

    if (this._isAssetsLoaded) {
      ServiceContainer.SceneManager.setScene(new MenuScene());
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const size = ServiceContainer.GameCanvas.baseSize;
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...   Please wait', size.x / 2, size.y / 2);
  }
}
