import React, { useEffect, useRef, useState } from "react";
import { 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Play, 
  Ear, 
  Eye, 
  Megaphone 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 5;
const TILES = 8;
const ROUND_DURATION = 2400;
const TILE_INTERVAL = ROUND_DURATION / TILES;

const STAGGER_START = 1000;
const HIGHLIGHT_START = 5000;

/* ================= DATA ================= */
const WORD_SETS_POOL = [
  ["🐱", "🎩", "🦇"],
  ["🔑", "🌳", "3️⃣"],
  ["🐶", "🪵", "🐸"],
  ["🧦", "🪨", "🔒"],
  ["🐝", "🍵", "🔑"],
  ["📌", "🖊️", "🍳"],
  ["snow", "slow", "glow"],
  ["funny", "money", "sunny"],
  ["wish", "fish", "dish"],
  ["sing", "ring", "king"],
  ["tic", "tac", "toe"],
  ["run", "sun", "fun"],
  ["bell", "well", "tell"],
  ["sea", "sells", "shells"],
  ["🐻", "🍐", "🪑"], 
  ["👁️", "🥧", "👔"], 
  ["🐜", "👖", "🌱"], 
  ["🐐", "⛵", "🧥"], 
  ["🦊", "📦", "🧱"], 
  ["🐛", "☕", "🔌"], 
  ["🌽", "🎷", "🦄"], 
  ["🌧️", "🚂", "🧠"], 
  ["🐳", "🐌", "✉️"], 
  ["cake", "bake", "lake"],
  ["mice", "rice", "ice"],
  ["hop", "pop", "top"],
  ["fly", "sky", "high"],
  ["tall", "wall", "ball"],
  ["blue", "glue", "shoe"],
  ["wet", "jet", "net"],
  ["cook", "book", "look"],
  ["game", "name", "same"]
];

const BEAT_URL = "whistle_crop.mp3";

/* ================= HELPERS ================= */
const getEmojiName = (emoji) => {
  const map = {
    "🐱": "Cat", "🎩": "Hat", "🦇": "Bat",
    "🔑": "Key", "🌳": "Tree", "3️⃣": "Three",
    "🐶": "Dog", "🪵": "Log", "🐸": "Frog",
    "🧦": "Sock", "🪨": "Rock", "🔒": "Lock",
    "🐝": "Bee", "🍵": "Tea",
    "📌": "Pin", "🖊️": "Pen", "🍳": "Pan",
    "🐻": "Bear", "🍐": "Pear", "🪑": "Chair",
    "👁️": "Eye", "🥧": "Pie", "👔": "Tie",
    "🐜": "Ant", "👖": "Pant", "🌱": "Plant",
    "🐐": "Goat", "⛵": "Boat", "🧥": "Coat",
    "🦊": "Fox", "📦": "Box", "🧱": "Blocks",
    "🐛": "Bug", "☕": "Mug", "🔌": "Plug",
    "🌽": "Corn", "🎷": "Horn", "🦄": "Unicorn",
    "🌧️": "Rain", "🚂": "Train", "🧠": "Brain",
    "🐳": "Whale", "🐌": "Snail", "✉️": "Mail"
  };
  return map[emoji] || emoji;
};

const isEmoji = (v) => /\p{Extended_Pictographic}/u.test(v);

// Helper to generate game data
const generateGameData = () => {
  const selectedTheme = WORD_SETS_POOL[Math.floor(Math.random() * WORD_SETS_POOL.length)];
  return Array.from({ length: TOTAL_ROUNDS }, () => 
    Array.from({ length: TILES }, () => selectedTheme[Math.floor(Math.random() * selectedTheme.length)])
  );
};

/* ================= MOTION VARIANTS ================= */
const gridVariants = {
  show: { transition: { delayChildren: 0.6, staggerChildren: 0.4 } },
  exit: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: [0.25, 0.8, 0.25, 1] } },
  exit: { opacity: 0, y: 40, scale: 0.85, transition: { duration: 0.35, ease: "easeIn" } },
};

