import saveOgg from "../assets/sounds/save.ogg";
import saveWav from "../assets/sounds/save.wav";
import textMp3 from "../assets/sounds/snd_txt1.mp3";
import selectMp3 from "../assets/sounds/ut_menu_select.mp3";

const audio = new Audio();

// Older iOS Safari can't play Ogg, so fall back to the WAV there.
export const saveSound = new Audio(
  audio.canPlayType("audio/ogg; codecs=vorbis") ? saveOgg : saveWav,
);
export const selectSound = new Audio(selectMp3);
export const textSound = new Audio(textMp3);

// Restart from the beginning so rapid triggers each play; ignore autoplay blocks.
export const play = (sound: HTMLAudioElement) => {
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

const loading = new WeakMap<HTMLAudioElement, Promise<void>>();

// Download the file and play it from memory. Fetch is used because iOS Safari
// won't fire canplaythrough before a user gesture. Resolves even on failure,
// so callers never wait forever.
const load = async (sound: HTMLAudioElement) => {
  try {
    const res = await fetch(sound.src);
    if (!res.ok) throw new Error(`Failed to load ${sound.src}: ${res.status}`);
    sound.src = URL.createObjectURL(await res.blob());
  } catch (error) {
    // Keep the original src so the sound can still stream if fetch failed.
    console.warn(error);
  }
};

export const preload = (sound: HTMLAudioElement) => {
  let promise = loading.get(sound);
  if (!promise) {
    promise = load(sound);
    loading.set(sound, promise);
  }
  return promise;
};
