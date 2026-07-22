import React from 'react';
import { Sofa, Sparkles, BookmarkCheck, Settings, Terminal, Shield, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'saved' | 'settings';
  setActiveTab: (tab: 'generator' | 'saved' | 'settings') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-500/20 text-slate-100 shadow-2xl shadow-emerald-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Hacker / Cyberpunk Custom Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('generator')}>
            {/* Custom Cyber Matrix Terminal Badge */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-slate-950 border border-emerald-500/50 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] group-hover:border-emerald-400 transition-all duration-300 flex items-center justify-center overflow-hidden">
              {/* Matrix scanlines effect overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-cyan-500/10" />
              
              <div className="relative z-10 flex items-center justify-center">
                <Sofa className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono text-cyan-400 bg-slate-950 px-1 border border-cyan-500/40 rounded">
                  AI
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-lg sm:text-2xl font-black tracking-wider text-white flex items-center gap-1">
                  <span className="text-emerald-400">&gt;_</span>
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                    SOFA_CYBER
                  </span>
                  <span className="text-emerald-400 animate-pulse">_</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Terminal className="w-3 h-3 text-emerald-400" /> V2.0_ULTRA_PRO
                </span>
              </div>
              <p className="text-[11px] font-mono text-emerald-400/70 hidden sm:block">
                [SYSTEM: 100% AUTOMATED UK MARKETPLACE COPY GENERATOR]
              </p>
            </div>
          </div>

          {/* Cyber-styled Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2 font-mono">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === 'generator'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:text-emerald-300 bg-slate-900/80 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>GENERATOR</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border relative ${
                activeTab === 'saved'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:text-emerald-300 bg-slate-900/80 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>SAVED</span>
              {savedCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    activeTab === 'saved'
                      ? 'bg-slate-950 text-emerald-400'
                      : 'bg-emerald-400 text-slate-950'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === 'settings'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:text-emerald-300 bg-slate-900/80 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">SETTINGS</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