/* ================= COMPONENT ================= */
export default function Wordbeat() {
  const [round, setRound] = useState(1);
  const [displayedRound, setDisplayedRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [countdownText, setCountdownText] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  
  // State for game data
  const [emojiSets, setEmojiSets] = useState(() => generateGameData());

  const audioRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const scheduleRound = (currentRoundNumber) => {
    clearTimers();
    setActiveTile(-1);
    setRoundComplete(false);
    
    setCountdownText("Get Ready…");

    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio error:", e));
    }

    timers.current.push(
      setTimeout(() => {
        const countdownSteps = [
          [4000, "1"],
          [4350, "2"],
          [4550, "3"],
          [4750, "GO"],
          [5000, ""], 
        ];
        countdownSteps.forEach(([time, value]) =>
          timers.current.push(
            setTimeout(() => setCountdownText(value), time - STAGGER_START)
          )
        );
      }, STAGGER_START)
    );

    timers.current.push(
      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          setActiveTile(i++);
          if (i >= TILES) {
            clearInterval(interval);
            setTimeout(() => {
              setActiveTile(-1);
              setRoundComplete(true);
              if (audioRef.current) audioRef.current.pause();
              
              if (currentRoundNumber >= TOTAL_ROUNDS) {
                  setIsGameOver(true);
              }
            }, TILE_INTERVAL);
          }
        }, TILE_INTERVAL);
        timers.current.push(interval);
      }, HIGHLIGHT_START)
    );
  };

  const startGame = () => {
    setHasStarted(true);
    scheduleRound(1);
  };

  const nextRound = () => {
    clearTimers();
    const next = round + 1;
    setRound(next);
    setDisplayedRound(next);
    setRoundComplete(false);
    scheduleRound(next);
  };

  const resetGame = () => {
    clearTimers();
    setRound(1);
    setDisplayedRound(1);
    setActiveTile(-1);
    setHasStarted(false);
    setRoundComplete(false);
    setCountdownText("");
    setIsGameOver(false);
    
    setEmojiSets(generateGameData());
  };

  useEffect(() => () => clearTimers(), []);

  const items = emojiSets[displayedRound - 1] || [];

  const displayText =
    activeTile >= 0
      ? `"${getEmojiName(items[activeTile])}"`
      : countdownText;

  return (
    // MAIN CONTAINER: Locked height, No Scrollbars
    <div className="h-[calc(100vh-54px)] w-full flex flex-col items-center bg-transparent overflow-hidden">
      
      {/* Round Pill - Top Right */}
      {hasStarted && !isGameOver && (
          <div className="absolute right-4 top-4 z-30 bg-black/40 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              Round {round}/{TOTAL_ROUNDS}
          </div>
      )}

      {/* --- HEADER --- */}
      <div className="shrink-0 w-full relative flex items-center justify-center h-20 sm:h-24 z-20 mt-4 sm:mt-8 mb-4">
          {!hasStarted || isGameOver ? (
              <div className="flex flex-col items-center z-10 animate-in fade-in duration-300">
                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
                    🥁 Word Beat Challenge 🥁
                  </h1>
                  <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full opacity-80 shadow-[0_0_15px_rgba(239,68,68,0.5)] mt-2"></div>
              </div>
          ) : (
              <motion.span 
                  key={displayText} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-6xl sm:text-7xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] z-10"
              >
                  {displayText}
              </motion.span>
          )}
      </div>

      {/* --- MAIN CONTENT CENTER --- */}
      <div className="flex-1 w-full min-h-0 flex flex-col justify-center items-center relative">
          
          {/* Start / Tutorial Screen */}
          {!hasStarted && !isGameOver && (
          <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8 w-full max-w-3xl px-6"
          >
              {/* Tutorial Cards */}
              <div className="grid grid-cols-3 gap-4 w-full">
                  {[
                      { icon: <Ear className="w-10 h-10 sm:w-12 sm:h-12 text-blue-300" />, title: "Listen", desc: "Hear beat" },
                      { icon: <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-green-300" />, title: "Watch", desc: "Spot light" },
                      { icon: <Megaphone className="w-10 h-10 sm:w-12 sm:h-12 text-red-300" />, title: "Speak", desc: "Say it!" },
                  ].map((step, idx) => (
                      <div key={idx} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl hover:bg-slate-800/50 transition-colors">
                          <div className="mb-4 p-3 bg-white/10 rounded-full shadow-inner">{step.icon}</div>
                          <h3 className="font-bold text-white mb-1 text-lg sm:text-xl">{step.title}</h3>
                          <p className="text-sm sm:text-base text-slate-300 leading-tight">{step.desc}</p>
                      </div>
                  ))}
              </div>

              <button
                  onClick={startGame}
                  className="group relative px-12 py-4 bg-gradient-to-b from-red-600 to-red-800 text-white rounded-2xl font-bold text-2xl shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden border-t border-red-400 mt-4"
              >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12 origin-bottom"></div>
                  <span className="relative flex items-center gap-4">
                  <Play fill="currentColor" size={28} /> Start Game
                  </span>
              </button>
          </motion.div>
          )}

          {/* Game Active - GROUPED TOGETHER */}
          {hasStarted && !isGameOver && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                
                <div className="w-full max-w-md sm:max-w-4xl flex flex-col h-full gap-6">
                    
                    {/* 1. The Grid Area */}
                    <div className="flex-1 min-h-0 flex items-center justify-center pb-2 w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-full max-h-full content-center justify-center"
                            variants={gridVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            key={displayedRound}
                            >
                            {items.map((item, i) => (
                                <motion.div
                                key={i}
                                variants={tileVariants}
                                animate={{ 
                                    borderColor: activeTile === i ? "#dc2626" : "rgba(255, 255, 255, 0.8)",
                                    backgroundColor: activeTile === i ? "#fee2e2" : "rgba(255, 255, 255, 0.95)",
                                    boxShadow: activeTile === i ? "0 0 35px 5px rgba(220, 38, 38, 0.6)" : "0 2px 4px rgba(0,0,0,0.1)",
                                    zIndex: activeTile === i ? 10 : 1
                                }}
                                transition={{
                                    duration: activeTile === i ? 0 : 0.5
                                }}
                                className="border-4 rounded-3xl flex items-center justify-center aspect-square shadow-sm relative overflow-visible min-w-0"
                                >
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[20px]"></div>
                                <span
                                    className={`${isEmoji(item) ? "text-6xl sm:text-8xl drop-shadow-sm" : "text-2xl sm:text-5xl font-bold uppercase text-slate-800 text-center leading-none px-1"}`}
                                >
                                    {item}
                                </span>
                                </motion.div>
                            ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* 2. The Button Area */}
                    <div className="h-16 shrink-0 w-full flex justify-end items-start z-20">
                        {roundComplete && round < TOTAL_ROUNDS && (
                            // UPDATED: Added BOUNCE ANIMATION HERE
                            <motion.button
                                onClick={nextRound}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                                className="px-8 py-3 bg-gradient-to-b from-green-500 to-green-700 text-white rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:scale-105 transition-all border-t border-green-400"
                            >
                                Next Round →
                            </motion.button>
                        )}
                    </div>

                </div>
            </div>
          )}

          {/* Game Finished Screen */}
          {isGameOver && (
          <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-8"
          >
              <div className="relative">
                  <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" 
                  />
                  <Trophy size={120} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] relative z-10" />
              </div>
              
              <div className="space-y-2 text-center">
                  <h2 className="text-6xl font-black text-white drop-shadow-md">Awesome!</h2>
                  <p className="text-2xl text-slate-200 font-medium">Completed all {TOTAL_ROUNDS} rounds.</p>
              </div>

              <button
              onClick={resetGame}
              className="flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-bold text-xl shadow-lg hover:bg-white/20 transition-all hover:-translate-y-1"
              >
              <RotateCcw size={24} className="text-red-400" /> Play Again
              </button>
          </motion.div>
          )}
      </div>
      
      <audio ref={audioRef} src={BEAT_URL} preload="auto" />
    </div>
  );
}