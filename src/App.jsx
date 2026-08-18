import { useState } from "react";
import ImposteurOnboarding from "./components/Setupscreen";
import GameScreen from "./components/GameScreen";
import VoteScreen from "./components/Votescreen";
import "./index.css";

function App() {
  // Stocke la configuration de la partie (joueurs, thème, imposteurs, etc.)
  const [gameConfig, setGameConfig] = useState(null);
  
  // Gère l'écran actif : "setup" | "game" | "vote"
  const [currentScreen, setCurrentScreen] = useState("setup");

  // Démarrage de la partie depuis le setup
  const handleStartGame = (config) => {
    setGameConfig(config);
    setCurrentScreen("game");
  };

  // Passage du jeu au vote
  const handleGoToVote = () => {
    setCurrentScreen("vote");
  };

  // Réinitialisation complète pour retour au menu
  const handleRestart = () => {
    setGameConfig(null);
    setCurrentScreen("setup");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-chewy text-[#F5F0E6]">
      {currentScreen === "setup" && (
        <ImposteurOnboarding onStart={handleStartGame} />
      )}

      {currentScreen === "game" && (
        <GameScreen 
          config={gameConfig} 
          onGoToVote={handleGoToVote} 
        />
      )}

      {currentScreen === "vote" && (
        <VoteScreen 
          config={gameConfig} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

export default App;