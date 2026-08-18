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
  Scale,
  X,
  List,
  ChevronLeft
} from "lucide-react";

/* ============================================================
   LOGO
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
   PARTICULES
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
   ÉCRAN 4 — LE VOTE & VERDICT
============================================================ */
export default function VoteScreen({ roundData, onRestart }) {
  const turnOrder = roundData.roles;

  const [voterIndex, setVoterIndex] = useState(0);
  const [phase, setPhase] = useState("pass"); // "pass" | "select" | "tally" | "result"
  const [showDetails, setShowDetails] = useState(false); // NOUVEAU: Gère l'affichage de l'écran des détails
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

  // Calcul des résultats
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

  const maxVotes = tally[0]?.count || 0;
  // Détection des ex æquo
  const topSuspects = tally.filter((t) => t.count === maxVotes && maxVotes > 0);
  const isTie = topSuspects.length > 1;

  const accused = !isTie ? tally[0] : null;
  const crewWins = accused ? accused.isImposter : false;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 pb-12 pt-20">
      <CornerLogo />

      <AnimatePresence mode="wait">
        {/* =========================================================
            PHASE "pass" — passage de téléphone
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
            PHASE "select" — choix du suspect
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
            PHASE "tally" — dépouillement
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
                      animate={{ width: `${maxVotes > 0 ? (t.count / maxVotes) * 100 : 0}%` }}
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
            PHASE "result" — verdict dramatique scindé en deux vues
        ========================================================= */}
        {phase === "result" && !showDetails && (
          <motion.div
            key="result-main"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="relative flex w-full max-w-sm flex-col items-center text-center"
          >
            {/* BOÎTE D'ICÔNE COLORÉE DYNAMIQUE */}
            <div
              className={`relative mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border-2 shadow-2xl transition-all ${
                isTie
                  ? "border-[#EA580C]/40 bg-[#1f0d03] text-[#EA580C] shadow-[0_0_30px_rgba(234,88,12,0.25)]"
                  : crewWins
                  ? "border-[#C81E1E]/40 bg-[#1a0505] text-[#C81E1E] shadow-[0_0_30px_rgba(200,30,30,0.3)]"
                  : "border-[#4B5563]/40 bg-[#111827] text-[#9CA3AF] shadow-[0_0_20px_rgba(107,114,128,0.15)]"
              }`}
            >
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              >
                {isTie ? (
                  <Scale size={56} />
                ) : crewWins ? (
                  <VenetianMask size={56} className="drop-shadow-[0_0_20px_rgba(200,30,30,0.7)]" />
                ) : (
                  <ShieldCheck size={56} />
                )}
              </motion.div>
              {crewWins && <Burst color="#C81E1E" />}
              {isTie && <Burst color="#EA580C" />}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5F0E6]/40 mb-2">
              Verdict de la partie
            </h3>

            {/* TITRE DU VERDICT */}
            <h2 className="text-3xl font-black tracking-tighter text-[#F5F0E6] mb-1">
              {isTie
                ? "Égalité parfaite !"
                : crewWins
                ? `${accused?.name} est démasqué(e) !`
                : `${accused?.name} est éliminé(e) !`}
            </h2>

            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-[#F5F0E6]/30">
              {isTie
                ? `${topSuspects.map((s) => s.name).join(" & ")} (${maxVotes} vote${maxVotes > 1 ? "s" : ""})`
                : `${accused?.count} vote${accused?.count !== 1 ? "s" : ""} sur ${turnOrder.length}`}
            </p>

            {/* MESSAGE ET COULEURS DU BANNER */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mb-8 w-full p-5 rounded-2xl border-2 ${
                isTie
                  ? "border-[#EA580C]/40 bg-[#1a0c04]"
                  : crewWins
                  ? "border-[#C81E1E]/40 bg-[#1a0505]"
                  : "border-[#4B5563]/30 bg-[#141414]"
              }`}
            >
              <p className="text-base font-bold tracking-tight leading-relaxed">
                {isTie ? (
                  <span className="text-[#EA580C]">
                    Match nul ! Aucun joueur n'a été désigné à la majorité.<br />
                    L'imposteur en profite pour s'échapper !
                  </span>
                ) : crewWins ? (
                  <span className="text-[#C81E1E]">
                    Bien joué ! C'était bien l'imposteur.<br />
                    Les innocents remportent la victoire !
                  </span>
                ) : (
                  <span className="text-[#9CA3AF]">
                    Oups... {accused?.name} était un innocent !<br />
                    L'imposteur a réussi à vous tromper.
                  </span>
                )}
              </p>
            </motion.div>

            {/* NOUVEAU BOUTON : VOIR LES DÉTAILS */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowDetails(true)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#F5F0E6]/10 bg-[#0a0a0a] py-4 text-sm font-bold tracking-tight text-[#F5F0E6]/70 hover:bg-[#141414] hover:text-[#F5F0E6] transition-colors"
            >
              <List size={18} />
              Voir le détail des votes
            </motion.button>

            {/* BOUTON REJOUER */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={onRestart}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#F5F0E6] py-4 text-lg font-bold tracking-tight text-black shadow-[0_15px_30px_-10px_rgba(245,240,230,0.3)] hover:bg-white transition-colors"
            >
              <RotateCcw size={20} />
              Rejouer une partie
            </motion.button>
          </motion.div>
        )}

        {/* =========================================================
            PHASE "result" — Vue des DÉTAILS
        ========================================================= */}
        {phase === "result" && showDetails && (
          <motion.div
            key="result-details"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <div className="mb-6 flex flex-col items-center text-center w-full">
              <h2 className="text-2xl font-black text-[#F5F0E6] tracking-tight">
                Détail des votes
              </h2>
              <p className="mt-2 text-sm font-medium leading-snug text-[#F5F0E6]/60">
                Qui a voté contre qui ?
              </p>
            </div>

            {/* DÉTAIL DES VOTES DE CHAQUE JOUEUR */}
            <div className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-6">
              <div className="space-y-3">
                {turnOrder.map((p) => {
                  const votedFor = votes[p.name];
                  const votedTarget = turnOrder.find((item) => item.name === votedFor);
                  const votedCorrectly = votedTarget?.isImposter;

                  return (
                    <div
                      key={p.name}
                      className="flex items-center justify-between text-sm font-medium border-b border-[#1a1a1a] pb-3 last:border-none last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F5F0E6]">{p.name}</span>
                        <ArrowRight size={14} className="text-[#F5F0E6]/20" />
                        <span className="font-semibold text-[#F5F0E6]/80">{votedFor}</span>
                      </div>

                      {votedCorrectly ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check size={12} strokeWidth={3} /> Vrai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          <X size={12} strokeWidth={3} /> Faux
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECAPITULATIF DISCRET DES IMPOSTEURS */}
            <div className="mb-8 w-full p-4 rounded-xl border border-[#C81E1E]/20 bg-[#C81E1E]/5 text-center">
              <p className="text-xs font-bold tracking-tight text-[#F5F0E6]/60">
                Vrai{turnOrder.filter((p) => p.isImposter).length > 1 ? "x" : ""} imposteur{turnOrder.filter((p) => p.isImposter).length > 1 ? "s" : ""} :{" "}
                <span className="text-[#C81E1E] text-sm uppercase tracking-wider">
                  {turnOrder.filter((p) => p.isImposter).map((p) => p.name).join(", ")}
                </span>
              </p>
            </div>

            {/* BOUTON RETOUR AU VERDICT */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowDetails(false)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] border border-[#F5F0E6]/10 py-4 text-sm font-bold tracking-tight text-[#F5F0E6]/90 hover:bg-[#1a1a1a] transition-colors"
            >
              <ChevronLeft size={18} />
              Retour au verdict
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}