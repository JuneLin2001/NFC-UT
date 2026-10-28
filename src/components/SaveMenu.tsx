import { useEffect, useState } from "react";
import Heart from "./Heart";

type Option = "save" | "return";

interface SaveMenuProps {
  name: string;
  lv: number;
  time: string;
  location: string;
  onSave?: () => void;
  onReturn?: () => void;
}

const OPTIONS: { id: Option; label: string }[] = [
  { id: "save", label: "Save" },
  { id: "return", label: "Return" },
];

// Older iOS Safari can't play Ogg, so fall back to the WAV there.
const saveSound = new Audio();
saveSound.src = `${import.meta.env.BASE_URL}${saveSound.canPlayType("audio/ogg; codecs=vorbis") ? "save.ogg" : "save.wav"}`;

const selectSound = new Audio(`${import.meta.env.BASE_URL}ut_menu_select.mp3`);

// Restart from the beginning so rapid triggers each play; ignore autoplay blocks.
const play = (sound: HTMLAudioElement) => {
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

const SaveMenu = ({
  name,
  lv,
  time,
  location,
  onSave,
  onReturn,
}: SaveMenuProps) => {
  const [selected, setSelected] = useState<Option>("save");

  const select = (option: Option) => {
    if (option === selected) return;
    play(selectSound);
    setSelected(option);
  };

  const confirm = (option: Option) => {
    if (option === "save") {
      play(saveSound);
      onSave?.();
    } else onReturn?.();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        select(selected === "save" ? "return" : "save");
      } else if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
        confirm(selected);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="w-full max-w-2xl border-4 border-white bg-black p-4 font-ut text-xl leading-none text-white select-none sm:border-6 sm:px-8 sm:py-6 sm:text-3xl md:text-4xl">
      <div className="grid grid-cols-12 whitespace-nowrap">
        <span className="col-span-4">{name}</span>
        <span className="col-span-3">LV {lv}</span>
        <span className="col-span-5 text-right">{time}</span>
      </div>
      <div className="mt-3 sm:mt-5 md:mt-6">{location}</div>
      <div className="mt-4 grid grid-cols-2 sm:mt-8 md:mt-10">
        {OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onMouseEnter={() => select(id)}
            // First tap moves the heart, a tap on the selected option confirms it.
            onClick={() => (id === selected ? confirm(id) : select(id))}
            className="flex min-h-11 cursor-pointer touch-manipulation items-center text-left outline-none"
          >
            <span className="mr-2 inline-flex size-4 items-center sm:size-6 md:size-7">
              {selected === id && <Heart className="size-full" />}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SaveMenu;
