// Fonts
import tinyNostalgia from '../fonts/tiny-nostalgia.ttf';
import compassPro from '../fonts/CompassPro.ttf';

// Images
import buttonClicked from '../images/button_clicked.png';
import buttonDisabled from '../images/button_disabled.png';
import buttonHovered from '../images/button_hovered.png';
import buttonPressed from '../images/button_pressed.png';
import buttonReleased from '../images/button_released.png';
import cliff from '../images/cliff.png';
import cursor from '../images/cursor.png';
import floor from '../images/floor.png';
import hero from '../images/hero.png';
import orc from '../images/orc.png';
import props from '../images/props.png';
import torch from '../images/torch.png';
import torchLight from '../images/torch_light.png';
import wall from '../images/wall.png';
import keyboard from '../images/keyboard.png';
import menuBackground from '../images/menu_background.jpg';

// Sounds
import death from '../sounds/death.wav';
import fall from '../sounds/fall.wav';
import gameOver from '../sounds/game_over.wav';
import gameStart from '../sounds/game_start.wav';
import hurt from '../sounds/hurt.wav';
import musicGame from '../sounds/music_game.mp3';
import musicMenu from '../sounds/music_menu.mp3';
import punch from '../sounds/punch.wav';
import { AssetStore, ServiceContainer } from 'r-row';

function addFonts(store: AssetStore) {
  store.addFont('tinyNostalgia', tinyNostalgia);
  store.addFont('compassPro', compassPro);
}

function addImages(store: AssetStore) {
  store.addImage('buttonClicked', buttonClicked);
  store.addImage('buttonDisabled', buttonDisabled);
  store.addImage('buttonHovered', buttonHovered);
  store.addImage('buttonPressed', buttonPressed);
  store.addImage('buttonReleased', buttonReleased);
  store.addImage('cliff', cliff);
  store.addImage('cursor', cursor);
  store.addImage('floor', floor);
  store.addImage('hero', hero);
  store.addImage('orc', orc);
  store.addImage('props', props);
  store.addImage('torch', torch);
  store.addImage('torchLight', torchLight);
  store.addImage('wall', wall);
  store.addImage('keyboard', keyboard);
  store.addImage('menuBackground', menuBackground);
}

function addSounds(store: AssetStore) {
  store.addSound('death', death);
  store.addSound('fall', fall);
  store.addSound('gameOver', gameOver);
  store.addSound('gameStart', gameStart);
  store.addSound('hurt', hurt);
  store.addSound('musicGame', musicGame);
  store.addSound('musicMenu', musicMenu);
  store.addSound('punch', punch);
}

export async function loadAssets() {
  const store = ServiceContainer.AssetStore;
  addFonts(store);
  addImages(store);
  addSounds(store);
  await store.loadAllAssets();
}
