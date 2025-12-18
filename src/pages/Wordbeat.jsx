import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 5;
const TILES = 8;
const ROUND_DURATION = 2000; // 2 seconds to complete all 8 tiles
const TILE_INTERVAL = ROUND_DURATION / TILES; // 250ms per tile

const STAGGER_START = 500;   // tiles animate in
const HIGHLIGHT_START = 5500; // highlight starts

const WORD_SETS_POOL = [
  ["🐱", "🎩", "🦇"], ["🔑", "🌳", "3️⃣"], ["🐶", "🪵", "🐸"],
  ["🧦", "🪨", "🔒"], ["🐝", "🍵", "🔑"], ["📌", "🖊️", "🍳"],
  ["snow", "slow", "glow"], ["funny", "money", "sunny"],
  ["wish", "fish", "dish"], ["sing", "ring", "king"],
  ["tic", "tac", "toe"], ["run", "sun", "fun"], ["bell", "well", "tell"], ["sea", "sells", "shells"], 
];

const BEAT_URL = "whistle_crop.mp3";

// Helper to map emoji/text to name
const getEmojiName = (emoji) => {
  const EMOJI_NAMES = {
    "🐱": "Cat", "🎩": "Hat", "🦇": "Bat",
    "🔑": "Key", "🌳": "Tree", "3️⃣": "Three",
    "🐶": "Dog", "🪵": "Log", "🐸": "Frog",
    "🧦": "Sock", "🪨": "Rock", "🔒": "Lock",
    "🐝": "Bee", "🍵": "Tea", "📌": "Pin",
    "🖊️": "Pen", "🍳": "Egg",
  };
  return EMOJI_NAMES[emoji] || ""; // return empty string for words
};

export default function Wordbeat() {
  const [round, setRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const [emojiSets] = useState(() => {
    const set = WORD_SETS_POOL[Math.floor(Math.random() * WORD_SETS_POOL.length)];
    return Array.from({ length: TOTAL_ROUNDS }, () =>
      Array.from({ length: TILES }, () => set[Math.floor(Math.random() * set.length)])
    );
  });

  const audioRef = useRef(null);
  const timeoutsRef = useRef([]);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const scheduleRound = (roundIdx) => {
    const roundNumber = roundIdx + 1;
    setRoundComplete(false);

    // Play beat at round start
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Staggered entry
    const entryTimer = setTimeout(() => {
      setRound(roundNumber);
      setIsAnimatingIn(true);
      setActiveTile(-1);
    }, STAGGER_START);

    // Highlight sequence
    const highlightTimer = setTimeout(() => {
      setIsAnimatingIn(false);
      let currentTile = 0;

      const beatInterval = setInterval(() => {
        setActiveTile(currentTile);
        currentTile++;

        if (currentTile >= TILES) {
          clearInterval(beatInterval);

          setTimeout(() => {
            setActiveTile(-1);
            setRoundComplete(true);

            if (audioRef.current) audioRef.current.pause();

            if (roundNumber === TOTAL_ROUNDS) {
              setTimeout(() => setIsGameOver(true), 800);
            }
          }, TILE_INTERVAL);
        }
      }, TILE_INTERVAL);

      timeoutsRef.current.push(beatInterval);
    }, HIGHLIGHT_START);

    timeoutsRef.current.push(entryTimer, highlightTimer);
  };

  const startGame = () => {
    setHasStarted(true);
    scheduleRound(0);
  };

  const nextRound = () => {
    clearAllTimers();
    scheduleRound(round);
  };

  const restartGame = () => {
    clearAllTimers();
    window.location.reload();
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 w-full max-w-lg text-center">
        <header className="mb-5">
          <h1 className="text-2xl font-bold mb-2 text-red-700">
            🥁 Word Beat Challenge 🥁
          </h1>
          <p className="text-gray-500 mb-4 italic">
            Master the rhythm of the set!
          </p>
        </header>

        <main className="flex flex-col justify-center">
          {!hasStarted && (
            <div className="space-y-1">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left text-gray-700">
                <p className="font-bold text-red-800 mb-2">Tutorial:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Watch tiles light up on the beat.</li>
                  <li>Say the matching word or sound.</li>
                  <li>Speed increases every round.</li>
                  <li>Final round is a word challenge!</li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="px-12 py-4 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-2xl font-semibold text-xl hover:bg-red-500 transition-all active:scale-95 shadow-xl shadow-red-900/20"
              >
                🎅 Start Game
              </button>
            </div>
          )}

          {hasStarted && !isGameOver && (
            <>
              <div className="flex justify-center items-center mb-4 px-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  Round {round} / {TOTAL_ROUNDS}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {emojiSets[round - 1].map((emoji, i) => (
                  <div
                    key={`${round}-${i}`}
                    className={`flex items-center justify-center rounded-2xl border-4 text-3xl transition-all
                      ${isAnimatingIn ? "animate-entry" : ""}
                      ${
                        activeTile === i
                          ? "border-red-500 bg-red-50 scale-110 shadow-lg z-10"
                          : "border-gray-200 bg-white"
                      }`}
                    style={{
                      padding: "1.5rem", // added padding
                      animationDelay: isAnimatingIn ? `${i * 0.15}s` : "0s",
                      transitionDuration: "100ms",
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>

              {/* Display name of highlighted tile only if it's an emoji */}
              {activeTile >= 0 && getEmojiName(emojiSets[round - 1][activeTile]) && (
                <div className="mt-4 text-3xl font-semibold text-red-700">
                  "{getEmojiName(emojiSets[round - 1][activeTile])}"
                </div>
              )}

              {/* Next Round button */}
              {roundComplete && round < TOTAL_ROUNDS && (
                <button
                  onClick={nextRound}
                  className="mt-4 px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95"
                >
                  Next Round
                </button>
              )}
            </>
          )}

          {isGameOver && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <h2 className="text-5xl font-black text-red-500 italic">
                FINISHED
              </h2>
              <button
                onClick={restartGame}
                className="flex items-center gap-2 mx-auto px-8 py-3 bg-white text-black rounded-xl font-bold uppercase text-xs transition-colors"
              >
                <RotateCcw size={16} /> Play Again
              </button>
            </div>
          )}
        </main>

        <audio ref={audioRef} src={BEAT_URL} preload="auto" />
      </div>

      <style>{`
        @keyframes entry {
          0% { opacity: 0; transform: translateY(40px) scale(0.7); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-entry {
          animation: entry 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
