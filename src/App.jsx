import React, { useState, useMemo } from "react";
import Wordbeat from "./pages/Wordbeat";
import Songguess from "./pages/Songguess";
import { Mic2, Music2, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("wordbeat");

  // Generate Snowflakes
  const snowflakes = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `-${Math.random() * 10}s`,
      size: Math.random() * 3 + 1 + "px",
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  // Generate Trees
  const trees = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${(i / 12) * 100}%`,
      scale: 0.8 + Math.random() * 0.5,
      zIndex: Math.floor(Math.random() * 10),
      opacity: 0.7 + Math.random() * 0.3,
    }));
  }, []);

  return (
    // Main Container: h-dvh handles mobile viewport height correctly
    <div className="relative h-dvh w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-[#050a14] text-slate-100 font-sans flex flex-col">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-900/20 to-transparent z-0" />
        
        {/* Snowflakes */}
        <div className="absolute inset-0 z-10">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute bg-white rounded-full animate-fall"
              style={{
                left: flake.left,
                top: flake.top,
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                animationDuration: flake.animationDuration,
                animationDelay: flake.animationDelay,
                boxShadow: `0 0 ${flake.size} white`,
              }}
            />
          ))}
        </div>

        {/* Trees (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 z-10 flex items-end justify-around px-2">
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-950/50 to-transparent z-0"></div>
          {trees.map((tree) => (
            <span
              key={tree.id}
              className="text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl relative transform-gpu transition-transform leading-none -mb-2 filter drop-shadow-lg select-none"
              style={{
                transform: `scale(${tree.scale})`,
                zIndex: tree.zIndex,
                opacity: tree.opacity,
                textShadow: "0 4px 8px rgba(0,0,0,0.5)",
              }}
            >
              🎄
            </span>
          ))}
        </div>
      </div>

      {/* --- HEADER / TABS SECTION --- */}
      {/* flex-none prevents squishing, h-14 to h-24 responsive height */}
      <div className="flex-none relative z-30 flex items-center border-b-2 border-red-900/50 bg-slate-950/60 backdrop-blur-md shadow-2xl w-full h-14 sm:h-16 lg:h-20 xl:h-24">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

        <TabButton
          isActive={activeTab === "wordbeat"}
          onClick={() => setActiveTab("wordbeat")}
          icon={
            <Mic2
              className={`transition-colors ${activeTab === "wordbeat" ? "text-yellow-400" : "text-slate-400"}`}
              // Responsive Icon Size using Tailwind classes isn't direct on lucide components, so we use width/height classes
            />
          }
          label="Word Beat Challenge"
        />

        <div className="h-8 w-[1px] bg-gradient-to-b from-red-900/0 via-red-500/50 to-red-900/0"></div>

        <TabButton
          isActive={activeTab === "songguess"}
          onClick={() => setActiveTab("songguess")}
          icon={
            <Music2
              className={`transition-colors ${activeTab === "songguess" ? "text-yellow-400" : "text-slate-400"}`}
            />
          }
          label="Guess Song"
        />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* flex-1 takes remaining space, relative z-20 puts it above background but below header/modals */}
      <div className="flex-1 relative z-20 w-full min-h-0">
        {/* Scrollable Container */}
        <div className="h-full w-full overflow-y-auto custom-scrollbar">
            {/* Corner Sparkles */}
            <Sparkles className="absolute top-4 left-4 text-yellow-200/20 pointer-events-none w-6 h-6 sm:w-8 sm:h-8" />
            <Sparkles className="absolute top-4 right-4 text-yellow-200/20 pointer-events-none w-5 h-5 sm:w-6 sm:h-6" />

            {/* Render Active Page */}
            {activeTab === "wordbeat" && <Wordbeat />}
            {activeTab === "songguess" && <Songguess />}
        </div>
      </div>

      {/* Styles for Animations & Scrollbar */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(-5px); }
          50% { transform: translateX(5px); }
          100% { transform: translateY(110vh) translateX(-5px); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.15);
            border-radius: 99px;
        }
        @media (min-width: 640px) {
            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        }
      `}</style>
    </div>
  );
}

function TabButton({ isActive, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 relative group overflow-hidden
        ${
          isActive
            ? "text-white bg-gradient-to-b from-red-950/80 to-red-900/90 shadow-inner border-t border-red-500/20"
            : "text-slate-400 hover:text-slate-100 hover:bg-emerald-950/30"
        }`}
    >
      {isActive && (
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_-2px_10px_rgba(234,179,8,0.5)]" />
      )}

      {!isActive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
      )}

      {/* Responsive Icon Wrapper */}
      <span className="relative z-10 drop-shadow-md [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-6 sm:[&>svg]:h-6 lg:[&>svg]:w-7 lg:[&>svg]:h-7">
        {icon}
      </span>
      
      {/* Responsive Text */}
      <span className="relative z-10 drop-shadow-md text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold uppercase tracking-wide">
        {label}
      </span>
    </button>
  );
}