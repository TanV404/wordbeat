import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RotateCcw,
  Play,
  Music,
  HelpCircle,
  Smile,
  Timer,
  Disc3,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= DATA ================= */
const SONG_CARDS = [
  { emojis: ["🟦", "🟦", "🌃", "🌕", "💓"], answer: "Neele neele ambar" },
  { emojis: ["😄", "😄", "✂️", "🛣️"], answer: "Haste haste kat jayen raste" },
  { emojis: ["🚶", "🚶‍➡️", "🤷‍♂️", "🚶"], answer: "Idhaar chala me udhar chala" },
  // { emojis: ["🔫", "🧠", "🧠", "🔊"], answer: "Goli maar bheje mein" },
  { emojis: ["☀️", "🌅", "🌕", "🔥"], answer: "Sooraj hua madham" },
  { emojis: ["7️⃣", "🌊", "🏃‍♀️"], answer: "Sath samundar paar" },
  { emojis: ["⭕", "🦢"], answer: "O Hansini" },
  { emojis: ["🕉️", "👧", "🕉️"], answer: "Om Shanti Om" },
  { emojis: ["🚶‍➡️", "🚶‍➡️", "🎵", "🙋‍♂️", "❌"], answer: "Chalte chalte" },
  { emojis: ["🌸", "🎨", "💓", "🖊️", "📝"], answer: "Phoolon ke rang se" },
  { emojis: ["👀","😃", "😊"], answer: "Ankhein khuli ho ya ho band" },
  { emojis: ["🫵", "🧀", "👌", "👌"], answer: "Tu cheez badi hai mast mast" },
  { emojis: ["1️⃣", "👧", "👀", "😇"], answer: "Ek ladki ko dekha toh aisa laga" },
  { emojis: ["👀", "🔫", "👧", "👌"], answer: "Ankhiyoon se goli maare" },
  { emojis: ["🕐", "🪩", "💃", "🕺"], answer: "It's the time to disco" },
  { emojis: ["🌹", "👀"], answer: "Gulabi Ankhein" },
  { emojis: ["1️⃣", "👽", "💃", "🤝"], answer: "Ek ajnabee haseena se" },
  { emojis: ["💭", "👸", "🚂", "🌄"], answer: "Mere sapno ki rani" },
  { emojis: ["👉","🤝", "❌", "💔", "🏍️"], answer: "Yeh dosti hum nahi todenge" },
  { emojis: ["❓", "❓", "❤️", "💭"], answer: "Kabhi kabhi mere dil mein" },
  { emojis: ["⏳", "⏳", "❤️", "🎟️"], answer: "Pal pal dil ke paas" },
  { emojis: ["👉","⚫", "⚫", "👀"], answer: "Yeh kaali kaali aankhen" },
  { emojis: ["😄", "😢", "😄", "😢"], answer: "Kabhi khushi kabhie gham" },
  { emojis: ["🍃", "7️⃣", "7️⃣","🌥️" ], answer: "Hawa ke saath saath" },
  { emojis: ["👉", "🌃", "👉","🌥️" ], answer: "Yeh raate yeh mausam" },
  { emojis: ["⭕","🙋‍♂️", "💓", "🔗" ], answer: "O mere dil ke chain" },
  { emojis: ["🖊️","💌", "🫵" ], answer: "Likhe joh khat tujhe" },
];

/* ================= CONFIG ================= */
const ROUND_TIME = 30;

