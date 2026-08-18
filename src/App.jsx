import { useState } from "react";
import ImposteurOnboarding from "./components/Setupscreen";
import GameScreen from "./components/GameScreen";
import VoteScreen from "./components/Votescreen";
import "./index.css";

function App() {
  // Config choisie dans le setup (joueurs, thème, imposteurs, etc.)
  const [gameConfig, setGameConfig] = useState(null);

  // Données de la manche en cours : ordre de passage tiré au sort
  // + rôles réels de chacun, calculés une seule fois par GameScreen
  // puis transmis tels quels au vote (jamais recalculés ailleurs)
  const [roundData, setRoundData] = useState(null);

  // Écran actif : "setup" | "game" | "vote"
  const [currentScreen, setCurrentScreen] = useState("setup");

  const handleStartGame = (config) => {
    setGameConfig(config);
    setCurrentScreen("game");
  };

  const handleGoToVote = (data) => {
    setRoundData(data);
    setCurrentScreen("vote");
  };

  const handleRestart = () => {
    setGameConfig(null);
    setRoundData(null);
    setCurrentScreen("setup");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-chewy text-[#F5F0E6]">
      {currentScreen === "setup" && (
        <ImposteurOnboarding onStart={handleStartGame} />
      )}

      {currentScreen === "game" && (
        <GameScreen config={gameConfig} onGoToVote={handleGoToVote} />
      )}

      {currentScreen === "vote" && (
        <VoteScreen roundData={roundData} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;