import { useEffect } from "react";
import savePointGif from "../assets/images/undertale-save.gif";

interface SavePointProps {
  onActivate: () => void;
}

// The first tap or key press also lets the browser play sound.
const SavePoint = ({ onActivate }: SavePointProps) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // A focused button already turns Enter into a click.
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return;
      if (e.key === "Enter" || e.key === "z" || e.key === "Z") onActivate();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <button
      type="button"
      aria-label="Save point"
      onClick={onActivate}
      className="cursor-pointer touch-manipulation select-none"
    >
      <img
        src={savePointGif}
        alt=""
        draggable={false}
        className="pixelated size-32 sm:size-40"
      />
    </button>
  );
};

export default SavePoint;
