import React, { useState, useEffect, useRef } from "react";
import { 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Play, 
  Music, 
  HelpCircle, 
  Smile,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 5;
const ROUND_TIME = 30;

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
  { emojis: ["🩷", "👀"], answer: "Gulabi Ankhein" },
  { emojis: ["1️⃣", "👽", "💃", "🤝"], answer: "Ek ajnabee haseena se" },
  { emojis: ["💭", "👸", "🚂", "🌄"], answer: "Mere sapno ki rani" },
  { emojis: ["🤝", "❌", "💔", "🏍️"], answer: "Yeh dosti hum nahi todenge" },
  { emojis: ["⌚", "⌚", "❤️", "💭"], answer: "Kabhi kabhi mere dil mein" },
  { emojis: ["⏳", "⏳", "❤️", "📍"], answer: "Pal pal dil ke paas" },
  { emojis: ["⚫", "⚫", "👀"], answer: "Yeh kaali kaali aankhen" },
  { emojis: ["🌾", "🎸", "👀", "❤️"], answer: "Tujhe dekha to ye jana sanam" },
  { emojis: ["😄", "😄", "😢", "😢"], answer: "Kabhi khushi kabhie gham" },
];

/* ================= MOTION VARIANTS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// SIMPLIFIED VARIANTS (No Spring Physics)
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.5 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    // Using 'backOut' creates a pop effect without the heavy calculation of a spring
    transition: { duration: 0.4, ease: "backOut" } 
  }
};

/* ================= COMPONENT ================= */
export default function Songguess() {
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [roundData, setRoundData] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {
     const shuffled = [...SONG_CARDS].sort(() => 0.5 - Math.random());
     setRoundData(shuffled.slice(0, TOTAL_ROUNDS));
  }, [isGameStarted]);

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
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setTimeLeft(ROUND_TIME);
      setIsRoundActive(true);
      setShowAnswer(false);
    } else {
      setIsGameOver(true);
    }
  };

  const restartGame = () => {
    setRound(1);
    setTimeLeft(ROUND_TIME);
    setIsRoundActive(false);
    setIsGameStarted(false);
    setIsGameOver(false);
    setShowAnswer(false);
    const shuffled = [...SONG_CARDS].sort(() => 0.5 - Math.random());
    setRoundData(shuffled.slice(0, TOTAL_ROUNDS));
  };

  const currentCard = roundData[round - 1];

  return (
    <div className="h-[calc(100vh-54px)] w-full flex flex-col items-center bg-transparent overflow-hidden">
      
      {/* Round Pill - Top Right */}
      {isGameStarted && !isGameOver && (
          <div className="absolute right-4 top-4 z-30 bg-black/40 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              Round {round}/{TOTAL_ROUNDS}
          </div>
      )}

      {/* --- HEADER --- */}
      <div className="shrink-0 w-full relative flex items-center justify-center h-20 sm:h-24 z-20 mt-4 sm:mt-8 mb-4">
          {!isGameStarted || isGameOver ? (
              <div className="flex flex-col items-center z-10 animate-in fade-in duration-300">
                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
                     🎵 Guess the Song 🎵
                  </h1>
                  <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full opacity-80 shadow-[0_0_15px_rgba(239,68,68,0.5)] mt-2"></div>
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

      {/* --- MAIN CONTENT CENTER --- */}
      <div className="flex-1 w-full min-h-0 flex flex-col justify-center items-center relative">
          
          {/* Start / Tutorial Screen */}
          {!isGameStarted && !isGameOver && (
          <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8 w-full max-w-3xl px-6"
          >
              <div className="grid grid-cols-3 gap-4 w-full">
                  {[
                      { icon: <Smile className="w-10 h-10 sm:w-12 sm:h-12 text-blue-300" />, title: "Look", desc: "Read emojis" },
                      { icon: <Music className="w-10 h-10 sm:w-12 sm:h-12 text-green-300" />, title: "Think", desc: "Guess song" },
                      { icon: <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-300" />, title: "Solve", desc: "See answer" },
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

          {/* Game Active */}
          {isGameStarted && !isGameOver && currentCard && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                
                <div className="w-full max-w-5xl flex flex-col h-full gap-6">
                    
                    {/* 1. Emoji & Answer Area */}
                    <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-2 w-full">
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            key={round}
                            className="flex flex-col items-center justify-center gap-10 w-full"
                        >
                            {/* Huge Emojis with + Sign */}
                            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-8">
                                {currentCard.emojis.map((emoji, i) => (
                                     <React.Fragment key={i}>
                                        <motion.div 
                                            variants={itemVariants}
                                            className="text-6xl sm:text-6xl md:text-8xl filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default"
                                        >
                                            {emoji}
                                        </motion.div>

                                        {i < currentCard.emojis.length - 1 && (
                                            <motion.div 
                                                variants={itemVariants}
                                                className="text-4xl sm:text-6xl font-bold text-white/30 select-none pb-2 sm:pb-4"
                                            >
                                                +
                                            </motion.div>
                                        )}
                                     </React.Fragment>
                                ))}
                            </div>

                            {/* Answer Reveal Box */}
                            <AnimatePresence mode="wait">
                                {showAnswer && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white/10 backdrop-blur-md border-2 border-white/20 px-10 py-6 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] text-center max-w-4xl mx-4"
                                    >
                                        <p className="text-slate-300 text-sm sm:text-base font-bold uppercase tracking-widest mb-2">The Song Is</p>
                                        <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-md leading-tight text-balance">
                                            {currentCard.answer}
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* 2. The Bottom Buttons - Right Aligned & Bouncy */}
                    <div className="h-16 shrink-0 w-full flex justify-end items-start z-20">
                        {!showAnswer ? (
                            <button
                                onClick={handleShowAnswer}
                                className="px-8 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.7)] hover:scale-105 transition-all border-t border-yellow-300"
                            >
                                Show Answer
                            </button>
                        ) : (
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
                                {round < TOTAL_ROUNDS ? "Next Round →" : "Finish Game"}
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
              onClick={restartGame}
              className="flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-bold text-xl shadow-lg hover:bg-white/20 transition-all hover:-translate-y-1"
              >
              <RotateCcw size={24} className="text-red-400" /> Play Again
              </button>
          </motion.div>
          )}
      </div>
      
      {(!isGameStarted || isGameOver) && <div className="h-4 shrink-0"></div>}

    </div>
  );
}