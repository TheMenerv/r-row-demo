import {
  Point,
  Rectangle,
  SpriteSheet,
  SpriteSheetAnimation,
  TileSet,
} from 'r-row';
import mapData from '../../../../map/map.json';
import torchAnimation from './torchAnimation.json';
import torchLightAnimation from './torchLightAnimation.json';
import { dataTiles } from './tiles';

export class GameMap {
  private static _instance: GameMap;
  private _tilesMap: { cliff_wall: number[]; decor: number[] };
  private _collideMap: Record<number, Record<number, boolean>>;
  private _cliff: TileSet;
  private _floor: TileSet;
  private _props: TileSet;
  private _wall: TileSet;
  private _torches: SpriteSheet[];
  private _torchLights: SpriteSheet[];

  private constructor() {
    this._tilesMap = {
      cliff_wall: [],
      decor: [],
    };
    this._collideMap = [];
    const tileSize = new Point(8, 8);
    this._cliff = new TileSet('cliff', tileSize);
    this._floor = new TileSet('floor', tileSize);
    this._props = new TileSet('props', tileSize);
    this._wall = new TileSet('wall', tileSize);
    this._torches = [];
    this._torchLights = [];
    this._initVisibleMap();
    this._initCollideMap();
  }

  public static get instance(): GameMap {
    if (!GameMap._instance) {
      GameMap._instance = new GameMap();
    }
    return GameMap._instance;
  }

  public isWalkable(area: Rectangle): boolean {
    const topLeft = this.getCoordinatesBlockFromRealPosition(area.topLeft);
    const topRight = this.getCoordinatesBlockFromRealPosition(area.topRight);
    const bottomLeft = this.getCoordinatesBlockFromRealPosition(
      area.bottomLeft
    );
    const bottomRight = this.getCoordinatesBlockFromRealPosition(
      area.bottomRight
    );
    const topLeftCollide = this._collideMap[topLeft.y][topLeft.x];
    const topRightCollide = this._collideMap[topRight.y][topRight.x];
    const bottomLeftCollide = this._collideMap[bottomLeft.y][bottomLeft.x];
    const bottomRightCollide = this._collideMap[bottomRight.y][bottomRight.x];
    return (
      !topLeftCollide &&
      !topRightCollide &&
      !bottomLeftCollide &&
      !bottomRightCollide
    );
  }

  public getCoordinatesBlockFromRealPosition(position: Point): Point {
    const tileSize = new Point(mapData.tilewidth, mapData.tileheight);
    const x = Math.floor(position.x / tileSize.x);
    const y = Math.floor(position.y / tileSize.y);
    return new Point(x, y);
  }

  public getTileBlockPositionFromItsId(id: number): Point {
    const lineMax = mapData.width;
    const line = Math.floor(id / lineMax);
    const column = id - lineMax * line;
    return new Point(column, line);
  }

  public getTileRealPositionFromItsId(
    id: number,
    verticallyCentered: boolean = false,
    horizontallyCentered: boolean = false
  ): Point {
    const blockPosition = this.getTileBlockPositionFromItsId(id);
    const tileSize = new Point(mapData.tilewidth, mapData.tileheight);
    const x = horizontallyCentered
      ? (blockPosition.x + 1.5) * tileSize.x
      : (blockPosition.x + 1) * tileSize.x;
    const y = verticallyCentered
      ? (blockPosition.y + 1.5) * tileSize.y
      : (blockPosition.y + 1) * tileSize.y;
    return new Point(x, y);
  }

  public update(dt: number): void {
    this._torches.forEach((torch) => {
      torch.update(dt);
    });
    this._torchLights.forEach((torchLight) => {
      torchLight.update(dt);
    });
  }

  public drawGround(ctx: CanvasRenderingContext2D): void {
    this._drawMap(ctx, 'cliff');
    this._drawMap(ctx, 'floor');
  }

  public drawWall(ctx: CanvasRenderingContext2D): void {
    this._drawMap(ctx, 'wall');
    this._drawMap(ctx, 'props');
    this._torchLights.forEach((torchLight) => {
      torchLight.draw(ctx);
    });
    this._torches.forEach((torch) => {
      torch.draw(ctx);
    });
  }

  private _initVisibleMap(): void {
    mapData.layers[0].data.forEach((tile) => {
      this._tilesMap.cliff_wall.push(tile);
    });
    mapData.layers[1].data.forEach((tile, index) => {
      this._tilesMap.decor.push(tile);
      if (tile === 626) this._torchReplace(index);
    });
  }

  private _torchReplace(index: number): void {
    const torch = this._createTorch(index);
    this._createTorchLight(index, torch.currentAnimationFrame);
  }

  private _createTorch(index: number): SpriteSheet {
    const torchAnimationSize = new Point(
      torchAnimation.frame.width,
      torchAnimation.frame.height
    );
    const torch = new SpriteSheet('torch', torchAnimationSize);
    torch.position = this.getTileRealPositionFromItsId(index);
    const animation = new SpriteSheetAnimation(
      torchAnimation.animations.run.frames,
      torchAnimation.animations.run.speed,
      torchAnimation.animations.run.loop
    );
    torch.addAnimation('run', animation);
    torch.setAnimation('run');
    torch.currentAnimation.currentFrame = Math.round(
      Math.random() * (torch.currentAnimation.frames.length - 1)
    );
    this._torches.push(torch);
    return torch;
  }

  private _createTorchLight(
    index: number,
    currentAnimationFrame: number
  ): void {
    const torchLightAnimationSize = new Point(
      torchLightAnimation.frame.width,
      torchLightAnimation.frame.height
    );
    const torchLight = new SpriteSheet('torchLight', torchLightAnimationSize);
    torchLight.position = this.getTileRealPositionFromItsId(index, true);
    const animation = new SpriteSheetAnimation(
      torchLightAnimation.animations.run.frames,
      torchLightAnimation.animations.run.speed,
      torchLightAnimation.animations.run.loop
    );
    torchLight.addAnimation('run', animation);
    torchLight.setAnimation('run');
    torchLight.currentAnimation.currentFrame = currentAnimationFrame;
    this._torchLights.push(torchLight);
  }

  private _initCollideMap(): void {
    mapData.layers[2].data.forEach((tile, index) => {
      const position = this.getTileBlockPositionFromItsId(index);
      if (!this._collideMap[position.y]) this._collideMap[position.y] = [];
      this._collideMap[position.y][position.x] = tile === 675;
    });
  }

  private _drawMap(
    ctx: CanvasRenderingContext2D,
    type: 'cliff' | 'floor' | 'props' | 'wall'
  ): void {
    const layer = type === 'props' ? 1 : 0;
    const mapSize = new Point(
      mapData.layers[layer].width,
      mapData.layers[layer].height
    );

    let index = -1;
    for (let line = 0; line < mapSize.y; line++) {
      for (let column = 0; column < mapSize.x; column++) {
        index++;
        const id = mapData.layers[layer].data[index];
        const tileType = dataTiles[id].type;
        if (tileType !== type) continue;
        const tileId = dataTiles[id].ID;
        const tileSize = new Point(mapData.tilewidth, mapData.tileheight);
        let tileset: TileSet;
        switch (tileType) {
          case 'cliff':
            tileset = this._cliff;
            break;
          case 'floor':
            tileset = this._floor;
            break;
          case 'props':
            tileset = this._props;
            break;
          case 'wall':
            tileset = this._wall;
            break;
        }
        const position = new Point(column * tileSize.x, line * tileSize.y);
        tileset.drawTile(ctx, tileId, position, true);
      }
    }
  }
}
