import React, { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 30; // seconds per round

/* ================= DATA ================= */

const SONG_CARDS = [
  { emojis: ["🟦", "🟦", "🌃", "🌕", "💓"], answer: "Neele neele ambar" },
  { emojis: ["😄", "😄", "✂️", "🚗"], answer: "Haste haste kat jayen raste" },
  {
    emojis: ["🚶", "🚶‍➡️", "🤷‍♂️", "🚶"],
    answer: "Idhaar chala me udhar chala",
  },
  { emojis: ["🔫", "🧠", "🧠", "🔊"], answer: "Goli maar bheje mein" },
  { emojis: ["☀️", "🌅", "🌕", "🔥"], answer: "Sooraj hua madham" },
  { emojis: ["7️⃣", "🌊", "🏃‍♀️"], answer: "Sath samundar paar" },
  { emojis: ["⭕", "🦢"], answer: "O Hansini" },
  { emojis: ["🕉️", "👧", "🕉️"], answer: "Om Shanti Om" },
  { emojis: ["🚶‍➡️", "🚶‍➡️", "🎵", "❌", "🙋‍♂️"], answer: "Chalte chalte" },
  { emojis: ["🌸", "🎨", "💓", "🖊️", "📝"], answer: "Phoolon ke rang se" },
  { emojis: ["😃", "😊"], answer: "Ankhein khuli ho ya ho band" },
  { emojis: ["2️⃣", "🧀", "👌", "👌"], answer: "Tu cheez badi hai mast mast" },
];

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

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!isRoundActive) return;

    setTimeLeft(ROUND_TIME);
    setShowAnswer(false);

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
  }, [round, isRoundActive]);

  /* ================= GAME FLOW ================= */

  const startGame = () => {
    const shuffled = [...SONG_CARDS].sort(() => 0.5 - Math.random());
    setRoundData(shuffled.slice(0, TOTAL_ROUNDS));
    setIsGameStarted(true);
    setIsRoundActive(true);
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
    setRoundData([]);
  };

  const buttonClass =
    "mt-6 px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-semibold text-white text-lg sm:text-xl shadow-lg transform transition-all hover:scale-105 flex items-center justify-center mx-auto";

  /* ================= UI ================= */

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 w-full max-w-lg text-center">
        <header className="mb-5">
          <h1 className="text-2xl font-bold mb-4 text-red-700">
            🎵 Guess the Song 🎵
          </h1>
          <p className="text-gray-500 mb-4 italic">
            Decode the emojis and guess the song before time runs out!
          </p>
        </header>

        {!isGameStarted && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left text-gray-700">
            <p className="font-bold text-red-800 mb-2">Game Tutorial:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Look at the emojis displayed.</li>
              <li>Guess the song they represent.</li>
              <li>Use the "Show Answer" button if you are stuck.</li>
              <li>Click "Next Round" to continue.</li>
            </ul>
          </div>
        )}

        {!isGameStarted ? (
          <button
            onClick={startGame}
            className={`${buttonClass} bg-gradient-to-r from-red-500 to-red-700`}
          >
            🎅 Start Game
          </button>
        ) : !isGameOver ? (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                Round {round} / {TOTAL_ROUNDS}
              </span>
              <span className="text-lg mb-4 font-semibold text-blue-600">
                ⏱️ Time Left: {timeLeft}s
              </span>
            </div>

            <div className="p-6 mb-4 text-2xl sm:text-3xl flex flex-wrap items-center justify-center gap-2">
              {roundData[round - 1]?.emojis.map((emoji, i) => (
                <React.Fragment key={i}>
                  <span>{emoji}</span>
                  {i < roundData[round - 1].emojis.length - 1 && (
                    <span className="mx-1">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {showAnswer && (
              <p className="mb-2 font-semibold text-red-600">
                Answer: {roundData[round - 1]?.answer}
              </p>
            )}

            {!showAnswer && (
              <button
                onClick={handleShowAnswer}
                className={`${buttonClass} bg-gradient-to-r from-yellow-400 to-yellow-600`}
              >
                Show Answer
              </button>
            )}

            {showAnswer && (
              <button
                onClick={nextRound}
                className={`${buttonClass} bg-gradient-to-r from-purple-500 to-purple-700`}
              >
                {round < TOTAL_ROUNDS ? "Next Round" : "Finish Game"}
                <RotateCcw className="w-5 h-5 ml-2" />
              </button>
            )}
          </>
        ) : (
          <div>
            <p className="text-xl font-bold text-green-700 mb-4">
              🎉 Game Over! 🎉
            </p>
            <button
              onClick={restartGame}
              className={`${buttonClass} bg-gradient-to-r from-green-500 to-green-700`}
            >
              Restart Game
              <RotateCcw className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
