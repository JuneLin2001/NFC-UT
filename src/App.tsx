import { useEffect, useState } from "react";
import DialogBox from "./components/DialogBox";
import SaveMenu from "./components/SaveMenu";
import SavePoint from "./components/SavePoint";
import { preload, textSound } from "./utils/sound";

type Stage = "start" | "dialog" | "menu";

const SAVED_KEY = "nfc-ut:saved";

const beforeText =
  "(Finally hearing the music of your favorite game performed live...)";
const afterText =
  "(Knowing the memories of tonight will always stay with you...)";

// 2026-11-01 20:00 in Taiwan, regardless of the viewer's timezone.
const SWITCH_TIME = new Date("2026-11-01T20:00:00+08:00").getTime();

const getDialogPages = () => [
  Date.now() >= SWITCH_TIME ? afterText : beforeText,
  "(It fills you with determination.)",
];

const App = () => {
  const [saved, setSaved] = useState(false);
  const [stage, setStage] = useState<Stage>("start");

  // Load the typing sound while the save point is on screen.
  useEffect(() => {
    void preload(textSound);
  }, []);

  const handleSave = () => {
    setSaved(true);
    try {
      localStorage.setItem(SAVED_KEY, "true");
    } catch {
      // Still show the saved state for this visit.
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-black px-4">
      {stage === "start" && <SavePoint onActivate={() => setStage("dialog")} />}
      {stage === "dialog" && (
        <DialogBox pages={getDialogPages()} onDone={() => setStage("menu")} />
      )}
      {stage === "menu" && (
        <SaveMenu
          name={saved ? "Frisk" : "EMPTY"}
          lv={saved ? 1 : 0}
          time="2026-11-01"
          location={saved ? "Kaohsiung, Taiwan" : "--"}
          onSave={handleSave}
          onReturn={() => setStage("start")}
        />
      )}
    </main>
  );
};

export default App;
