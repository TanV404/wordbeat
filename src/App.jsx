import React, { useState } from "react";
import Wordbeat from "./pages/Wordbeat";
import Songguess from "./pages/Songguess";
import New from "./pages/New";

export default function App() {
  const [activeTab, setActiveTab] = useState("wordbeat");
  const TAB_HEIGHT = 64; // adjust if your tab bar height changes

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Infinite Snowfall */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Christmas Trees at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pointer-events-none z-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="text-green-600 text-4xl sm:text-5xl">
            🎄
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-white shadow-md relative z-10 h-16">
        <button
          onClick={() => setActiveTab("wordbeat")}
          className={`flex-1 py-4 text-lg font-semibold transition-colors ${
            activeTab === "wordbeat"
              ? "border-b-4 border-red-500 text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Word Beat Challenge
        </button>
        <button
          onClick={() => setActiveTab("songguess")}
          className={`flex-1 py-4 text-lg font-semibold transition-colors ${
            activeTab === "songguess"
              ? "border-b-4 border-red-500 text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Guess the Song
        </button>
      </div>

      {/* Tab Content */}
      <div
        className="relative z-10"
        style={{ minHeight: `calc(100vh - ${TAB_HEIGHT}px)` }}
      >
        {activeTab === "wordbeat" && <Wordbeat />}
        {activeTab === "songguess" && <Songguess />}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(110vh); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}




// import React, { useEffect, useRef, useState } from "react";
// import { Play, Pause, RotateCcw } from "lucide-react";

// const TOTAL_ROUNDS = 5;
// const HIGHLIGHT_START_TIME = 5.0; // start audio from 0
// const TILE_HIGHLIGHT_DURATION = 500; // tile highlight duration in ms
// const ROUND_DELAY = 3.0; // seconds between rounds

// // Base beat pattern for 1 round (seconds)
// const BASE_BEATS = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75];

// // Calculate ROUND_BEATS incrementally for each round
// const ROUND_BEATS = [];
// for (let r = 0; r < TOTAL_ROUNDS; r++) {
//   const offset = r * (BASE_BEATS[BASE_BEATS.length - 1] + ROUND_DELAY);
//   ROUND_BEATS.push(BASE_BEATS.map(t => t + offset));
// }

// // Tiles per round
// const ROUNDS = [
//   [{ id: "BUTTER", emoji: "🧈" }, { id: "BIRD", emoji: "🐦" }, { id: "BUBBLE", emoji: "🫧" }, { id: "BEAR", emoji: "🐻" }, { id: "BALL", emoji: "⚽" }, { id: "BREAD", emoji: "🍞" }, { id: "BOOK", emoji: "📚" }, { id: "BEE", emoji: "🐝" }],
//   [{ id: "CAT", emoji: "🐱" }, { id: "CAR", emoji: "🚗" }, { id: "CAKE", emoji: "🎂" }, { id: "CROWN", emoji: "👑" }, { id: "CLOUD", emoji: "☁️" }, { id: "COOKIE", emoji: "🍪" }, { id: "COFFEE", emoji: "☕" }, { id: "CAMERA", emoji: "📷" }],
//   [{ id: "DOG", emoji: "🐕" }, { id: "DRAGON", emoji: "🐉" }, { id: "DIAMOND", emoji: "💎" }, { id: "DONUT", emoji: "🍩" }, { id: "DUCK", emoji: "🦆" }, { id: "DRUM", emoji: "🥁" }, { id: "DANCE", emoji: "💃" }, { id: "DREAM", emoji: "💭" }],
//   [{ id: "FIRE", emoji: "🔥" }, { id: "FLOWER", emoji: "🌸" }, { id: "FISH", emoji: "🐠" }, { id: "FLAG", emoji: "🚩" }, { id: "FOX", emoji: "🦊" }, { id: "FROG", emoji: "🐸" }, { id: "FRUIT", emoji: "🍎" }, { id: "FLASH", emoji: "⚡" }],
//   [{ id: "STAR", emoji: "⭐" }, { id: "SUN", emoji: "☀️" }, { id: "SMILE", emoji: "😊" }, { id: "SNOW", emoji: "❄️" }, { id: "SHARK", emoji: "🦈" }, { id: "SHIP", emoji: "🚢" }, { id: "SHINE", emoji: "✨" }, { id: "STONE", emoji: "🪨" }]
// ];

// export default function App() {
//   const audioRef = useRef(null);
//   const beatIndexRef = useRef(0);
//   const [round, setRound] = useState(1);
//   const [highlighted, setHighlighted] = useState(null);
//   const [playing, setPlaying] = useState(false);
//   const [gameOver, setGameOver] = useState(false);

//   useEffect(() => {
//     if (!playing) return;
//     const audio = audioRef.current;

//     const onTime = () => {
//       const t = audio.currentTime;
//       const beats = ROUND_BEATS[round - 1];

//       if (beatIndexRef.current < beats.length && t >= beats[beatIndexRef.current]) {
//         const tiles = ROUNDS[round - 1];
//         const tile = tiles[beatIndexRef.current % tiles.length].id;

//         setHighlighted(tile);
//         setTimeout(() => setHighlighted(null), TILE_HIGHLIGHT_DURATION);

//         beatIndexRef.current++;

//         // After last tile in round
//         if (beatIndexRef.current >= beats.length) {
//           setTimeout(() => {
//             if (round < TOTAL_ROUNDS) {
//               beatIndexRef.current = 0;
//               setRound(r => r + 1);
//             } else {
//               setHighlighted(null);
//               setPlaying(false);
//               setGameOver(true);
//             }
//           }, ROUND_DELAY * 1000);
//         }
//       }
//     };

//     audio.addEventListener("timeupdate", onTime);
//     return () => audio.removeEventListener("timeupdate", onTime);
//   }, [playing, round]);

//   const start = () => {
//     beatIndexRef.current = 0;
//     setHighlighted(null);
//     setPlaying(true);
//     setGameOver(false);
//     setRound(1);
//     const audio = audioRef.current;
//     audio.currentTime = 0;
//     audio.play();
//   };

//   const pause = () => {
//     audioRef.current.pause();
//     setPlaying(false);
//   };

//   const reset = () => {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     beatIndexRef.current = 0;
//     setRound(1);
//     setHighlighted(null);
//     setPlaying(false);
//     setGameOver(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <audio ref={audioRef} src="/whistle.mp3" />
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-6">BeatSpeak 🎵</h1>

//         <div className="flex justify-center gap-4 mb-8">
//           {!playing && !gameOver && <button onClick={start} className="btn-primary flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"><Play /> Start</button>}
//           {playing && <button onClick={pause} className="btn-secondary flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded"><Pause /> Pause</button>}
//           <button onClick={reset} className="btn-secondary flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded"><RotateCcw /> Reset</button>
//         </div>

//         <h2 className="text-center text-2xl font-bold mb-6">{gameOver ? "Game Over!" : `Round ${round} / ${TOTAL_ROUNDS}`}</h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {ROUNDS[round - 1].map(t => (
//             <div key={t.id} className={`aspect-square flex items-center justify-center text-7xl rounded-3xl border-4 transition-all duration-200 ${highlighted === t.id ? "border-red-500 bg-red-50" : "border-black bg-white"}`}>
//               {t.emoji}
//             </div>
//           ))}
//         </div>

//         {gameOver && (
//           <div className="text-center mt-8">
//             <button onClick={start} className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition-colors">
//               Restart Game
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