/* ================= MOTION VARIANTS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.5 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: "backOut" } 
  }
};

export default function Songguess() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [roundData, setRoundData] = useState([]);

  const timerRef = useRef(null);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isGameStarted && roundData.length === 0) {
      const shuffled = [...SONG_CARDS].sort(() => 0.5 - Math.random());
      setRoundData(shuffled);
    }
  }, [isGameStarted, roundData.length]);

  useEffect(() => {
    if (!isRoundActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setIsRoundActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRoundActive]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsRoundActive(true);
    setTimeLeft(ROUND_TIME);
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    clearInterval(timerRef.current);
    setShowAnswer(true);
    setIsRoundActive(false);
  };

  const nextRound = () => {
    if (round < roundData.length) {
      setRound((prev) => prev + 1);
      setTimeLeft(ROUND_TIME);
      setIsRoundActive(true);
      setShowAnswer(false);
    } else {
      restartGame();
    }
  };

  const restartGame = () => {
    setRound(1);
    setTimeLeft(ROUND_TIME);
    setIsRoundActive(false);
    setIsGameStarted(false);
    setShowAnswer(false);
    setRoundData([]); 
  };

  const currentCard = roundData[round - 1];
  const isLastRound = roundData.length > 0 && round === roundData.length;

  return (
    // Uses h-full to fit within App.js layout
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
               className="z-10 flex flex-col items-center gap-6 lg:gap-10 px-4"
             >
               <div className="text-center">
                 <div className="relative mb-6 lg:mb-10 flex justify-center">
                    {/* Responsive Spinner Size */}
                    <Disc3 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-yellow-500 animate-[spin_3s_linear_infinite]" />
                 </div>

                 {/* Responsive Title Text */}
                 <h2 className="text-sm min-[350px]:text-base sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-black text-white tracking-widest uppercase flex flex-row items-center gap-2 sm:gap-3 justify-center mb-4 lg:mb-8 whitespace-nowrap">
                   Curating Emoji-Encoded Music <Sparkles className="text-yellow-400 animate-pulse w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10" />
                 </h2>
                 
                 <div className="flex flex-col items-center gap-4 lg:gap-8">
                   <p className="text-yellow-500 text-xs sm:text-sm lg:text-xl font-bold tracking-[0.3em] uppercase animate-pulse">
                     Translate symbols into songs...
                   </p>
                   
                   <div className="w-48 sm:w-64 lg:w-96 h-1.5 lg:h-3 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ x: "-100%" }}
                       animate={{ x: "0%" }}
                       transition={{ duration: 2.5, ease: "easeInOut" }}
                       className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                     />
                   </div>
                 </div>
               </div>
             </motion.div>
           </motion.div>
        ) : (
          
          /* --- MAIN GAME CONTAINER --- */
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full h-full flex flex-col relative"
          >
            {/* Round Indicator */}
            {isGameStarted && roundData.length > 0 && (
                <div className="absolute right-3 top-3 sm:right-6 sm:top-6 lg:right-10 lg:top-8 z-30 bg-black/40 backdrop-blur-md border border-green-500/30 text-green-300 px-3 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full font-bold text-xs sm:text-sm lg:text-lg shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                    Round {round}/{roundData.length}
                </div>
            )}

            {/* HEADER */}
            <div className="flex-none h-[15vh] min-h-[80px] max-h-[140px] w-full flex items-end justify-center pb-2 z-20">
                {!isGameStarted ? (
                    <div className="flex flex-col items-center z-10 animate-in fade-in duration-300">
                        {/* Responsive Header Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center">
                           🎵 Guess the Song 🎵
                        </h1>
                        <div className="h-1 w-20 sm:w-32 lg:w-48 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mt-2 sm:mt-4 shadow-[0_0_15px_rgba(239,68,68,0.5)] opacity-80"></div>
                    </div>
                ) : (
                    <motion.div 
                        key="timer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        // Responsive Timer
                        className={`flex items-center gap-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] z-10 ${timeLeft < 10 ? "text-red-400 animate-pulse" : "text-white"}`}
                    >
                        <Timer className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" strokeWidth={2.5} />
                        <span>{timeLeft}s</span>
                    </motion.div>
                )}
            </div>

            {/* MIDDLE: CONTENT */}
            <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center px-4">
                
                {/* TUTORIAL */}
                {!isGameStarted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-8 lg:gap-12 w-full max-w-4xl lg:max-w-6xl h-full">
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-10 w-full">
                        {[
                            { icon: <Smile className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-blue-300" />, title: "LOOK", desc: "Read emojis" },
                            { icon: <Music className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-green-300" />, title: "THINK", desc: "Guess song" },
                            { icon: <HelpCircle className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-red-300" />, title: "SOLVE", desc: "See answer" },
                        ].map((step, idx) => (
                            <div key={idx} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 sm:p-6 lg:p-8 flex flex-col items-center text-center shadow-lg backdrop-blur-sm">
                                <div className="mb-2 sm:mb-4 lg:mb-6 p-2 sm:p-3 lg:p-4 bg-white/5 rounded-full shadow-inner">{step.icon}</div>
                                <h3 className="font-bold text-white mb-1 text-xs sm:text-lg lg:text-2xl uppercase tracking-wider">{step.title}</h3>
                                <p className="text-[10px] sm:text-sm lg:text-lg text-slate-400 leading-tight">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={startGame}
                        // Massive Start Button for Desktop
                        className="group relative w-full max-w-xs lg:max-w-md px-8 py-4 lg:px-14 lg:py-6 bg-gradient-to-b from-red-600 to-red-800 text-white rounded-2xl font-bold text-lg sm:text-2xl lg:text-4xl shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden border-t border-red-400"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12 origin-bottom"></div>
                        <span className="relative flex items-center justify-center gap-3 lg:gap-5">
                            <Play fill="currentColor" className="w-6 h-6 lg:w-10 lg:h-10" /> Start Game
                        </span>
                    </button>
                </motion.div>
                )}

                {/* GAME ACTIVE */}
                {isGameStarted && currentCard && (
                    <div className="w-full max-w-4xl lg:max-w-6xl flex flex-col items-center justify-center h-full gap-6 sm:gap-10">
                         <motion.div variants={containerVariants} initial="hidden" animate="show" key={round} className="flex flex-col items-center justify-center gap-6 sm:gap-10 w-full">
                            {/* Emojis - Scaled for Desktop (lg:text-9xl) */}
                            <div className="flex flex-nowrap items-center justify-center gap-1 sm:gap-3 md:gap-6 lg:gap-8 w-full">
                                {currentCard.emojis.map((emoji, i) => (
                                    <React.Fragment key={i}>
                                        <motion.div 
                                          variants={itemVariants} 
                                          className="text-3xl min-[400px]:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default whitespace-nowrap"
                                        >
                                            {emoji}
                                        </motion.div>
                                        {i < currentCard.emojis.length - 1 && (
                                            <motion.div 
                                              variants={itemVariants} 
                                              className="text-xl min-[400px]:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/30 select-none pb-1 sm:pb-3"
                                            >
                                              +
                                            </motion.div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Answer Box - Scaled for Desktop */}
                            <AnimatePresence mode="wait">
                                {showAnswer && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                                        exit={{ opacity: 0, scale: 0.9 }} 
                                        className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 sm:px-10 sm:py-8 lg:px-16 lg:py-10 rounded-3xl text-center w-full max-w-3xl lg:max-w-5xl shadow-[0_0_30px_rgba(0,0,0,0.3)] mt-2"
                                    >
                                        <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-widest mb-2 lg:mb-4">The Song Is</p>
                                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                            {currentCard.answer}
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* FOOTER CONTROLS */}
            {isGameStarted && (
                <div className="flex-none h-[100px] lg:h-[140px] w-full px-4 flex justify-center items-start pt-4 z-20">
                      <div className="w-full max-w-4xl lg:max-w-6xl flex justify-end items-center">
                        {!showAnswer ? (
                            <button onClick={handleShowAnswer} className="px-6 py-3 sm:px-8 sm:py-3 lg:px-12 lg:py-5 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl lg:text-2xl shadow-lg hover:scale-105 transition-all border-t border-yellow-300">
                                Show Answer
                            </button>
                        ) : (
                            <motion.button
                                onClick={nextRound}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className={`px-6 py-3 sm:px-8 sm:py-3 lg:px-12 lg:py-5 bg-gradient-to-b text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl lg:text-2xl shadow-lg hover:scale-105 transition-all border-t ${
                                    isLastRound 
                                    ? "from-blue-500 to-blue-700 border-blue-400" 
                                    : "from-green-500 to-green-700 border-green-400"
                                }`}
                            >
                                {isLastRound ? (
                                    <span className="flex items-center gap-2"><RotateCcw size={20} className="lg:w-7 lg:h-7" /> Play Again</span>
                                ) : (
                                    "Next Round →"
                                )}
                            </motion.button>
                        )}
                      </div>
                </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}