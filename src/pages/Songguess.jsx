import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Play,
  Music,
  HelpCircle,
  Smile,
  Timer,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= DATA ================= */
const SONG_CARDS = [
  { emojis: ["🟦", "🟦", "🌃", "🌕", "💓"], answer: "Neele neele ambar" },
  { emojis: ["😄", "😄", "✂️", "🚗"], answer: "Haste haste kat jayen raste" },
  { emojis: ["🚶", "🚶‍➡️", "🤷‍♂️", "🚶"], answer: "Idhaar chala me udhar chala" },
  { emojis: ["🔫", "🧠", "🧠", "🔊"], answer: "Goli maar bheje mein" },
  { emojis: ["☀️", "🌅", "🌕", "🔥"], answer: "Sooraj hua madham" },
  { emojis: ["7️⃣", "🌊", "🏃‍♀️"], answer: "Sath samundar paar" },
  { emojis: ["⭕", "🦢"], answer: "O Hansini" },
  { emojis: ["🕉️", "👧", "🕉️"], answer: "Om Shanti Om" },
  { emojis: ["🚶‍➡️", "🚶‍➡️", "🎵", "🙋‍♂️", "❌"], answer: "Chalte chalte" },
  { emojis: ["🌸", "🎨", "💓", "🖊️", "📝"], answer: "Phoolon ke rang se" },
  { emojis: ["😃", "😊"], answer: "Ankhein khuli ho ya ho band" },
  { emojis: ["2️⃣", "🧀", "👌", "👌"], answer: "Tu cheez badi hai mast mast" },
  { emojis: ["1️⃣", "👧", "👀", "😇"], answer: "Ek ladki ko dekha toh aisa laga" },
  { emojis: ["👀", "🔫", "👧", "👌"], answer: "Ankhiyoon se goli maare" },
  { emojis: ["🕐", "🪩", "💃", "🕺"], answer: "It's the time to disco" },
  { emojis: ["🌹", "👀"], answer: "Gulabi Ankhein" },
  { emojis: ["1️⃣", "👽", "💃", "🤝"], answer: "Ek ajnabee haseena se" },
  { emojis: ["💭", "👸", "🚂", "🌄"], answer: "Mere sapno ki rani" },
  { emojis: ["🤝", "❌", "💔", "🏍️"], answer: "Yeh dosti hum nahi todenge" },
  { emojis: ["⌚", "⌚", "❤️", "💭"], answer: "Kabhi kabhi mere dil mein" },
  { emojis: ["⏳", "⏳", "❤️", "📍"], answer: "Pal pal dil ke paas" },
  { emojis: ["👉","⚫", "⚫", "👀"], answer: "Yeh kaali kaali aankhen" },
  { emojis: ["🌾", "🎸", "👀", "❤️"], answer: "Tujhe dekha to ye jana sanam" },
  { emojis: ["😄", "😄", "😢", "😢"], answer: "Kabhi khushi kabhie gham" },
  { emojis: ["💨", "🍃", "☁️"], answer: "Hawa ke saath saath" },
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
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [roundData, setRoundData] = useState([]);

  const timerRef = useRef(null);

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
    <div className="h-[calc(100vh-54px)] w-full flex flex-col items-center bg-transparent overflow-hidden relative">
      
      {isGameStarted && roundData.length > 0 && (
          <div className="absolute right-8 top-4 z-30 bg-black/40 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full font-bold text-sm sm:text-base shadow-lg flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              Round {round}/{roundData.length}
          </div>
      )}

      <div className="shrink-0 w-full relative flex items-center justify-center h-20 sm:h-24 z-20 mt-4 sm:mt-8 mb-4">
          {!isGameStarted ? (
              <div className="flex flex-col items-center z-10 animate-in fade-in duration-300">
                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
                      🎵 Guess the Song 🎵
                  </h1>
                  <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full opacity-80 mt-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
              </div>
          ) : (
              <motion.div 
                  key="timer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-4 text-5xl sm:text-7xl font-extrabold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] z-10 ${timeLeft < 10 ? "text-red-400 animate-pulse" : "text-white"}`}
              >
                  <Timer className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={2.5} />
                  <span>{timeLeft}s</span>
              </motion.div>
          )}
      </div>

      <div className="flex-1 w-full min-h-0 flex flex-col justify-center items-center relative">
          
          {/* UPDATED TUTORIAL UI (Matching Word Beat Challenge) */}
          {!isGameStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8 w-full max-w-5xl px-6">
              <div className="flex items-center justify-center w-full gap-2 sm:gap-4 relative">
                  {[
                      { icon: <Smile className="w-10 h-10 sm:w-12 sm:h-12 text-blue-300" />, title: "LOOK", desc: "Read emojis" },
                      { icon: <Music className="w-10 h-10 sm:w-12 sm:h-12 text-green-300" />, title: "THINK", desc: "Guess song" },
                      { icon: <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-300" />, title: "SOLVE", desc: "See answer" },
                  ].map((step, idx, arr) => (
                      <React.Fragment key={idx}>
                        {/* 3:4 Aspect Ratio Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-4 flex flex-col items-center text-center shadow-xl hover:bg-slate-800/50 transition-colors z-10 aspect-[4/3] flex-1 max-w-[160px] sm:max-w-[200px] justify-center">
                            <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-white/10 rounded-full shadow-inner">{step.icon}</div>
                            <h3 className="font-bold text-white mb-1 text-base sm:text-xl uppercase tracking-wide">{step.title}</h3>
                            <p className="text-[10px] sm:text-sm text-slate-300 leading-tight">{step.desc}</p>
                        </div>
                        
                        {/* Centered Arrow */}
                        {idx < arr.length - 1 && (
                          <div className="flex items-center justify-center">
                            <motion.div 
                              animate={{ x: [-5, 5, -5] }} 
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                              <ArrowRight className="text-white/20 w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
                            </motion.div>
                          </div>
                        )}
                      </React.Fragment>
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

          {isGameStarted && currentCard && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-5xl flex flex-col h-full gap-6">
                    
                    <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-2 w-full">
                        <motion.div variants={containerVariants} initial="hidden" animate="show" key={round} className="flex flex-col items-center justify-center gap-10 w-full">
                            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-8">
                                {currentCard.emojis.map((emoji, i) => (
                                     <React.Fragment key={i}>
                                        <motion.div variants={itemVariants} className="text-6xl sm:text-8xl filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
                                            {emoji}
                                        </motion.div>
                                        {i < currentCard.emojis.length - 1 && (
                                            <motion.div variants={itemVariants} className="text-4xl sm:text-6xl font-bold text-white/30 select-none pb-2 sm:pb-4">+</motion.div>
                                        )}
                                     </React.Fragment>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {showAnswer && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/10 backdrop-blur-md border-2 border-white/20 px-10 py-6 rounded-3xl text-center max-w-4xl mx-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                                        <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-2">The Song Is</p>
                                        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                                            {currentCard.answer}
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className="h-16 shrink-0 w-full flex justify-end items-start z-20">
                        {!showAnswer ? (
                            <button onClick={handleShowAnswer} className="px-8 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-all border-t border-yellow-300">
                                Show Answer
                            </button>
                        ) : (
                            <motion.button
                                onClick={nextRound}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className={`px-8 py-3 bg-gradient-to-b text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-all border-t ${
                                    isLastRound 
                                    ? "from-blue-500 to-blue-700 border-blue-400" 
                                    : "from-green-500 to-green-700 border-green-400"
                                }`}
                            >
                                {isLastRound ? (
                                    <span className="flex items-center gap-2"><RotateCcw size={20} /> Play Again</span>
                                ) : (
                                    "Next Round →"
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}