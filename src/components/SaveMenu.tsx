import { useEffect, useState } from "react";
import Heart from "./Heart";
import { play, saveSound, selectSound } from "../utils/sound";

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

const SaveMenu = ({
  name,
  lv,
  time,
  location,
  onSave,
  onReturn,
}: SaveMenuProps) => {
  const [selected, setSelected] = useState<Option>("save");
  // Right after saving, the file shows in yellow with "File saved." until dismissed.
  const [justSaved, setJustSaved] = useState(false);

  const select = (option: Option) => {
    if (option === selected) return;
    play(selectSound);
    setSelected(option);
  };

  const confirm = (option: Option) => {
    if (option === "save") {
      play(saveSound);
      setJustSaved(true);
      onSave?.();
    } else onReturn?.();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // A focused button already turns Enter into a click.
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return;
      const isConfirm = e.key === "Enter" || e.key === "z" || e.key === "Z";
      if (justSaved) {
        if (isConfirm) setJustSaved(false);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        select(selected === "save" ? "return" : "save");
      } else if (isConfirm) {
        confirm(selected);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const frameClass =
    "w-full max-w-2xl border-4 border-white bg-black p-4 text-left font-ut text-xl leading-none select-none sm:border-6 sm:px-8 sm:py-6 sm:text-3xl md:text-4xl";

  // Spans keep the markup valid inside the button frame below.
  const details = (
    <>
      <span className="grid grid-cols-12 whitespace-nowrap">
        <span className="col-span-4">{name}</span>
        <span className="col-span-3">LV {lv}</span>
        <span className="col-span-5 text-right">{time}</span>
      </span>
      <span className="mt-3 block sm:mt-5 md:mt-6">{location}</span>
    </>
  );

  // After saving, the whole frame is one button that dismisses "File saved.".
  if (justSaved) {
    return (
      <button
        type="button"
        onClick={() => setJustSaved(false)}
        className={`${frameClass} cursor-pointer touch-manipulation text-ut-yellow outline-none`}
      >
        {details}
        <span className="mt-4 flex min-h-11 items-center sm:mt-8 md:mt-10">
          {/* Same indent as the options, where the heart sits. */}
          <span className="mr-2 inline-flex size-4 sm:size-6 md:size-7" />
          File saved.
        </span>
      </button>
    );
  }

  return (
    <div className={`${frameClass} text-white`}>
      {details}
      <div className="mt-4 grid grid-cols-2 sm:mt-8 md:mt-10">
        {OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            // Taps also fire enter and focus events; only follow a real mouse
            // and keyboard focus, so a tap on the other option just moves the heart.
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") select(id);
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) select(id);
            }}
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
