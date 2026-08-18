import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VenetianMask,
  ShieldCheck,
  Gavel,
  Check,
  Search,
  Smile,
  RotateCcw,
  ArrowRight,
  Vote,
} from "lucide-react";

/* ============================================================
   LOGO — bloc identique à SetupScreen et GameScreen
============================================================ */
function CornerLogo() {
  return (
    <div className="absolute left-6 top-6 z-20 text-[#F5F0E6]">
      <span className="inline-flex items-center gap-[2px] text-2xl font-bold tracking-tighter">
        <Search className="shrink-0" strokeWidth={3} size="0.85em" />
        mp
        <Smile className="shrink-0 text-[#C81E1E]" strokeWidth={2.5} size="0.9em" />
        steur!?
      </span>
    </div>
  );
}

/* ============================================================
   PARTICULES — petite explosion de points au verdict, pour
   rester dans le thème (rouge/crème) sans sortir une lib de
   confettis externe
============================================================ */
function Burst({ color = "#C81E1E", count = 14 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 70 + Math.random() * 50;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 3 + Math.random() * 4,
          delay: Math.random() * 0.15,
        };
      }),
    [count]
  );

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   ÉCRAN 4 — LE VOTE, TOUR PAR TOUR
============================================================ */
export default function VoteScreen({ roundData, onRestart }) {
  // roundData vient de GameScreen : { roles, secretWord, themeLabel }
  // roles = l'ordre de passage tiré au sort en début de manche,
  // avec le rôle réel de chacun. On réutilise EXACTEMENT cet
  // ordre pour le tour de vote, et ces MÊMES rôles pour le verdict
  // (aucune re-génération aléatoire ici).
  const turnOrder = roundData.roles;

  const [voterIndex, setVoterIndex] = useState(0);
  const [phase, setPhase] = useState("pass"); // "pass" | "select" | "tally" | "result"
  const [votes, setVotes] = useState({});
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  const voter = turnOrder[voterIndex];
  const isLastVoter = voterIndex === turnOrder.length - 1;
  const suspects = turnOrder.filter((p) => p.name !== voter.name);

  const confirmVote = () => {
    if (!selectedSuspect) return;
    setVotes((prev) => ({ ...prev, [voter.name]: selectedSuspect }));
    setSelectedSuspect(null);
    if (isLastVoter) {
      setPhase("tally");
    } else {
      setVoterIndex((i) => i + 1);
      setPhase("pass");
    }
  };

  const tally = useMemo(() => {
    const counts = {};
    turnOrder.forEach((p) => (counts[p.name] = 0));
    Object.values(votes).forEach((suspectName) => {
      counts[suspectName] = (counts[suspectName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        isImposter: turnOrder.find((p) => p.name === name)?.isImposter,
      }))
      .sort((a, b) => b.count - a.count);
  }, [votes, turnOrder]);

  const maxVotes = tally[0]?.count || 1;
  const accused = tally[0];
  const crewWins = accused?.isImposter;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 pb-12 pt-20">
      <CornerLogo />

      <AnimatePresence mode="wait">
        {/* =========================================================
            PHASE "pass" — on passe le téléphone au votant suivant
        ========================================================= */}
        {phase === "pass" && (
          <motion.div
            key={`pass-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C81E1E]/30 bg-[#C81E1E]/10 text-[#C81E1E] shadow-[0_0_20px_rgba(200,30,30,0.2)]">
              <Vote size={28} />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#F5F0E6]/40">
              Passe le téléphone à
            </p>
            <h1 className="mb-8 text-4xl font-black tracking-tighter text-[#F5F0E6]">
              {voter.name}
            </h1>

            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ y: -2 }}
              onClick={() => setPhase("select")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C81E1E] py-4 text-lg font-bold tracking-tight text-white shadow-[0_10px_24px_-8px_rgba(200,30,30,0.5)]"
            >
              Je suis prêt(e)
              <ArrowRight size={18} />
            </motion.button>

            <div className="mt-8 flex gap-1.5">
              {turnOrder.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i < voterIndex ? "bg-[#C81E1E]" : i === voterIndex ? "bg-[#F5F0E6]" : "bg-[#F5F0E6]/15"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            PHASE "select" — le votant choisit son suspect
        ========================================================= */}
        {phase === "select" && (
          <motion.div
            key={`select-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <div className="mb-6 flex flex-col items-center text-center w-full">
              <h1 className="text-2xl font-black text-[#F5F0E6] tracking-tight">
                {voter.name}, qui soupçonnes-tu ?
              </h1>
              <p className="mt-2 text-sm font-medium leading-snug text-[#F5F0E6]/60 px-4">
                Choisis le joueur que tu penses être l'imposteur.
              </p>
            </div>

            <div className="w-full space-y-3 mb-8 max-h-[320px] overflow-y-auto pr-1">
              {suspects.map((p) => {
                const isSelected = selectedSuspect === p.name;
                return (
                  <motion.div
                    key={p.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSuspect(p.name)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-[#C81E1E] bg-[#C81E1E]/10 shadow-[0_0_20px_rgba(200,30,30,0.25)]"
                        : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#F5F0E6]/20"
                    }`}
                  >
                    <span className="text-base font-bold text-[#F5F0E6] tracking-tight">
                      {p.name}
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

            <motion.button
              whileTap={{ scale: 0.94 }}
              disabled={!selectedSuspect}
              onClick={confirmVote}
              className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold tracking-tight transition-all ${
                selectedSuspect
                  ? "bg-[#C81E1E] text-white shadow-[0_10px_25px_-5px_rgba(200,30,30,0.6)] cursor-pointer hover:bg-[#A01616]"
                  : "bg-[#141414] text-[#F5F0E6]/30 cursor-not-allowed border border-[#F5F0E6]/5"
              }`}
            >
              <Gavel size={18} />
              {isLastVoter ? "Valider mon vote et voir les résultats" : "Valider mon vote"}
            </motion.button>

            <div className="mt-6 flex gap-1.5">
              {turnOrder.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i < voterIndex ? "bg-[#C81E1E]" : i === voterIndex ? "bg-[#F5F0E6]" : "bg-[#F5F0E6]/15"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            PHASE "tally" — dépouillement animé
        ========================================================= */}
        {phase === "tally" && (
          <motion.div
            key="tally"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <h1 className="text-2xl font-black text-[#F5F0E6] tracking-tight">
                Dépouillement
              </h1>
              <p className="mt-2 text-sm font-medium text-[#F5F0E6]/60">
                Tous les votes sont comptés…
              </p>
            </div>

            <div className="w-full space-y-4 mb-10">
              {tally.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                >
                  <div className="mb-1.5 flex items-center justify-between text-sm font-bold tracking-tight text-[#F5F0E6]">
                    <span>{t.name}</span>
                    <span className="text-[#F5F0E6]/50">{t.count} vote{t.count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#141414]">
                    <motion.div
                      className="h-full rounded-full bg-[#C81E1E]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.count / maxVotes) * 100}%` }}
                      transition={{ delay: i * 0.12 + 0.15, duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tally.length * 0.12 + 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPhase("result")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F5F0E6] py-4 text-lg font-bold tracking-tight text-black shadow-[0_10px_24px_-8px_rgba(245,240,230,0.35)]"
            >
              Voir le verdict
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* =========================================================
            PHASE "result" — verdict dramatique
        ========================================================= */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-2xl">
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              >
                {accused?.isImposter ? (
                  <VenetianMask size={56} className="text-[#C81E1E] drop-shadow-[0_0_20px_rgba(200,30,30,0.7)]" />
                ) : (
                  <ShieldCheck size={56} className="text-[#F5F0E6]/60" />
                )}
              </motion.div>
              {crewWins && <Burst color="#C81E1E" />}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5F0E6]/40 mb-2">
              Verdict de la partie
            </h3>
            <h2 className="text-3xl font-black tracking-tighter text-[#F5F0E6] mb-1">
              {accused?.name} est démasqué(e)
            </h2>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#F5F0E6]/30">
              {accused?.count} vote{accused?.count !== 1 ? "s" : ""} sur {turnOrder.length}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mb-6 w-full p-5 rounded-2xl border-2 ${
                crewWins
                  ? "border-[#C81E1E]/40 bg-[#1a0505] shadow-[0_0_30px_rgba(200,30,30,0.15)]"
                  : "border-[#F5F0E6]/10 bg-[#141414]"
              }`}
            >
              <p className="text-base font-bold tracking-tight leading-relaxed">
                {crewWins ? (
                  <span className="text-[#C81E1E]">
                    C'était bien l'imposteur !<br />Les innocents gagnent la manche.
                  </span>
                ) : (
                  <span className="text-[#F5F0E6]/80">
                    Raté… {accused?.name} n'était pas l'imposteur.<br />
                    L'imposteur s'échappe et remporte la manche.
                  </span>
                )}
              </p>
            </motion.div>

            {/* rappel discret de qui était réellement l'imposteur */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-10 text-xs font-bold tracking-tight text-[#F5F0E6]/30"
            >
              Imposteur{turnOrder.filter((p) => p.isImposter).length > 1 ? "s" : ""} :{" "}
              {turnOrder.filter((p) => p.isImposter).map((p) => p.name).join(", ")}
            </motion.p>

            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={onRestart}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#F5F0E6] py-5 text-xl font-bold tracking-tight text-black shadow-[0_15px_30px_-10px_rgba(245,240,230,0.3)] hover:bg-white transition-colors"
            >
              <RotateCcw size={20} />
              Rejouer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}