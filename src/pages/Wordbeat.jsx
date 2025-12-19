import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

/* ================= CONFIG ================= */
const TOTAL_ROUNDS = 5;
const TILES = 8;
const ROUND_DURATION = 2400;
const TILE_INTERVAL = ROUND_DURATION / TILES;

const STAGGER_START = 1000;
const HIGHLIGHT_START = 5000;

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
];

const BEAT_URL = "whistle_crop.mp3";

/* ================= HELPERS ================= */
const getEmojiName = (emoji) => {
  const MAP = {
    "🐱": "Cat",
    "🎩": "Hat",
    "🦇": "Bat",
    "🔑": "Key",
    "🌳": "Tree",
    "3️⃣": "Three",
    "🐶": "Dog",
    "🪵": "Log",
    "🐸": "Frog",
    "🧦": "Sock",
    "🪨": "Rock",
    "🔒": "Lock",
    "🐝": "Bee",
    "🍵": "Tea",
    "📌": "Pin",
    "🖊️": "Pen",
    "🍳": "Pan",
  };
  return MAP[emoji] || "";
};

const isEmoji = (value) => /\p{Extended_Pictographic}/u.test(value);

/* ================= COMPONENT ================= */
export default function Wordbeat() {
  const [round, setRound] = useState(1);
  const [activeTile, setActiveTile] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [countdownText, setCountdownText] = useState("");

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

  const clearAllTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const scheduleRound = (roundIdx) => {
    const roundNumber = roundIdx + 1;
    setRoundComplete(false);

    audioRef.current.currentTime = 0;
    audioRef.current.play();

    setTimeout(() => {
      setRound(roundNumber);
      setIsAnimatingIn(true);
      setActiveTile(-1);
    }, STAGGER_START);

    const countdownSteps = [
      { time: 4000, value: "1" },
      { time: 4350, value: "2" },
      { time: 4700, value: "3" },
      { time: 4890, value: "GO" },
    ];

    countdownSteps.forEach(({ time, value }) => {
      timeoutsRef.current.push(
        setTimeout(() => setCountdownText(value), time)
      );
    });

    timeoutsRef.current.push(
      setTimeout(() => setCountdownText(""), 5000)
    );

    timeoutsRef.current.push(
      setTimeout(() => {
        setIsAnimatingIn(false);
        let i = 0;

        const interval = setInterval(() => {
          setActiveTile(i++);
          if (i >= TILES) {
            clearInterval(interval);
            setTimeout(() => {
              setActiveTile(-1);
              setRoundComplete(true);
              audioRef.current.pause();
              if (roundNumber === TOTAL_ROUNDS) setIsGameOver(true);
            }, TILE_INTERVAL);
          }
        }, TILE_INTERVAL);

        timeoutsRef.current.push(interval);
      }, HIGHLIGHT_START)
    );
  };

  const startGame = () => {
    setHasStarted(true);
    scheduleRound(0);
  };

  const nextRound = () => {
    clearAllTimers();
    scheduleRound(round);
  };

  const restartGame = () => window.location.reload();

  useEffect(() => () => clearAllTimers(), []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md sm:max-w-xl text-center relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-700 mb-2">
          🥁 Word Beat Challenge 🥁
        </h1>
        <p className="text-gray-500 italic text-lg mb-4">
          Master the rhythm of the set!
        </p>

        {!hasStarted && (
          <>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left">
              <p className="font-bold text-red-800 mb-2">Tutorial:</p>
              <ul className="list-disc list-inside text-lg space-y-1">
                <li>Watch tiles light up on the beat</li>
                <li>Say the matching word or sound</li>
                <li>Speed increases every round</li>
                <li>Final round is a word challenge</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl font-bold text-xl shadow-xl"
            >
              🎅 Start Game
            </button>
          </>
        )}

        {hasStarted && !isGameOver && (
          <>
            {/* ROUND + WORD */}
            <div className="mb-4 space-y-2">
              <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                Round {round} / {TOTAL_ROUNDS}
              </span>

              {activeTile >= 0 &&
                getEmojiName(emojiSets[round - 1][activeTile]) && (
                  <div className="text-2xl sm:text-3xl font-semibold text-red-700">
                    "{getEmojiName(emojiSets[round - 1][activeTile])}"
                  </div>
                )}
            </div>

            {/* 1-2-3-GO (PRESERVED) */}
            {countdownText && (
              <div className="mb-2 text-4xl sm:text-5xl font-black text-red-600 animate-pulse">
                {countdownText}
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {emojiSets[round - 1].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-2xl border-4 transition-all
                    ${
                      isEmoji(item)
                        ? "text-5xl sm:text-6xl"
                        : "text-3xl sm:text-4xl font-semibold"
                    }
                    ${isAnimatingIn ? "animate-entry" : ""}
                    ${
                      activeTile === i
                        ? "border-red-500 bg-red-50 scale-110 shadow-xl"
                        : "border-gray-200 bg-white"
                    }`}
                  style={{ padding: "clamp(1.25rem, 4vw, 2rem)" }}
                >
                  {item}
                </div>
              ))}
            </div>

            {roundComplete && round < TOTAL_ROUNDS && (
              <button
                onClick={nextRound}
                className="mt-6 px-10 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl"
              >
                Next Round
              </button>
            )}
          </>
        )}

        {isGameOver && (
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-red-500">FINISHED</h2>
            <button
              onClick={restartGame}
              className="mx-auto flex items-center gap-2 px-8 py-3 bg-white rounded-xl font-bold"
            >
              <RotateCcw size={16} /> Play Again
            </button>
          </div>
        )}

        <audio ref={audioRef} src={BEAT_URL} preload="auto" />
      </div>

      <style>{`
        @keyframes entry {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.7);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-entry {
          animation: entry 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
