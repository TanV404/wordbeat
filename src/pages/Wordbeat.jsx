import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 5;
const TILES = 8;
const ROUND_DURATION = 2000; // 2 seconds to complete all 8 tiles
const TILE_INTERVAL = ROUND_DURATION / TILES; // 250ms per tile (4 tiles/sec)

// Timings based on your specific requirements (in milliseconds)
const START_TIMINGS = [6000, 11000, 16000, 21000, 26000];
const STAGGER_TIMINGS = [3000, 8000, 13000, 18000, 23000];

const WORD_SETS_POOL = [
  ["🐱", "🎩", "🦇"],
  ["🔑", "🌳", "3️⃣"],
  ["🐶", "🪵", "🐸"],
  ["🧦", "🪨", "🔒"],
  ["snow", "slow", "glow"],
  ["run", "sun", "fun"],
];

const BEAT_URL = "whistle.mp3";

export default function Wordbeat() {
  const [round, setRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Pick one set randomly for the entire game
  const [emojiSets] = useState(() => {
    const set =
      WORD_SETS_POOL[Math.floor(Math.random() * WORD_SETS_POOL.length)];
    return Array.from({ length: TOTAL_ROUNDS }, () =>
      Array.from(
        { length: TILES },
        () => set[Math.floor(Math.random() * set.length)]
      )
    );
  });

  const audioRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Cleanup function for all timers
  const clearAllTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const scheduleRound = (roundIdx) => {
    const roundNumber = roundIdx + 1;

    // 1. Trigger Staggered Animated Entry
    const entryTimer = setTimeout(() => {
      setRound(roundNumber);
      setIsAnimatingIn(true);
      setActiveTile(-1); // Reset highlight during entry
    }, STAGGER_TIMINGS[roundIdx]);

    // 2. Start Highlight Sequence
    const highlightTimer = setTimeout(() => {
      setIsAnimatingIn(false);
      let currentTile = 0;

      const beatInterval = setInterval(() => {
        setActiveTile(currentTile);
        currentTile++;

        if (currentTile >= TILES) {
          clearInterval(beatInterval);

          // Fix: Reset last tile highlight after 250ms
          setTimeout(() => {
            setActiveTile(-1);
          }, TILE_INTERVAL);

          // End of game logic
          if (roundNumber === TOTAL_ROUNDS) {
            if (audioRef.current) {
              audioRef.current.pause(); // Stop music
            }
            setTimeout(() => setIsGameOver(true), 1000);
          }
        }
      }, TILE_INTERVAL);

      timeoutsRef.current.push(beatInterval);
    }, START_TIMINGS[roundIdx]);

    timeoutsRef.current.push(entryTimer, highlightTimer);
  };

  const startGame = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    // Schedule all rounds immediately based on the master timeline
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      scheduleRound(i);
    }
  };

  const restartGame = () => {
    clearAllTimers();
    window.location.reload(); // Ensures a clean state reset
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 w-full max-w-lg text-center">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-red-700">
            🥁 Word Beat Challenge 🥁
          </h1>
          <p className="text-gray-500 mb-4 italic">
            Master the rhythm of the set!
          </p>
        </header>

        <main className="flex flex-col justify-center">
          {!hasStarted && (
            <div className="space-y-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left text-gray-700">
                <p className="font-bold text-red-800 mb-2">Game Tutorial:</p>
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
                    className={`h-24 flex items-center justify-center rounded-2xl border-4 text-4xl transition-all
                  ${
                    isAnimatingIn
                      ? "animate-entry"
                      : "opacity-100 translate-y-0"
                  }
                  ${
                    activeTile === i
                      ? "border-red-500 bg-red-50 scale-110 shadow-lg z-10"
                      : "border-gray-200 bg-white"
                  }`}
                    style={{
                      animationDelay: isAnimatingIn ? `${i * 0.15}s` : "0s",
                      transitionDuration: "100ms",
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
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
