import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Users,
  VenetianMask,
  ArrowRight,
  Film,
  PawPrint,
  Briefcase,
  Pizza,
  Search,
  Smile,
  Eye,
  EyeOff,
} from "lucide-react";

// On l'exporte pour que GameScreen puisse l'utiliser !
export const THEMES = [
  { id: "cinema", label: "Cinéma", icon: Film },
  { id: "animaux", label: "Animaux", icon: PawPrint },
  { id: "metiers", label: "Métiers", icon: Briefcase },
  { id: "bouffe", label: "Bouffe", icon: Pizza },
];

const AVATAR_COLORS = ["#C81E1E", "#F5F0E6", "#8A8578", "#C81E1E"];

/* ============================================================
   LOGO — bloc identique copié tel quel dans SetupScreen,
   GameScreen et VoteScreen : même position, même taille.
   (Le logo géant du Welcome reste un moment à part, l'écran
   d'intro, volontairement différent.)
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

function LogoMark({ size = "text-3xl", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-[2px] font-bold tracking-tighter ${size} ${className}`}>
      <Search className="shrink-0" strokeWidth={3} size="0.85em" />
      mp
      <Smile className="shrink-0 text-[#C81E1E]" strokeWidth={2.5} size="0.9em" />
      steur!?
    </span>
  );
}

/* ============================================================
   FISSURES
============================================================ */
function Crack({ className = "", w = 140, h = 190, flip = false }) {
  const path = useMemo(() => {
    let x = w * 0.5 + (Math.random() - 0.5) * 20;
    let y = 4;
    let d = `M ${x.toFixed(1)} ${y}`;
    const branches = [];
    for (let i = 0; i < 5; i++) {
      x += (Math.random() - 0.5) * 26;
      y += h / 5.5;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      if (Math.random() > 0.45) {
        const bx = x + (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 18);
        const by = y + 8 + Math.random() * 14;
        branches.push(`M ${x.toFixed(1)} ${y.toFixed(1)} L ${bx.toFixed(1)} ${by.toFixed(1)}`);
      }
    }
    return { main: d, branches };
  }, [w, h]);

  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
    >
      <path d={path.main} fill="none" stroke="#F5F0E6" strokeWidth="1" strokeLinecap="round" opacity="0.14" />
      {path.branches.map((b, i) => (
        <path key={i} d={b} fill="none" stroke="#F5F0E6" strokeWidth="0.7" strokeLinecap="round" opacity="0.1" />
      ))}
    </svg>
  );
}

