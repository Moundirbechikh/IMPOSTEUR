import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  VenetianMask,
  Check,
  Smartphone,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

// Import indispensable depuis SetupScreen pour connaitre le nom du thème
import { THEMES } from "./Setupscreen";

/* ============================================================
   DICTIONNAIRE DE MOTS
============================================================ */
const WORDS = {
  cinema: ["Titanic", "Spider-Man", "Jurassic Park", "Inception", "Avatar"],
  animaux: ["Panda", "Éléphant", "Requin", "Crocodile", "Kangourou"],
  metiers: ["Pompier", "Dentiste", "Astronaute", "Boulanger", "Cuisinier"],
  bouffe: ["Pizza", "Sushi", "Tacos", "Raclette", "Couscous"],
};

/* ============================================================
   ÉCRAN 3 — LE JEU
============================================================ */
export default function GameScreen({ config, onRestart }) {
  const { players, themeId, imposters, imposterSeesTheme } = config;

  const gameData = useMemo(() => {
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const imposterNames = shuffledPlayers.slice(0, imposters).map(p => p.name || p);

    const themeWords = WORDS[themeId] || ["Mystère"];
    const secretWord = themeWords[Math.floor(Math.random() * themeWords.length)];

    const roles = players.map((p) => ({
      name: p,
      isImposter: imposterNames.includes(p),
    }));

    return { roles, secretWord, theme: themeId };
  }, [players, themeId, imposters]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewState, setViewState] = useState("intro");

  const currentPlayer = gameData.roles[currentIndex];
  const isLastPlayer = currentIndex === gameData.roles.length - 1;

  const handleReveal = () => setViewState("revealing");
  const handleHide = () => setViewState(isLastPlayer ? "playing" : "pass");
  const handleNextPlayer = () => {
    setCurrentIndex((prev) => prev + 1);
    setViewState("intro");
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        
        {/* --- ÉTAT 1 : À TON TOUR --- */}
        {viewState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#141414] border border-[#F5F0E6]/10 shadow-[0_0_30px_rgba(245,240,230,0.05)]">
              <EyeOff size={36} className="text-[#F5F0E6]/60" />
            </div>
            <h2 className="mb-2 text-4xl font-bold tracking-tighter text-[#F5F0E6]">
              Au tour de <span className="text-[#C81E1E]">{currentPlayer.name}</span>
            </h2>
            <p className="mb-10 text-lg font-normal tracking-tight text-[#F5F0E6]/50">
              Assure-toi d'être seul à regarder l'écran avant de révéler ta carte.
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleReveal}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#F5F0E6] py-4 text-lg font-bold tracking-tight text-black shadow-lg"
            >
              <Eye size={20} />
              Voir ma carte
            </motion.button>
          </motion.div>
        )}

        {/* --- ÉTAT 2 : CARTE RÉVÉLÉE --- */}
        {viewState === "revealing" && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border-2 p-8 text-center shadow-2xl ${
              currentPlayer.isImposter
                ? "border-[#C81E1E]/50 bg-[#C81E1E]/10 shadow-[0_0_50px_rgba(200,30,30,0.15)]"
                : "border-[#F5F0E6]/20 bg-[#141414]"
            }`}
          >
            {currentPlayer.isImposter ? (
              <>
                <VenetianMask size={60} className="mb-4 text-[#C81E1E]" />
                <h2 className="mb-1 text-4xl font-bold tracking-tighter text-[#C81E1E]">
                  Tu es l'Imposteur !
                </h2>
                <p className="mb-8 text-lg leading-tight tracking-tight text-[#F5F0E6]/70">
                  {imposterSeesTheme
                    ? `Le thème est : ${THEMES.find((t) => t.id === themeId)?.label}. Fais semblant de savoir !`
                    : "Tu ne connais ni le mot, ni le thème. Fais semblant et écoute les autres !"}
                </p>
              </>
            ) : (
              <>
                <Check size={60} className="mb-4 text-[#F5F0E6]" />
                <p className="text-sm font-bold uppercase tracking-tight text-[#F5F0E6]/40">
                  Le mot secret est
                </p>
                <h2 className="mb-8 mt-1 text-5xl font-bold tracking-tighter text-[#F5F0E6]">
                  {gameData.secretWord}
                </h2>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleHide}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-bold tracking-tight ${
                currentPlayer.isImposter
                  ? "bg-[#C81E1E] text-[#F5F0E6]"
                  : "bg-[#F5F0E6] text-black"
              }`}
            >
              J'ai bien mémorisé
            </motion.button>
          </motion.div>
        )}

        {/* --- ÉTAT 3 : PASSER LE TÉLÉPHONE --- */}
        {viewState === "pass" && (
          <motion.div
            key="pass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <Smartphone size={50} className="mb-6 text-[#F5F0E6]/40" />
            <h2 className="mb-2 text-4xl font-bold tracking-tighter text-[#F5F0E6]">
              Carte cachée !
            </h2>
            <p className="mb-10 text-lg font-normal tracking-tight text-[#F5F0E6]/60">
              Passe le téléphone à <span className="font-bold text-[#F5F0E6]">{gameData.roles[currentIndex + 1]?.name}</span>
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleNextPlayer}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] border border-[#F5F0E6]/20 py-4 text-lg font-bold tracking-tight text-[#F5F0E6]"
            >
              C'est fait
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* --- ÉTAT 4 : JEU EN COURS --- */}
        {viewState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <AlertTriangle size={60} className="mb-6 text-[#C81E1E]" />
            <h2 className="mb-2 text-5xl font-bold tracking-tighter text-[#F5F0E6]">
              C'est parti !
            </h2>
            <p className="mb-10 text-xl font-normal leading-tight tracking-tight text-[#F5F0E6]/70">
              Tout le monde a vu sa carte. Le joueur le plus jeune donne le premier indice !
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onRestart}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[#F5F0E6]/10 px-8 py-3 text-sm font-bold tracking-tight text-[#F5F0E6]/60 transition-colors hover:bg-[#F5F0E6]/5"
            >
              <RotateCcw size={16} />
              Recommencer une partie
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- INDICATEUR DE PROGRESSION --- */}
      {viewState !== "playing" && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
          {gameData.roles.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-[#C81E1E]"
                  : idx < currentIndex
                  ? "w-2 bg-[#F5F0E6]/40"
                  : "w-2 bg-[#F5F0E6]/10"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}