import { useState } from "react";
import SaveMenu from "./components/SaveMenu";

const SAVED_KEY = "nfc-ut:saved";

// localStorage can throw in private mode or when storage is blocked.
const readSaved = () => {
  try {
    return localStorage.getItem(SAVED_KEY) === "true";
  } catch {
    return false;
  }
};

const App = () => {
  const [saved, setSaved] = useState(readSaved);

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
      <SaveMenu
        name={saved ? "Volare" : "EMPTY"}
        lv={saved ? 1 : 0}
        time="2026-11-01"
        location={saved ? "Kaoshung, Taiwan" : "--"}
        onSave={handleSave}
        onReturn={() => console.log("return")}
      />
    </main>
  );
};

export default App;
