import '../styles/main.css';
import { Game, Point, ServiceContainer } from 'r-row';
import { LoadingScene } from './scenes/LoadingScene';

// Function to toggle fullscreen mode
// when the user presses F11
function toggleFullscreenHandler(deltaTime: number) {
  if (!ServiceContainer.Keyboard.isJustDown('F11')) return;
  ServiceContainer.GameCanvas.toggleFullscreen();
}

let displayFPS = false;

// Function to toggle the display of the FPS
// when the user presses F3;
function toggleFPSHandler(deltaTime: number) {
  if (!ServiceContainer.Keyboard.isJustDown('F3')) return;
  displayFPS = !displayFPS;
}

// Function to draw the FPS
function drawFPS(ctx: CanvasRenderingContext2D) {
  if (!displayFPS) return;
  const fps = ServiceContainer.GameLoop.FPS;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.textAlign = 'left';
  ctx.font = '10px Arial';
  ctx.strokeText(`FPS: ${fps}`, 3, 11);
  ctx.fillText(`FPS: ${fps}`, 2, 10);
}

// Create a new game and start it
// The game will start the scene with the name 'loading'
// This scene will load all assets and then switch to
// the scene with the name 'menu'
new Game()
  .createCanvas({ size: new Point(720, 560) })
  .startScene(new LoadingScene())
  .start();

// Set the freeze limit to 0.1 seconds
// This means that if the game freezes for more than 0.1 seconds
// the game will automatically pause itself
ServiceContainer.GameLoop.setFreezeLimit(0.1);

// Subscribe to the update event to toggle
// fullscreen mode when the user presses F11
ServiceContainer.GameLoop.subscribeToUpdate(toggleFullscreenHandler);

// Subscribe to the update event to toggle
// the display of the FPS when the user presses F3
ServiceContainer.GameLoop.subscribeToUpdate(toggleFPSHandler);

// Subscribe to the post render event to draw the FPS
// to the top layer of the canvas
ServiceContainer.GameLoop.subscribeToPostRender(drawFPS);
