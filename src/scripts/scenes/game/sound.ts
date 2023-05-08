import { Sound } from 'r-row';

export function initSound(): Sound {
  const sound = new Sound('musicGame');
  sound.volume = 0.5;
  sound.loop = true;
  sound.play();
  return sound;
}
