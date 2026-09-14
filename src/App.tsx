import React, { useState, useEffect } from 'react';
import { TIPITAKA_VOLUMES } from './data/tipitakaData';
import { VolumeItem } from './types';
import { BooksView } from './components/BooksView';
import { AiChatView } from './components/AiChatView';
import { CommunityView } from './components/CommunityView';
import { PdfWebViewModal } from './components/PdfWebViewModal';
import { AudioModal } from './components/AudioModal';
import { PodcastModal } from './components/PodcastModal';
import { SidebarMenu } from './components/SidebarMenu';
import { BottomNavBar } from './components/BottomNavBar';
import { PdfCacheManager } from './utils/pdfCache';
import { Menu, BookMarked, Bookmark } from 'lucide-react';

const KEY_BOOKMARKS = 'tipitaka_bookmarks_v6';

export default function App() {
  const [activeTab, setActiveTab] = useState<'books' | 'ai' | 'community'>('books');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [cachedDocsCount, setCachedDocsCount] = useState<number>(0);

  // Active volume for PDF WebView reader
  const [activeReaderVolume, setActiveReaderVolume] = useState<VolumeItem | null>(null);

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAudioOpen, setIsAudioOpen] = useState<boolean>(false);
  const [isPodcastOpen, setIsPodcastOpen] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);

  // Load saved bookmarks and cache count on mount
  useEffect(() => {
    try {
      const savedBms = localStorage.getItem(KEY_BOOKMARKS);
      if (savedBms) setBookmarks(JSON.parse(savedBms));

      setCachedDocsCount(PdfCacheManager.getCachedCount());
    } catch (e) {
      console.warn('Error reading local storage:', e);
    }
  }, []);

  const showToast = (message: string, icon = '✨') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 2400);
  };

  const handleToggleBookmark = (volumeNum: number) => {
    setBookmarks((prev) => {
      let updated: number[];
      if (prev.includes(volumeNum)) {
        updated = prev.filter((n) => n !== volumeNum);
        showToast(`📌 ยกเลิกการคั่นเล่มที่ ${volumeNum}`);
      } else {
        updated = [...prev, volumeNum];
        showToast(`⭐ คั่นเล่มที่ ${volumeNum} เรียบร้อยแล้ว`);
      }
      localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenVolume = (volume: VolumeItem) => {
    setActiveReaderVolume(volume);
    // Refresh cached count
    setTimeout(() => {
      setCachedDocsCount(PdfCacheManager.getCachedCount());
    }, 100);
  };

  const handleClearCache = () => {
    PdfCacheManager.clearAllCache();
    setCachedDocsCount(0);
    showToast('ล้างแคชเอกสารเรียบร้อยแล้ว', '🧹');
  };

  // Last read volume for quick jump
  const lastReadNum = PdfCacheManager.getLastReadVolume();
  const lastReadVolume = lastReadNum ? TIPITAKA_VOLUMES.find((v) => v.n === lastReadNum) : null;

  return (
    <div className="py-1 sm:py-3 px-1 sm:px-3 antialiased selection:bg-amber-200 selection:text-amber-950 pb-20 font-sarabun min-h-screen">
      {/* MANUSCRIPT OUTER CONTAINER */}
      <div className="manuscript-wrapper max-w-5xl mx-auto rounded-lg overflow-hidden relative min-h-[92vh] flex flex-col justify-between">
        <div>
          {/* COMPACT TOP BANNER */}
          <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-2.5 py-2 border-b border-amber-500/60 shadow-xs relative z-20">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
              {/* Hamburger Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 sm:p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1 transition-all active:scale-95"
                title="เปิดเมนู"
              >
                <Menu className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-sarabun text-[11px]">เมนู</span>
              </button>

              {/* Center Compact Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center px-2 py-0 bg-amber-500/10 rounded-full border border-amber-500/20 mb-0.5">
                  <span className="text-amber-300 mr-1 text-[9px]">☸</span>
                  <span className="text-[9px] text-amber-200/90 font-sarabun tracking-tight">
                    พระธรรมวินัย ๔๕ เล่ม
                  </span>
                </div>

                <h1 className="font-maitree font-bold text-xs sm:text-base tracking-tight text-amber-300 my-0 leading-tight">
                  พระไตรปิฎก & ชุมชนธรรมะ
                </h1>
              </div>

              {/* Right Quick Jump or Bookmarks Info */}
              <div className="flex items-center gap-1">
                {lastReadVolume ? (
                  <button
                    onClick={() => setActiveReaderVolume(lastReadVolume)}
                    className="flex px-2 py-0.5 bg-indigo-950/80 hover:bg-indigo-900 text-amber-200 border border-indigo-500/40 rounded-lg text-[9px] sm:text-[10px] items-center gap-1 transition-all active:scale-95"
                    title="อ่านเล่มล่าสุดที่เปิดค้างไว้"
                  >
                    <BookMarked className="w-3 h-3 text-amber-400" />
                    <span>อ่านต่อเล่ม {lastReadVolume.thaiN}</span>
                  </button>
                ) : (
                  <div
                    className="px-2 py-0.5 bg-slate-900/80 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-sarabun flex items-center gap-1"
                    title="จำนวนเล่มที่คั่นไว้"
                  >
                    <Bookmark className="w-3 h-3 text-amber-400" />
                    <span>คั่นไว้ {bookmarks.length}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* TAB 1: BOOKS ARCHIVE (พระไตรปิฎก ๔๕ เล่ม) */}
          {activeTab === 'books' && (
            <BooksView
              volumes={TIPITAKA_VOLUMES}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onOpenVolume={handleOpenVolume}
            />
          )}

          {/* TAB 2: AI CHATBOT (AI วิสัชนาธรรม with ThaiLLM) */}
          {activeTab === 'ai' && <AiChatView />}

          {/* TAB 3: COMMUNITY BOARD (ชุมชนธรรมสากัจฉา) */}
          {activeTab === 'community' && <CommunityView />}
        </div>

        {/* FOOTER */}
        <footer className="mt-3 bg-slate-950 text-slate-400 py-2.5 px-2 text-center text-[10px] border-t border-slate-800 font-sarabun">
          <div className="max-w-xl mx-auto space-y-0.5">
            <p className="text-amber-300/90 font-maitree text-xs font-medium">
              "สพฺพทานํ ธมฺมทานํ ชินาติ - การให้ธรรมะเป็นทาน ย่อมชนะการให้ทั้งปวง"
            </p>
            <p className="opacity-60 text-[9px]">
              © 2026 Crow Studio | ธรรมทานเพื่อมวลมนุษยชาติ • ระบบคัมภีร์ดิจิทัล
            </p>
          </div>
        </footer>
      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (3 BUTTONS) */}
      <BottomNavBar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* PDF WEBVIEW MODAL (THEMES + FREE ZOOM + CACHE) */}
      <PdfWebViewModal
        volume={activeReaderVolume}
        allVolumes={TIPITAKA_VOLUMES}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        onSelectVolume={(vol) => setActiveReaderVolume(vol)}
        onClose={() => setActiveReaderVolume(null)}
      />

      {/* AUDIO PLAYER MODAL */}
      <AudioModal isOpen={isAudioOpen} onClose={() => setIsAudioOpen(false)} />

      {/* VIDEO PODCAST MODAL */}
      <PodcastModal isOpen={isPodcastOpen} onClose={() => setIsPodcastOpen(false)} />

      {/* SIDEBAR NAVIGATION MENU */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        cachedCount={cachedDocsCount}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAudio={() => setIsAudioOpen(true)}
        onOpenPodcast={() => setIsPodcastOpen(true)}
        onClearCache={handleClearCache}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* TOAST NOTIFICATION POPUP */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-amber-300 text-xs px-3.5 py-1.5 rounded-xl border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-1.5 font-sarabun transition-all duration-300">
          <span>{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
