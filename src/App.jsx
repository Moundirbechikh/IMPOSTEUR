import { useState } from "react";
import ImposteurOnboarding from "./components/Setupscreen";
import GameScreen from "./components/GameScreen";
import "./index.css";

function App() {
  // null = on est dans le menu, sinon on stocke la configuration (joueurs, imposteurs, etc.)
  const [gameConfig, setGameConfig] = useState(null);

  return (
    // Le conteneur principal qui donne le fond noir et la police à TOUS les écrans
    <div className="relative h-screen w-full overflow-hidden bg-black font-chewy text-[#F5F0E6]">
      {!gameConfig ? (
        <ImposteurOnboarding onStart={setGameConfig} />
      ) : (
        <GameScreen config={gameConfig} onRestart={() => setGameConfig(null)} />
      )}
    </div>
  );
}

export default App;