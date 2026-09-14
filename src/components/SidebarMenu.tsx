import React from 'react';
import { X, BookOpen, Bot, Users, Headphones, Film, Zap, Trash2 } from 'lucide-react';
import { PdfCacheManager } from '../utils/pdfCache';

interface SidebarMenuProps {
  isOpen: boolean;
  activeTab: string;
  cachedCount: number;
  onSelectTab: (tab: 'books' | 'ai' | 'community') => void;
  onOpenAudio: () => void;
  onOpenPodcast: () => void;
  onClearCache: () => void;
  onClose: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  activeTab,
  cachedCount,
  onSelectTab,
  onOpenAudio,
  onOpenPodcast,
  onClearCache,
  onClose,
}) => {
  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 text-slate-200 z-50 transition-transform duration-300 ease-in-out border-r border-amber-500/30 flex flex-col font-sarabun shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-gradient-to-r from-slate-950 to-indigo-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-lg">☸</span>
            <div>
              <h3 className="font-maitree font-bold text-amber-300 text-xs sm:text-sm">
                เมนูรัตนบรมธรรม
              </h3>
              <p className="text-[9px] text-slate-400">คัมภีร์ดิจิทัล & คลังสื่อธรรมะ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-amber-300 text-sm p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 text-xs overflow-y-auto custom-scrollbar">
          <button
            onClick={() => {
              onSelectTab('books');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-left ${
              activeTab === 'books'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>พระไตรปิฎก ๔๕ เล่ม</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('ai');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-left ${
              activeTab === 'ai'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-amber-300'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI วิสัชนาธรรม (ThaiLLM)</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('community');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-left ${
              activeTab === 'community'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-amber-300'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>ชุมชนพูดคุย สนทนาธรรม</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 my-1.5" />

          <button
            onClick={() => {
              onOpenAudio();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 transition-colors font-medium text-left"
          >
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>เสียงอ่านพระไตรปิฎก</span>
          </button>

          <button
            onClick={() => {
              onOpenPodcast();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 transition-colors font-medium text-left"
          >
            <Film className="w-4 h-4 text-rose-400" />
            <span>วิดีโอสรุป & พอดแคสต์</span>
          </button>

          {/* Cache Status & Clear Cache */}
          <div className="pt-2 border-t border-slate-800/80 my-1.5">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3 h-3" />
                  <span>แคชเอกสารอ่านเร็ว:</span>
                </span>
                <span className="font-bold text-amber-300">{cachedCount} เล่ม</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight">
                บันทึกคัมภีร์ไว้ในอุปกรณ์เพื่อเปิดอ่านได้ทันทีและลื่นไหล
              </p>
              {cachedCount > 0 && (
                <button
                  onClick={onClearCache}
                  className="w-full mt-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded text-[9px] flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>ล้างแคชเอกสาร</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-900 text-[10px] text-slate-500 text-center">
          © 2026 Crow Studio • ธรรมทานดิจิทัล
        </div>
      </aside>
    </>
  );
};
