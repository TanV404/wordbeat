import React, { useEffect, useRef, useState, useMemo } from "react";
import { 
  RotateCcw, 
  Trophy, 
  Play, 
  Ear, 
  Eye, 
  Megaphone, 
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 3;
const TILES = 8;
const ROUND_DURATION = 2400;
const TILE_INTERVAL = ROUND_DURATION / TILES;
const STAGGER_START = 1000;
const HIGHLIGHT_START = 5000;

/* ================= DATA ================= */
const WORD_SETS_POOL = [
  ["🐱", "🎩", "🦇"], ["🔑", "🌳", "3️⃣"], ["🐶", "🪵", "🐸"],
  ["🧦", "🪨", "🔒"], ["🐝", "🍵", "🔑"], ["📌", "🖊️", "🍳"],
  ["snow", "slow", "glow"], ["wish", "fish", "dish"], ["sing", "ring", "king"],
  ["tic", "tac", "toe"], ["run", "sun", "fun"], ["bell", "well", "tell"],
  ["sea", "sells", "shells"], ["🐻", "🍐", "🪑"], ["👁️", "🥧", "👔"], 
  ["🐜", "👖", "🌱"], ["🐐", "⛵", "🧥"], ["🦊", "📦", "🧱"], 
  ["🐛", "☕", "🔌"], ["🌧️", "🚂", "🧠"], ["🐳", "🐌", "✉️"], 
  ["cake", "bake", "lake"], ["mice", "rice", "ice"], ["hop", "pop", "top"],
  ["fly", "sky", "high"], ["tall", "wall", "ball"], ["blue", "glue", "shoe"],
   ["cook", "book", "look"], ["game", "name", "same"]
];

const BEAT_URL = "whistle_crop.mp3";

/* ================= HELPERS ================= */
const getEmojiName = (emoji) => {
  const map = {
    "🐱": "Cat", "🎩": "Hat", "🦇": "Bat", "🔑": "Key", "🌳": "Tree", "3️⃣": "Three",
    "🐶": "Dog", "🪵": "Log", "🐸": "Frog", "🧦": "Sock", "🪨": "Rock", "🔒": "Lock",
    "🐝": "Bee", "🍵": "Tea", "📌": "Pin", "🖊️": "Pen", "🍳": "Pan", "🐻": "Bear", 
    "🍐": "Pear", "🪑": "Chair", "👁️": "Eye", "🥧": "Pie", "👔": "Tie", "🐜": "Ant", 
    "👖": "Pant", "🌱": "Plant", "🐐": "Goat", "⛵": "Boat", "🧥": "Coat", "🦊": "Fox", 
    "📦": "Box", "🧱": "Blocks", "🐛": "Bug", "☕": "Mug", "🔌": "Plug", "🌧️": "Rain", 
    "🚂": "Train", "🧠": "Brain", "🐳": "Whale", "🐌": "Snail", "✉️": "Mail"
  };
  return map[emoji] || emoji;
};

const isEmoji = (v) => /\p{Extended_Pictographic}/u.test(v);

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [displayedRound, setDisplayedRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [countdownText, setCountdownText] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [emojiSets, setEmojiSets] = useState(() => generateGameData());

  const audioRef = useRef(null);
  const timers = useRef([]);

  // Snowflakes
  const snowflakes = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `-${Math.random() * 10}s`,
      duration: `${5 + Math.random() * 10}s`,
      size: Math.random() * 3 + 1 + "px",
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

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
        const countdownSteps = [[4000, "1"], [4350, "2"], [4550, "3"], [4750, "GO"], [5000, ""]];
        countdownSteps.forEach(([time, value]) =>
          timers.current.push(setTimeout(() => setCountdownText(value), time - STAGGER_START))
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
              if (currentRoundNumber >= TOTAL_ROUNDS) setIsGameOver(true);
            }, TILE_INTERVAL);
          }
        }, TILE_INTERVAL);
        timers.current.push(interval);
      }, HIGHLIGHT_START)
    );
  };

  const startGame = () => { setHasStarted(true); scheduleRound(1); };

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
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2600);
    return () => {
      clearTimeout(timer);
      clearTimers();
    };
  }, []);

  const items = emojiSets[displayedRound - 1] || [];
  const displayText = activeTile >= 0 ? `"${getEmojiName(items[activeTile])}"` : countdownText;

  return (
    <div className="h-full w-full relative overflow-hidden text-slate-100 flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* --- INTRO PAGE --- */}
        {isInitialLoading ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.8 } }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4"
          >
            {/* Ambient Snow */}
            <div className="absolute inset-0 pointer-events-none">
              {snowflakes.map(flake => (
                <div key={flake.id} className="absolute bg-white rounded-full animate-fall"
                  style={{
                    left: flake.left, top: '-10px', width: flake.size, height: flake.size,
                    opacity: flake.opacity, animationDuration: flake.duration, animationDelay: flake.delay
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="z-10 flex flex-col items-center gap-8 w-full max-w-2xl"
            >
              <div className="grid grid-cols-3 gap-3 lg:gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                        key={i}
                        // Optimized for Laptop (lg:w-6)
                        className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 rounded-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                        animate={{ 
                            scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3],
                            backgroundColor: ["#991b1b", "#ef4444", "#991b1b"]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    />
                ))}
              </div>

              <div className="text-center w-full">
                {/* Optimized Title: Smaller than previous to fit laptop screens better */}
                <h2 className="text-lg min-[375px]:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-widest uppercase flex flex-row items-center gap-2 sm:gap-3 justify-center mb-6 whitespace-nowrap">
                  Generating Sequences <Sparkles className="text-yellow-400 animate-pulse w-5 h-5 sm:w-8 sm:h-8" />
                </h2>
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-red-500 text-xs sm:text-base lg:text-lg font-bold tracking-[0.2em] uppercase animate-pulse">
                    Say the word before the beat...
                  </p>
                  <div className="w-full max-w-[200px] lg:max-w-[300px] h-1.5 lg:h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      className="h-full bg-red-600 shadow-[0_0_20px_#dc2626]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          
          /* --- GAME PAGE --- */
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full h-full flex flex-col relative"
          >
            {/* Round Indicator */}
            {hasStarted && (
              <div className="absolute right-3 top-3 sm:right-6 sm:top-6 lg:right-8 lg:top-6 z-30 text-green-300 px-3 py-1 font-bold text-xs sm:text-sm lg:text-base tracking-wide flex items-center gap-2 bg-slate-900/50 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                ROUND {round}/{TOTAL_ROUNDS}
              </div>
            )}

            {/* HEADER */}
            <div className="flex-none h-[15vh] min-h-[80px] max-h-[140px] w-full flex items-end justify-center pb-2 z-20">
              {!hasStarted ? (
                <div className="flex flex-col items-center z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  {/* Optimized Header Title for Laptop: lg:text-6xl */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center whitespace-nowrap">
                   🥁 Word Beat Challenge 🥁
                  </h1>
                  <div className="h-1 w-20 sm:w-32 lg:w-40 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mt-2 sm:mt-4 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                </div>
              ) : (
                <motion.div 
                    key={displayText} 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    className="flex items-center justify-center w-full px-4"
                >
                  {/* Active Word Size Optimized: lg:text-7xl */}
                  <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-center break-words leading-tight">
                    {displayText}
                  </span>
                </motion.div>
              )}
            </div>

            {/* MIDDLE: GAME CONTENT */}
            <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center px-4">
              
              {!hasStarted ? (
                // TUTORIAL SCREEN
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-8 lg:gap-10 w-full max-w-4xl lg:max-w-5xl h-full">
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 w-full">
                    {[
                      { icon: <Ear className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-300" />, title: "LISTEN", desc: "Hear beat" },
                      { icon: <Eye className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-300" />, title: "WATCH", desc: "Spot light" },
                      { icon: <Megaphone className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-300" />, title: "SPEAK", desc: "Say it!" },
                    ].map((step, idx) => (
                      <div key={idx} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 sm:p-6 lg:p-6 flex flex-col items-center text-center shadow-lg backdrop-blur-sm">
                        <div className="mb-2 sm:mb-4 lg:mb-5 p-2 sm:p-3 lg:p-4 bg-white/5 rounded-full">{step.icon}</div>
                        <h3 className="font-bold text-white mb-1 text-xs sm:text-lg lg:text-xl uppercase tracking-wider">{step.title}</h3>
                        <p className="text-[10px] sm:text-sm lg:text-base text-slate-400 leading-tight">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Fixed Button Size: lg:text-2xl, px-10 */}
                  <button onClick={startGame} className="group relative w-full max-w-xs lg:max-w-sm px-8 py-4 lg:px-10 lg:py-5 bg-gradient-to-b from-red-600 to-red-800 text-white rounded-2xl font-bold text-lg sm:text-2xl lg:text-2xl shadow-xl hover:scale-105 transition-all overflow-hidden border-t border-red-400">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12 origin-bottom"></div>
                    <span className="relative flex items-center justify-center gap-3 lg:gap-4">
                        <Play fill="currentColor" className="w-6 h-6 lg:w-8 lg:h-8" /> Start Game
                    </span>
                  </button>
                </motion.div>
              ) : (
                // GAME GRID
                <div className="w-full max-w-4xl lg:max-w-5xl flex items-center justify-center h-full">
                   <AnimatePresence mode="wait">
                    <motion.div 
                        key={displayedRound} 
                        variants={gridVariants} 
                        initial="hidden" 
                        animate="show" 
                        exit="exit" 
                        // Grid gap optimized for laptop: lg:gap-6
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 w-full"
                    >
                      {items.map((item, i) => (
                        <motion.div
                          key={i}
                          variants={tileVariants}
                          animate={{ 
                            borderColor: activeTile === i ? "#dc2626" : "rgba(255, 255, 255, 0.8)",
                            backgroundColor: activeTile === i ? "#fee2e2" : "rgba(255, 255, 255, 0.95)",
                            boxShadow: activeTile === i ? "0 0 35px 5px rgba(220, 38, 38, 0.6)" : "0 2px 4px rgba(0,0,0,0.1)",
                            scale: activeTile === i ? 1.05 : 1
                          }}
                          // Border width and Emoji Text Size: lg:border-6, lg:text-7xl/4xl
                          className="aspect-square w-full border-2 sm:border-4 lg:border-[6px] rounded-xl sm:rounded-3xl flex items-center justify-center shadow-sm relative overflow-hidden bg-white/95"
                        >
                          <span className={`${isEmoji(item) ? "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl" : "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase text-slate-800"}`}>
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* FOOTER CONTROLS */}
            {hasStarted && (
              <div className="flex-none h-[100px] lg:h-[120px] w-full px-4 flex justify-center items-start pt-4 z-20">
                <div className="w-full max-w-4xl lg:max-w-5xl flex justify-between items-center">
                    
                    {/* Left Side: Restart */}
                    <div className="w-38">
                        {roundComplete && (
                        <motion.button 
                            onClick={resetGame}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            // Button size: lg:text-lg, lg:px-8
                            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 text-white rounded-xl font-bold text-sm sm:text-lg lg:text-xl shadow-lg border-t border-yellow-400/50 hover:scale-105 transition-transform"
                        >
                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> 
                            <span className="hidden sm:inline">New Game</span>
                        </motion.button>
                        )}
                    </div>

                    {/* Right Side: Next / Trophy */}
                    <div className="flex items-center gap-3 justify-end w-auto">
                        {isGameOver && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 bg-yellow-500/20 border border-yellow-400/50 rounded-xl text-yellow-200 font-bold shadow-lg text-xs sm:text-base lg:text-lg whitespace-nowrap">
                            <Trophy className="w-4 h-4 text-yellow-400 lg:w-5 lg:h-5" /> <span className="hidden sm:inline">All rounds Complete!</span>
                            </motion.div>
                        )}
                        
                        {roundComplete && round < TOTAL_ROUNDS && (
                            <motion.button 
                            onClick={nextRound} 
                            animate={{ y: [0, -4, 0] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }} 
                            // Button size: lg:text-lg, lg:px-10
                            className="px-5 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 bg-gradient-to-b from-green-500 to-green-700 text-white rounded-xl font-bold text-sm sm:text-lg lg:text-xl shadow-lg border-t border-green-400 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                            >
                            Next Round →
                            </motion.button>
                        )}
                    </div>

                </div>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src={BEAT_URL} preload="auto" />
    </div>
  );
}