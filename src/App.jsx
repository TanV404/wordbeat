import React, { useState } from "react";
import Wordbeat from "./pages/Wordbeat";
import Songguess from "./pages/Songguess";

export default function App() {
  const [activeTab, setActiveTab] = useState("wordbeat");
  const TAB_HEIGHT = 64;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Infinite Snowfall */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/80 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Christmas Trees */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 pointer-events-none z-10 opacity-90">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="text-green-500 text-4xl sm:text-5xl">
            🎄
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20 bg-white/10 backdrop-blur shadow-lg relative z-20 h-16">
        <button
          onClick={() => setActiveTab("wordbeat")}
          className={`flex-1 py-4 text-lg font-semibold transition-colors ${
            activeTab === "wordbeat"
              ? "border-b-4 border-white-500 text-white"
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          Word Beat Challenge
        </button>
        <button
          onClick={() => setActiveTab("songguess")}
          className={`flex-1 py-4 text-lg font-semibold transition-colors ${
            activeTab === "songguess"
              ? "border-b-4 border-white-500 text-white"
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          Guess the Song
        </button>
      </div>

      {/* Tab Content */}
      <div
        className="relative z-20"
        style={{ minHeight: `calc(100vh - ${TAB_HEIGHT}px)` }}
      >
        {activeTab === "wordbeat" && <Wordbeat />}
        {activeTab === "songguess" && <Songguess />}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh); }
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
