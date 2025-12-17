import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

/* ================= CONFIG ================= */

const TOTAL_ROUNDS = 5;
const TILES = 8;
const BEATS_PER_ROUND = 8;
const ROUND_BPM = [100, 120, 140, 160, 180];

// The Master Pool of Sets (Rhyme Families)
const WORD_SETS_POOL = [
  ["🐱", "🎩", "🦇"], // Cat, Hat, Bat
  ["🔑", "🌳", "3️⃣"], // Key, Tree, Three
  ["🐶", "🪵", "🐸"], // Dog, Log, Frog
  ["🍎", "🍍", "🍌"],
  ["🚗", "⭐", "Jar"],
  ["🐝", "🍵", "🔑"],
];

const BEAT_URL = "metronome.mp3";

/* ================= HELPERS ================= */

/**
 * Logic: Pick ONE set for the whole game, 
 * then generate 5 rounds of shuffled sequences with repetition allowed.
 */
function initializeGameData() {
  // 1. Pick exactly one set randomly
  const selectedSet = WORD_SETS_POOL[Math.floor(Math.random() * WORD_SETS_POOL.length)];
  
  const allRounds = [];
  
  for (let r = 0; r < TOTAL_ROUNDS; r++) {
    const roundSequence = [];
    for (let b = 0; b < BEATS_PER_ROUND; b++) {
      // 2. Allow repetition by picking any item from the fixed set for every beat
      const randomItem = selectedSet[Math.floor(Math.random() * selectedSet.length)];
      roundSequence.push(randomItem);
    }
    allRounds.push(roundSequence);
  }
  
  return allRounds;
}

/* ================= COMPONENT ================= */

export default function New() {
  const [round, setRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [roundJustStarted, setRoundJustStarted] = useState(false);
  
  // This state now holds 5 rounds of the SAME set in different shuffled orders
  const [emojiSets, setEmojiSets] = useState(initializeGameData());

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const beatCountRef = useRef(0);

  const bpm = ROUND_BPM[round - 1];
  const beatInterval = (60 / bpm) * 1000;
  const currentEmojis = emojiSets[round - 1];

  /* ================= GAME LOOP ================= */

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      beatCountRef.current += 1;
      setActiveTile((prev) => (prev + 1) % TILES);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {}); // Catch browser audio block
      }

      if (beatCountRef.current >= BEATS_PER_ROUND) {
        clearInterval(intervalRef.current);
        // Add a slight delay before showing next round or ending
        setTimeout(handleRoundEnd, 400);
      }
    }, beatInterval);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, beatInterval]);

  useEffect(() => {
    if (!hasStarted) return;
    setRoundJustStarted(true);
    const t = setTimeout(() => setRoundJustStarted(false), 400);
    return () => clearTimeout(t);
  }, [round, hasStarted]);

  /* ================= ACTIONS ================= */

  const startGame = async () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handleRoundEnd = () => {
    beatCountRef.current = 0;
    setActiveTile(-1);

    if (round < TOTAL_ROUNDS) {
      setRound((r) => r + 1);
      // Automatically trigger next round sequence
      setTimeout(() => setIsPlaying(true), 600);
    } else {
      setIsPlaying(false);
      setIsGameOver(true);
    }
  };

  const restartGame = () => {
    setRound(1);
    setActiveTile(-1);
    setHasStarted(false);
    setIsGameOver(false);
    beatCountRef.current = 0;
    setIsPlaying(false);
    // Logic: New game, new random set
    setEmojiSets(initializeGameData());
  };

  const togglePlayPause = () => {
    if (!hasStarted) {
      startGame();
      return;
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 text-center">
        <h1 className="text-2xl font-extrabold text-red-700 mb-2">
          🥁 Word Beat 🥁
        </h1>
        <p className="text-gray-500 mb-6 italic">Master the rhythm of the set!</p>

        {!hasStarted && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left text-gray-700">
            <p className="font-bold text-red-800 mb-2">Algorithm Rules:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>One random "Word Family" chosen per game.</li>
              <li>Patterns are <strong>randomly shuffled</strong> every round.</li>
              <li><strong>Repetition</strong> is allowed (stay alert!).</li>
              <li>Tempo increases: 100 → 180 BPM.</li>
            </ul>
          </div>
        )}

        {hasStarted && !isGameOver && (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                Round {round} / {TOTAL_ROUNDS}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {bpm} BPM
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {currentEmojis.map((emoji, i) => (
                <div
                  key={`${round}-${i}`}
                  className={`tile-animate ${
                    roundJustStarted ? "tile-fade-in" : ""
                  } h-20 flex items-center justify-center rounded-xl border-4 text-3xl
                  transition-all duration-150
                  ${
                    activeTile === i
                      ? "border-red-500 bg-red-50 scale-110 shadow-lg z-10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </>
        )}

        {isGameOver && (
          <div className="py-8">
            <h2 className="text-3xl font-bold text-green-600 mb-2">Game Complete!</h2>
            <p className="text-gray-600 mb-6">You kept up with the beat!</p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          {isGameOver ? (
            <button
              onClick={restartGame}
              className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-green-700 transition"
            >
              <RotateCcw className="inline mr-2" /> Play Again
            </button>
          ) : (
            <button
              onClick={togglePlayPause}
              className={`px-8 py-3 rounded-xl text-lg font-bold text-white shadow-lg transition
                ${!hasStarted ? "bg-red-600 hover:bg-red-700" : 
                  isPlaying ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {!hasStarted ? "Start Challenge" : isPlaying ? "Pause" : "Resume"}
            </button>
          )}
        </div>

        <audio ref={audioRef} src={BEAT_URL} preload="auto" />
      </div>

      <style>{`
        .tile-animate {
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .tile-fade-in {
          animation: slideUp 0.5s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}