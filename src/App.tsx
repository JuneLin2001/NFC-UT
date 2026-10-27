import SaveMenu from "./components/SaveMenu";

const App = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-black px-4">
      <SaveMenu
        name="Volare"
        lv={1}
        time="11-01"
        location="Kaoshung, Taiwan"
        onSave={() => console.log("save")}
        onReturn={() => console.log("return")}
      />
    </main>
  );
};

export default App;
