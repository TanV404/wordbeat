import React, { useState, useMemo } from "react";
import Wordbeat from "./pages/Wordbeat";
import Songguess from "./pages/Songguess";
// Swapped 'Drum' for 'Mic2' to prevent export errors
import { Mic2, Music2, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("wordbeat");
  const TAB_HEIGHT = 54; 

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

  const trees = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${(i / 12) * 100}%`,
        scale: 0.8 + Math.random() * 0.5, 
        zIndex: Math.floor(Math.random() * 10), 
        opacity: 0.7 + Math.random() * 0.3
    }));
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-[#050a14] text-slate-100">
      
      {/* Ambient Effects */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none z-0" />
      
      <div className="absolute inset-0 pointer-events-none z-10">
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

      {/* Trees */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10 overflow-hidden flex items-end justify-around px-2">
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-950/50 to-transparent z-0"></div>
        {trees.map((tree) => (
          <span 
            key={tree.id} 
            className="text-4xl sm:text-6xl relative transform-gpu transition-transform leading-none -mb-2 filter drop-shadow-lg"
            style={{
                transform: `scale(${tree.scale})`,
                zIndex: tree.zIndex,
                opacity: tree.opacity,
                textShadow: '0 4px 8px rgba(0,0,0,0.5)'
            }}
          >
            🎄
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div 
        className="relative z-30 flex items-center border-b-2 border-red-900/50 bg-slate-950/60 backdrop-blur-md shadow-2xl"
        style={{ height: TAB_HEIGHT }}
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

        <TabButton 
          isActive={activeTab === "wordbeat"} 
          onClick={() => setActiveTab("wordbeat")}
          icon={<Mic2 className={activeTab === "wordbeat" ? "text-yellow-400" : "text-slate-400"} size={20} />}
          label="Word Beat Challenge"
        />
        
        <div className="h-8 w-[1px] bg-gradient-to-b from-red-900/0 via-red-500/50 to-red-900/0"></div>

        <TabButton 
          isActive={activeTab === "songguess"} 
          onClick={() => setActiveTab("songguess")}
          icon={<Music2 className={activeTab === "songguess" ? "text-yellow-400" : "text-slate-400"} size={20} />}
          label="Guess the Song"
        />
      </div>

      {/* Content */}
      <div
        className="relative z-20 overflow-y-auto custom-scrollbar"
        style={{ height: `calc(100vh - ${TAB_HEIGHT}px)` }}
      >
         <Sparkles className="absolute top-4 left-4 text-yellow-200/20 pointer-events-none" size={32} />
         <Sparkles className="absolute top-4 right-4 text-yellow-200/20 pointer-events-none" size={24} />

        {activeTab === "wordbeat" && <Wordbeat />}
        {activeTab === "songguess" && <Songguess />}
      </div>

      {/* Styles */}
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
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

function TabButton({ isActive, onClick, icon, label }) {
    return (
      <button
        onClick={onClick}
        className={`flex-1 h-full flex items-center justify-center gap-3 text-sm sm:text-lg font-bold transition-all duration-300 relative group overflow-hidden
          ${isActive 
            ? "text-white bg-gradient-to-b from-red-950/80 to-red-900/90" 
            : "text-slate-400 hover:text-slate-100 hover:bg-emerald-950/30"
          }`}
      >
        {isActive && (
            <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_-2px_10px_rgba(234,179,8,0.5)]" />
        )}
        
        {!isActive && (
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
        )}
  
        <span className="relative z-10 drop-shadow-md">{icon}</span>
        <span className="relative z-10 drop-shadow-md">{label}</span>
      </button>
    );
  }