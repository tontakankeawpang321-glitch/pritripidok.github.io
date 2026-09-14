import React from 'react';
import { BookOpen, Bot, Users } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'books' | 'ai' | 'community';
  onSelectTab: (tab: 'books' | 'ai' | 'community') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 border border-amber-500/50 backdrop-blur-md rounded-full p-1 shadow-2xl flex items-center gap-1 font-sarabun text-xs text-slate-200">
      <button
        onClick={() => onSelectTab('books')}
        className={`nav-tab-btn px-4 sm:px-6 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
          activeTab === 'books'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
            : 'text-slate-300 hover:text-white font-medium'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span className="text-[11px] sm:text-xs">หนังสือ</span>
      </button>

      <button
        onClick={() => onSelectTab('ai')}
        className={`nav-tab-btn px-4 sm:px-6 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
          activeTab === 'ai'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
            : 'text-slate-300 hover:text-white font-medium'
        }`}
      >
        <Bot className="w-3.5 h-3.5" />
        <span className="text-[11px] sm:text-xs">AI</span>
      </button>

      <button
        onClick={() => onSelectTab('community')}
        className={`nav-tab-btn px-4 sm:px-6 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
          activeTab === 'community'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
            : 'text-slate-300 hover:text-white font-medium'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span className="text-[11px] sm:text-xs">ชุมชน</span>
      </button>
    </nav>
  );
};
