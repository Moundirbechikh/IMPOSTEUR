import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VenetianMask,
  ShieldCheck,
  AlertTriangle,
  Gavel,
  LockKeyhole,
  Unlock,
  Search,
  Smile
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
   ÉCRAN 3 — LE JEU (DISTRIBUTION DES CARTES 3D)
============================================================ */
export default function GameScreen({ config, onRestart }) {
  const { players, themeId, imposters, imposterSeesTheme } = config;

  const gameData = useMemo(() => {
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const imposterNames = shuffledPlayers.slice(0, imposters).map(p => p.name || p);

    const themeWords = WORDS[themeId] || ["Mystère"];
    const secretWord = themeWords[Math.floor(Math.random() * themeWords.length)];
    const currentTheme = THEMES.find((t) => t.id === themeId);

    const roles = players.map((p) => ({
      name: p,
      isImposter: imposterNames.includes(p),
    }));

    return { roles, secretWord, themeLabel: currentTheme?.label || "Inconnu" };
  }, [players, themeId, imposters]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDistributionDone, setIsDistributionDone] = useState(false);

  const currentPlayer = gameData.roles[currentIndex];
  const isLastPlayer = currentIndex === gameData.roles.length - 1;

  // Gère le passage au joueur suivant de façon fluide
  const handleNextPlayer = () => {
    setIsFlipped(false);
    
    setTimeout(() => {
      if (isLastPlayer) {
        setIsDistributionDone(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 800);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 pb-12 pt-20">
      
      {/* =========================================================
          LOGO EN HAUT À GAUCHE (Ton design personnalisé)
      ========================================================= */}
      <div className="absolute left-6 top-6 z-20 text-[#F5F0E6]">
        <span className="inline-flex items-center gap-[2px] text-2xl font-bold tracking-tighter">
          <Search className="shrink-0" strokeWidth={3} size="0.85em" />
          mp
          <Smile className="shrink-0 text-[#C81E1E]" strokeWidth={2.5} size="0.9em" />
          steur!?
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* =========================================================
            PHASE 1 : DISTRIBUTION (CARTES FLIP 3D PREMIUM)
        ========================================================= */}
        {!isDistributionDone && (
          <motion.div
            key="distribution-phase"
            className="flex w-full flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
          >
            {/* TEXTE D'EN-TÊTE AU-DESSUS DE LA CARTE */}
            <div className="mb-8 flex flex-col items-center text-center w-full max-w-sm">
              <h1 className="text-2xl font-black text-[#F5F0E6] tracking-tight">
                La distribution commence
              </h1>
              <p className="mt-2 text-sm font-medium leading-snug text-[#F5F0E6]/60 px-4">
                Regarde ton rôle à l'abri des regards, puis passe le téléphone au joueur suivant.
              </p>
              
              {/* Compteur de joueurs discret */}
              <div className="mt-5 rounded-full bg-[#141414] border border-[#F5F0E6]/10 px-4 py-1.5 text-xs font-bold text-[#F5F0E6]/50 uppercase tracking-widest shadow-sm">
                Joueur {currentIndex + 1} sur {gameData.roles.length}
              </div>
            </div>

            {/* CONTENEUR DE LA CARTE 3D */}
            <div 
              className="relative h-[360px] w-full max-w-sm"
              style={{ perspective: 1200 }}
            >
              <motion.div
                className="h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                  scale: isFlipped ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 1, 0.5, 1] 
                }}
              >
                {/* --- FACE AVANT (CACHÉE - PARFAITEMENT CENTRÉE) --- */}
                <motion.div 
                  className="absolute inset-0 flex cursor-pointer flex-col items-center justify-between rounded-[2.5rem] border-2 border-[#1a1a1a] bg-[#0a0a0a] py-10 px-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                  onClick={() => !isFlipped && setIsFlipped(true)}
                  animate={!isFlipped ? { y: [0, -6, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  {/* Cadenas Rouge centré en haut */}
                  <div className="mt-2 text-[#C81E1E] drop-shadow-[0_0_15px_rgba(200,30,30,0.4)]">
                    <LockKeyhole size={32} />
                  </div>
                  
                  {/* Contenu principal (Nom) bien au milieu */}
                  <div className="flex w-full flex-col items-center justify-center">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5F0E6]/30 mb-3">
                      Carte Confidentielle
                    </h3>
                    <h2 className="text-4xl font-black tracking-tighter text-[#F5F0E6] drop-shadow-md">
                      {currentPlayer.name}
                    </h2>
                  </div>

                  {/* Indication d'action en bas */}
                  <div className="mb-2 opacity-60 flex flex-col items-center">
                    <span className="mb-3 h-1 w-8 rounded-full bg-[#C81E1E]/40"></span> {/* Petit rappel rouge */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5F0E6]">
                      Toucher pour ouvrir
                    </p>
                  </div>
                </motion.div>

                {/* --- FACE ARRIÈRE (RÉVÉLÉE AVEC TOUCHES ROUGES) --- */}
                <div 
                  className={`absolute inset-0 flex flex-col items-center justify-start rounded-[2.5rem] border-2 p-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] [transform:rotateY(180deg)] ${
                    currentPlayer.isImposter
                      ? "border-[#C81E1E]/40 bg-gradient-to-b from-[#1a0505] to-[#0a0000]"
                      : "border-[#F5F0E6]/10 bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a]"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* BADGE THEME AVEC BORDURE ET POINT ROUGE */}
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 border border-[#C81E1E]/30 shadow-[0_0_15px_rgba(200,30,30,0.1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C81E1E] animate-pulse" /> {/* Touche rouge */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Thème
                    </span>
                    <span className={`text-xs font-bold uppercase ${currentPlayer.isImposter && !imposterSeesTheme ? 'text-[#C81E1E]' : 'text-white/90'}`}>
                      {currentPlayer.isImposter && !imposterSeesTheme 
                        ? "Inconnu" 
                        : gameData.themeLabel}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {currentPlayer.isImposter ? (
                      <>
                        <VenetianMask size={56} className="mb-4 text-[#C81E1E] drop-shadow-[0_0_15px_rgba(200,30,30,0.6)]" />
                        <h2 className="mb-2 text-4xl font-black tracking-tighter text-[#C81E1E]">
                          IMPOSTEUR
                        </h2>
                        <p className="text-sm font-medium leading-relaxed text-[#F5F0E6]/70 px-2">
                          {imposterSeesTheme
                            ? "Fonds-toi dans la masse en utilisant le thème affiché en haut !"
                            : "Tu n'as aucune idée du mot. Écoute les autres !"}
                        </p>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={40} className="mb-4 text-[#F5F0E6]/60" />
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C81E1E]/80">
                          Le mot secret est
                        </p>
                        <h2 className="text-4xl font-black tracking-tighter text-[#F5F0E6] drop-shadow-[0_0_15px_rgba(245,240,230,0.3)]">
                          {gameData.secretWord}
                        </h2>
                      </>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPlayer();
                    }}
                    className={`mt-4 flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold tracking-tight transition-transform ${
                      currentPlayer.isImposter
                        ? "bg-[#C81E1E] text-white shadow-[0_10px_20px_-5px_rgba(200,30,30,0.5)]"
                        : "bg-[#F5F0E6] text-black shadow-[0_10px_20px_-5px_rgba(245,240,230,0.4)]"
                    }`}
                  >
                    <Unlock size={18} />
                    {isLastPlayer ? "Commencer la partie" : "Cacher et passer"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            PHASE 2 : JEU EN COURS (ET TRANSITION VERS VOTE)
        ========================================================= */}
        {isDistributionDone && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#C81E1E]/30"
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-dashed border-[#F5F0E6]/10"
              />
              <AlertTriangle size={54} className="relative text-[#C81E1E] drop-shadow-[0_0_15px_rgba(200,30,30,0.6)]" />
            </div>
            
            <h2 className="mb-4 text-5xl font-black tracking-tighter text-[#F5F0E6]">
              C'est parti !
            </h2>
            <p className="mb-12 text-lg font-medium leading-relaxed tracking-tight text-[#F5F0E6]/60">
              Tout le monde a vu son rôle.<br/>
              <span className="text-[#F5F0E6]/90 font-bold">Le joueur le plus jeune</span> commence en donnant le premier indice.
            </p>

            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={onRestart} // À remplacer plus tard par ton composant Vote
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#C81E1E] py-5 text-xl font-bold tracking-tight text-white shadow-[0_15px_30px_-10px_rgba(200,30,30,0.6)] hover:bg-[#A01616] transition-colors"
            >
              <Gavel size={24} />
              Passer au vote
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}