/* ============================================================
   TOGGLE
============================================================ */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
        checked ? "border-[#C81E1E] bg-[#C81E1E]/25" : "border-[#F5F0E6]/15 bg-[#F5F0E6]/5"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 h-5 w-5 rounded-full ${checked ? "bg-[#C81E1E]" : "bg-[#F5F0E6]/40"}`}
        style={{ left: checked ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );
}

/* ============================================================
   WRAPPER ONBOARDING
============================================================ */
export default function ImposteurOnboarding({ onStart }) {
  const [step, setStep] = useState("welcome");

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <WelcomeScreen key="welcome" onNext={() => setStep("setup")} />
        ) : (
          <SetupScreen key="setup" onStart={onStart} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   ÉCRAN 1 — WELCOME (moment à part, logo héros géant)
============================================================ */
function WelcomeScreen({ onNext }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-8 text-center"
    >
      <Crack className="left-0 top-0" w={130} h={180} />
      <Crack className="bottom-0 right-0" w={130} h={180} flip />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10"
      >
        <h1 className="text-[15vw] font-bold leading-[0.88] tracking-tighter sm:text-6xl">
          Bienvenue dans
        </h1>
        <div className="mt-1 flex justify-center text-[#C81E1E]">
          <LogoMark size="text-[16vw] sm:text-6xl" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="relative z-10 mt-6 h-px w-24 bg-[#F5F0E6]/20"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="relative z-10 mt-6 max-w-sm text-lg font-normal leading-snug tracking-tight text-[#F5F0E6]/55"
      >
        Un mot secret, un imposteur caché parmi vous.
        Passez le téléphone, donnez des indices, démasquez le bluffeur.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className="relative z-10 mt-9 flex items-center gap-2 rounded-full bg-[#C81E1E] px-8 py-4 text-lg tracking-tight text-[#F5F0E6] shadow-[0_10px_28px_-8px_rgba(200,30,30,0.55)]"
      >
        Commencer
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}

/* ============================================================
   ÉCRAN 2 — SETUP (logo en coin, identique à Game/Vote)
============================================================ */
function SetupScreen({ onStart }) {
  const [players, setPlayers] = useState(["Moundir", "Nadir", "Amine", "Sami"]);
  const [newName, setNewName] = useState("");
  const [themeId, setThemeId] = useState("cinema");
  const [imposters, setImposters] = useState(1);
  const [imposterSeesTheme, setImposterSeesTheme] = useState(false);

  const addPlayer = () => {
    const name = newName.trim();
    if (!name) return;
    setPlayers((p) => [...p, name]);
    setNewName("");
  };
  const removePlayer = (i) => setPlayers((p) => p.filter((_, idx) => idx !== i));
  const canStart = players.length >= 3 && imposters < players.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mx-auto flex h-full w-full max-w-md flex-col px-6 pt-6 sm:max-w-lg"
    >
      <Crack className="right-0 top-0" w={110} h={150} flip />
      <CornerLogo />

      {/* badge manche, en miroir du logo, même hauteur */}
      <span className="absolute right-6 top-6 z-20 rounded-full border border-[#C81E1E]/30 bg-[#C81E1E]/10 px-3 py-1 text-xs font-bold tracking-tight text-[#C81E1E]">
        Manche 1
      </span>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="relative z-10 shrink-0 mb-1 mt-12 text-2xl font-bold leading-tight tracking-tighter text-[#F5F0E6]/90 sm:text-3xl"
      >
    
      </motion.h2>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto pr-1 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* players */}
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight text-[#F5F0E6]/40">
          <Users size={13} /> Joueurs · {players.length}
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {players.map((name, i) => (
              <motion.div
                key={name + i}
                layout
                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="flex items-center gap-2 rounded-2xl border border-[#F5F0E6]/10 bg-[#141414] px-3.5 py-2.5 text-sm font-bold tracking-tight"
              >
                <span
                  className="h-4 w-4 rounded-full border border-[#F5F0E6]/10"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                />
                {name}
                <button
                  onClick={() => removePlayer(i)}
                  className="text-[#F5F0E6]/30 transition hover:text-[#C81E1E]"
                >
                  <X size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            layout
            className="flex items-center gap-1 rounded-2xl border-2 border-dashed border-[#F5F0E6]/15 px-3.5 py-2.5"
          >
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Nom…"
              className="w-16 bg-transparent text-sm font-bold tracking-tight outline-none placeholder:text-[#F5F0E6]/25"
            />
            <motion.button whileTap={{ scale: 0.85 }} onClick={addPlayer} className="text-[#C81E1E]">
              <Plus size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* theme */}
        <div className="mb-2 text-xs font-bold uppercase tracking-tight text-[#F5F0E6]/40">
          Thème
        </div>
        <div className="mb-3 grid grid-cols-4 gap-2.5">
          {THEMES.map((t) => {
            const selected = t.id === themeId;
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                whileTap={{ scale: 0.93 }}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-4 text-[11px] font-bold tracking-tight transition-colors ${
                  selected
                    ? "border-[#C81E1E] bg-[#C81E1E]/15 text-[#F5F0E6] shadow-[0_0_0_4px_rgba(200,30,30,0.12)]"
                    : "border-[#F5F0E6]/10 bg-[#141414] text-[#F5F0E6]/60"
                }`}
              >
                <Icon size={20} className={selected ? "text-[#C81E1E]" : "text-[#F5F0E6]/40"} />
                {t.label}
              </motion.button>
            );
          })}
        </div>

        {/* toggle */}
        <div className="mb-2 flex items-center justify-between rounded-2xl border border-[#F5F0E6]/10 bg-[#141414] px-4 py-2.5">
          <span className="flex items-center gap-2 text-xs font-bold tracking-tight text-[#F5F0E6]/75">
            {imposterSeesTheme ? <Eye size={15} className="text-[#C81E1E]" /> : <EyeOff size={15} className="text-[#F5F0E6]/40" />}
            L'imposteur voit le thème
          </span>
          <Toggle checked={imposterSeesTheme} onChange={setImposterSeesTheme} />
        </div>

        {/* imposters */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#C81E1E]/25 bg-[#C81E1E]/10 px-5 py-3">
          <span className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <VenetianMask size={17} className="text-[#C81E1E]" />
            Imposteurs
          </span>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setImposters((n) => Math.max(1, n - 1))}
              className="h-8 w-8 rounded-full bg-[#F5F0E6]/10 text-base font-bold"
            >
              −
            </motion.button>
            <motion.span
              key={imposters}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-5 text-center text-xl font-bold tracking-tighter text-[#C81E1E]"
            >
              {imposters}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setImposters((n) => Math.min(players.length - 1, n + 1))}
              className="h-8 w-8 rounded-full bg-[#F5F0E6]/10 text-base font-bold"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-2">
          <motion.button
            disabled={!canStart}
            onClick={() =>
              canStart && onStart({ players, themeId, imposters, imposterSeesTheme })
            }
            whileTap={canStart ? { scale: 0.97 } : {}}
            whileHover={canStart ? { y: -2 } : {}}
            className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-lg font-bold tracking-tight transition-colors ${
              canStart
                ? "bg-[#C81E1E] text-[#F5F0E6] shadow-[0_10px_24px_-8px_rgba(200,30,30,0.5)]"
                : "cursor-not-allowed bg-[#F5F0E6]/10 text-[#F5F0E6]/30"
            }`}
          >
            {canStart && (
              <motion.span
                className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20"
                animate={{ left: ["-33%", "133%"] }}
                transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 1.3, ease: "easeInOut" }}
              />
            )}
            C'est parti
            <ArrowRight size={18} />
          </motion.button>
          {!canStart && (
            <p className="mt-3 text-center text-xs font-bold tracking-tight text-[#F5F0E6]/30">
              Il faut au moins 3 joueurs
            </p>
          )}
        </div>

      </div>
    </motion.div>
  );
}