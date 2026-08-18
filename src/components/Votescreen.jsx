import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VenetianMask,
  Gavel,
  Check,
  Search,
  Smile,
  RotateCcw,
  UserX
} from "lucide-react";

/* ============================================================
   ÉCRAN 4 — LE VOTE
============================================================ */
export default function VoteScreen({ config, onRestart }) {
  const { players, imposters } = config;

  // Simulation des rôles pour le résultat du vote 
  // (Si tu gères les rôles dans ton App.jsx global, tu pourras les passer en props)
  const gameRoles = useMemo(() => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const impNames = shuffled.slice(0, imposters);
    return players.map((p) => ({
      name: p,
      isImposter: impNames.includes(p),
    }));
  }, [players, imposters]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const votedRole = gameRoles.find((r) => r.name === selectedPlayer);

  const handleVote = () => {
    if (!selectedPlayer) return;
    setVoteSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 pb-12 pt-20">
      
      {/* =========================================================
          LOGO EN HAUT À GAUCHE (Ton design personnalisé)
      ========================================================= */}
      <div className="absolute left-6 top-6 z-20 text-[#F5F0E6]">
        <span className="inline-flex items-center gap-[2px] dis text-2xl font-bold tracking-tighter">
          <Search className="shrink-0" strokeWidth={3} size="0.85em" />
          mp
          <Smile className="shrink-0 text-[#C81E1E]" strokeWidth={2.5} size="0.9em" />
          steur!?
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!voteSubmitted ? (
          /* =========================================================
              PHASE 1 : SÉLECTION DU JOUEUR À ACCUSER
          ========================================================= */
          <motion.div
            key="voting-phase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            className="flex w-full max-w-sm flex-col items-center justify-center"
          >
            {/* EN-TÊTE */}
            <div className="mb-6 flex flex-col items-center text-center w-full">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C81E1E]/10 border border-[#C81E1E]/30 text-[#C81E1E] shadow-[0_0_20px_rgba(200,30,30,0.2)]">
                <Gavel size={26} />
              </div>
              <h1 className="text-2xl font-black text-[#F5F0E6] tracking-tight">
                Heure du vote
              </h1>
              <p className="mt-2 text-sm font-medium leading-snug text-[#F5F0E6]/60 px-4">
                Discutez entre vous, puis désignez le joueur suspecté d'être l'imposteur.
              </p>
            </div>

            {/* LISTE DES JOUEURS */}
            <div className="w-full space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-1">
              {players.map((player, idx) => {
                const isSelected = selectedPlayer === player;
                return (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlayer(player)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-[#C81E1E] bg-[#C81E1E]/10 shadow-[0_0_20px_rgba(200,30,30,0.25)]"
                        : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#F5F0E6]/20"
                    }`}
                  >
                    <span className="text-base font-bold text-[#F5F0E6] tracking-tight">
                      {player}
                    </span>
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#C81E1E] bg-[#C81E1E] text-white"
                          : "border-[#F5F0E6]/20 bg-transparent"
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* BOUTON CONFIRMER LE VOTE */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              disabled={!selectedPlayer}
              onClick={handleVote}
              className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold tracking-tight transition-all ${
                selectedPlayer
                  ? "bg-[#C81E1E] text-white shadow-[0_10px_25px_-5px_rgba(200,30,30,0.6)] cursor-pointer hover:bg-[#A01616]"
                  : "bg-[#141414] text-[#F5F0E6]/30 cursor-not-allowed border border-[#F5F0E6]/5"
              }`}
            >
              <Gavel size={18} />
              Confirmer l'accusation
            </motion.button>
          </motion.div>
        ) : (
          /* =========================================================
              PHASE 2 : RÉSULTAT DU VOTE
          ========================================================= */
          <motion.div
            key="result-phase"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-2xl">
              {votedRole?.isImposter ? (
                <VenetianMask size={56} className="text-[#C81E1E] drop-shadow-[0_0_20px_rgba(200,30,30,0.7)]" />
              ) : (
                <UserX size={56} className="text-[#F5F0E6]/50" />
              )}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5F0E6]/40 mb-2">
              Verdict de la partie
            </h3>
            <h2 className="text-3xl font-black tracking-tighter text-[#F5F0E6] mb-4">
              {selectedPlayer} a été éliminé
            </h2>

            {/* ENCADRÉ DU RÉSULTAT */}
            <div
              className={`mb-10 w-full p-5 rounded-2xl border-2 ${
                votedRole?.isImposter
                  ? "border-[#C81E1E]/40 bg-[#1a0505] shadow-[0_0_30px_rgba(200,30,30,0.15)]"
                  : "border-[#F5F0E6]/10 bg-[#141414]"
              }`}
            >
              <p className="text-base font-bold tracking-tight text-[#F5F0E6] leading-relaxed">
                {votedRole?.isImposter ? (
                  <span className="text-[#C81E1E]">
                    C'était bien l'Imposteur !<br />Victoire éclatante des joueurs ! 
                  </span>
                ) : (
                  <span className="text-[#F5F0E6]/80">
                    Raté... Ce n'était PAS l'Imposteur.<br />L'imposteur s'en sort vivant ! 
                  </span>
                )}
              </p>
            </div>

            {/* BOUTON RECOMMENCER */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={onRestart}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#F5F0E6] py-5 text-xl font-bold tracking-tight text-black shadow-[0_15px_30px_-10px_rgba(245,240,230,0.3)] hover:bg-white transition-colors"
            >
              <RotateCcw size={20} />
              Recommencer une partie
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}