import { useEffect, useState } from "react";
import { play, preload, textSound } from "../utils/sound";

interface DialogBoxProps {
  pages: string[];
  onDone?: () => void;
}

const CHAR_DELAY_MS = 40;

const DialogBox = ({ pages, onDone }: DialogBoxProps) => {
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const text = pages[page];
  const typing = count < text.length;

  // Start typing only once the blip sound is loaded.
  useEffect(() => {
    let active = true;
    preload(textSound).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !typing) return;
    const timer = setTimeout(() => {
      if (text[count].trim()) play(textSound);
      setCount((c) => c + 1);
    }, CHAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, count, typing, text]);

  // While typing, skip to the full page; once finished, go to the next page or move on.
  const advance = () => {
    if (!ready) return;
    if (typing) {
      setCount(text.length);
    } else if (page < pages.length - 1) {
      setPage(page + 1);
      setCount(0);
    } else {
      onDone?.();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // A focused button already turns Enter into a click.
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return;
      if (e.key === "Enter" || e.key === "z" || e.key === "Z") advance();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <button
      type="button"
      onClick={advance}
      className="grid w-full max-w-2xl cursor-pointer text-left touch-manipulation border-4 border-white bg-black p-4 font-ut text-xl leading-snug text-white select-none sm:border-6 sm:px-8 sm:py-6 sm:text-3xl md:text-4xl"
    >
      {/* Stack every page in one cell so the box keeps the tallest page's height. */}
      {pages.map((line, i) => {
        const shown = i === page ? count : 0;
        return (
          <p
            key={i}
            className={`col-start-1 row-start-1 flex gap-3 ${i === page ? "" : "invisible"}`}
          >
            <span>*</span>
            {/* Keep untyped text in the layout so words don't jump lines. */}
            <span>
              {line.slice(0, shown)}
              <span className="invisible">{line.slice(shown)}</span>
            </span>
          </p>
        );
      })}
    </button>
  );
};

export default DialogBox;
