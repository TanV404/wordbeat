import React, { useEffect, useRef, useState, useMemo } from "react";
import { 
  RotateCcw, 
  Trophy, 
  Play, 
  Ear, 
  Eye, 
  Megaphone, 
  Sparkles,
  ArrowRight
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
  ["sea", "sells", "shells"], ["👁️", "🥧", "👔"], 
 ["🐐", "⛵", "🧥"], ["🦊", "📦", "🧱"], 
  ["🐛", "☕", "🔌"], ["🐳", "🐌", "✉️"], 
  ["cake", "bake", "lake"], ["mice", "rice", "ice"], ["hop", "pop", "top"],
  ["fly", "sky", "high"], ["tall", "wall", "ball"], ["blue", "glue", "shoe"],
   ["cook", "book", "look"], ["game", "name", "same"]
];

const BEAT_URL = "whistle_crop.mp3";
const INTRO_MUSIC_URL = "WordBeatIntro.mp3"; 

/* ================= HELPERS ================= */
const getEmojiName = (emoji) => {
  const map = {
    "🐱": "Cat", "🎩": "Hat", "🦇": "Bat", "🔑": "Key", "🌳": "Tree", "3️⃣": "Three",
    "🐶": "Dog", "🪵": "Log", "🐸": "Frog", "🧦": "Sock", "🪨": "Rock", "🔒": "Lock",
    "🐝": "Bee", "🍵": "Tea", "📌": "Pin", "🖊️": "Pen", "🍳": "Pan",
     "👁️": "Eye", "🥧": "Pie", "👔": "Tie", 
    "🐐": "Goat", "⛵": "Boat", "🧥": "Coat", "🦊": "Fox", 
    "📦": "Box", "🧱": "Blocks", "🐛": "Bug", "☕": "Mug", "🔌": "Plug",
     "🐳": "Whale", "🐌": "Snail", "✉️": "Mail"
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

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "backOut", delay: 0.5 } }
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

  const audioRef = useRef(null);       // Game beat
  const introAudioRef = useRef(null);  // Intro music ref
  const timers = useRef([]);
  const shouldPlayIntroRef = useRef(true); 

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

  const startGame = () => { 
    shouldPlayIntroRef.current = false;
    if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
    }
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
    shouldPlayIntroRef.current = true;
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    let interactionHandler;

    const playIntro = async () => {
      if (!shouldPlayIntroRef.current) return;

      if (introAudioRef.current) {
        introAudioRef.current.volume = 0.6;
        try {
          await introAudioRef.current.play();
        } catch (error) {
          console.log("Autoplay blocked. Waiting for interaction...");
          
          interactionHandler = () => {
             window.removeEventListener("click", interactionHandler);
             window.removeEventListener("keydown", interactionHandler);
             window.removeEventListener("touchstart", interactionHandler);

             if (!shouldPlayIntroRef.current) return;

             if (introAudioRef.current) {
               introAudioRef.current.play().catch(e => console.log("Play failed", e));
             }
          };
          
          window.addEventListener("click", interactionHandler);
          window.addEventListener("keydown", interactionHandler);
          window.addEventListener("touchstart", interactionHandler);
        }
      }
    };

    playIntro();

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2600);

    return () => {
      clearTimeout(timer);
      clearTimers();
      
      if (introAudioRef.current) {
        introAudioRef.current.pause();
      }

      if (interactionHandler) {
         window.removeEventListener("click", interactionHandler);
         window.removeEventListener("keydown", interactionHandler);
         window.removeEventListener("touchstart", interactionHandler);
      }
    };
  }, []);

  const items = emojiSets[displayedRound - 1] || [];
  const displayText = activeTile >= 0 ? `"${getEmojiName(items[activeTile])}"` : countdownText;

  return (
    <div className="h-full w-full relative text-slate-100 flex flex-col overflow-hidden">
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
                <h2 className="text-lg min-[375px]:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-widest uppercase flex flex-row items-center gap-2 sm:gap-3 justify-center mb-6 whitespace-nowrap">
                  Generating Sequences <Sparkles className="text-yellow-400 animate-pulse w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10" />
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
            className="flex-1 w-full h-full flex flex-col relative overflow-y-auto overflow-x-hidden"
          >
            {/* Round Indicator - High Z-Index, Matched Styling */}
            {hasStarted && (
              <div className="absolute right-3 top-3 sm:right-6 sm:top-6 lg:right-10 lg:top-8 z-[60] bg-black/40 backdrop-blur-md border border-green-500/30 text-green-300 px-3 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full font-bold text-xs sm:text-sm lg:text-lg shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                Round {round}/{TOTAL_ROUNDS}
              </div>
            )}

            {/* HEADER */}
            <div className="flex-none h-[15vh] min-h-[80px] max-h-[140px] w-full flex items-end justify-center pb-2 relative z-50">
              {!hasStarted ? (
                <div className="flex flex-col items-center z-10 animate-in fade-in slide-in-from-top-4 duration-500">
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
                  <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-center break-words leading-tight">
                    {displayText}
                  </span>
                </motion.div>
              )}
            </div>

            {/* MIDDLE: GAME CONTENT */}
            <div className="flex-1 w-full min-h-0 relative z-0 flex flex-col items-center justify-center px-4">
              
              {!hasStarted ? (
                // TUTORIAL SCREEN
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-8 lg:gap-12 w-full max-w-4xl lg:max-w-6xl h-full">
                  <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4 lg:gap-6">
                    {[
                      { icon: <Ear className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-blue-300" />, title: "LISTEN", desc: "Hear beat" },
                      { icon: <Eye className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-green-300" />, title: "WATCH", desc: "Spot light" },
                      { icon: <Megaphone className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-red-300" />, title: "SPEAK", desc: "Say it!" },
                    ].map((step, idx, arr) => (
                      <React.Fragment key={idx}>
                          <div className="flex-1 bg-slate-800/40 border border-white/5 rounded-xl p-3 sm:p-6 lg:p-8 flex flex-col items-center text-center shadow-lg backdrop-blur-sm min-w-0">
                            <div className="mb-2 sm:mb-4 lg:mb-6 p-2 sm:p-3 lg:p-4 bg-white/5 rounded-full shadow-inner">{step.icon}</div>
                            <h3 className="font-bold text-white mb-1 text-xs sm:text-lg lg:text-2xl uppercase tracking-wider">{step.title}</h3>
                            <p className="text-[10px] sm:text-sm lg:text-lg text-slate-400 leading-tight">{step.desc}</p>
                          </div>
                          {idx < arr.length - 1 && (
                              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10 text-white/30 flex-none" strokeWidth={3} />
                          )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  <button 
                    onClick={startGame} 
                    className="group relative w-full max-w-xs lg:max-w-md px-8 py-4 lg:px-14 lg:py-6 bg-gradient-to-b from-red-600 to-red-800 text-white rounded-2xl font-bold text-lg sm:text-2xl lg:text-4xl shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden border-t border-red-400"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12 origin-bottom"></div>
                    <span className="relative flex items-center justify-center gap-3 lg:gap-5">
                        <Play fill="currentColor" className="w-6 h-6 lg:w-10 lg:h-10" /> Start Game
                    </span>
                  </button>
                </motion.div>
              ) : (
                // GAME GRID - Landscape Cards
                <div className="w-full max-w-5xl h-full max-h-[65vh] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                    <motion.div 
                        key={displayedRound} 
                        variants={gridVariants} 
                        initial="hidden" 
                        animate="show" 
                        exit="exit" 
                        className="grid grid-cols-4 grid-rows-[1fr_1fr_auto] gap-2 sm:gap-4 w-full h-full"
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
                          className="aspect-[4/3] w-full h-full border-2 sm:border-4 lg:border-[6px] rounded-xl sm:rounded-3xl flex items-center justify-center shadow-sm relative overflow-visible bg-white/95"
                        >
                          <span className={`${isEmoji(item) ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl" : "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase text-slate-800"}`}>
                            {item}
                          </span>
                        </motion.div>
                      ))}

                      {/* --- CONTROLS ALIGNED WITH GRID --- */}
                      
                      {/* Left: New Game */}
                      <motion.div className="col-start-1 row-start-3 flex justify-start pt-2 h-14" variants={buttonVariants}>
                        {roundComplete && (
                            <button 
                                onClick={resetGame}
                                className="flex  items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 text-white rounded-xl font-bold text-xs sm:text-sm lg:text-xl shadow-lg border-t border-yellow-400/50 hover:scale-105 transition-transform whitespace-nowrap h-full"
                            >
                                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> 
                                <span className="hidden sm:inline">New Game</span>
                            </button>
                        )}
                      </motion.div>

                      {/* Right: Next Round OR All Rounds Complete */}
                      <motion.div className="col-start-4 row-start-3 flex justify-end pt-2 h-14" variants={buttonVariants}>
                        {isGameOver ? (
                            <div className="flex  items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-yellow-500/20 border border-yellow-400/50 rounded-xl text-yellow-200 font-bold shadow-lg text-xs sm:text-sm lg:text-xl whitespace-nowrap h-full">
                                <Trophy className="w-4 h-4 text-yellow-400 lg:w-5 lg:h-5" /> 
                                <span className="hidden sm:inline">Complete!</span>
                            </div>
                        ) : roundComplete && (
                            <button 
                                onClick={nextRound} 
                                className="flex  items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-b from-green-500 to-green-700 text-white rounded-xl font-bold text-xs sm:text-sm lg:text-xl shadow-lg border-t border-green-400/50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap h-full"
                            >
                                Next Round <ArrowRight className="w-5 h-5 stroke-[3]" />
                            </button>
                        )}
                      </motion.div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* FOOTER CONTROLS CONTAINER (Empty but keeps spacing if needed) */}
            <div className="flex-none h-[20px] w-full relative z-50 pointer-events-none"></div>
            
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src={BEAT_URL} preload="auto" />
      <audio ref={introAudioRef} src={INTRO_MUSIC_URL} preload="auto" />
    </div>
  );
}