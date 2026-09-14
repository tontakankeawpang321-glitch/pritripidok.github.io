import React, { useState } from 'react';
import { VolumeItem } from '../types';
import { Search, X, Star, Zap } from 'lucide-react';
import { PdfCacheManager } from '../utils/pdfCache';

interface BooksViewProps {
  volumes: VolumeItem[];
  bookmarks: number[];
  onToggleBookmark: (volumeNum: number) => void;
  onOpenVolume: (volume: VolumeItem) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  volumes,
  bookmarks,
  onToggleBookmark,
  onOpenVolume,
}) => {
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVolumes = volumes.filter((v) => {
    let matchCat = true;
    if (currentFilter === 'bookmark') {
      matchCat = bookmarks.includes(v.n);
    } else if (currentFilter !== 'all') {
      matchCat = v.catKey === currentFilter;
    }

    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      matchSearch =
        v.n.toString().includes(q) ||
        v.thaiN.includes(q) ||
        v.desc.toLowerCase().includes(q) ||
        v.catLabel.toLowerCase().includes(q);
    }

    return matchCat && matchSearch;
  });

  const resetSearch = () => {
    setSearchQuery('');
    setCurrentFilter('all');
  };

  return (
    <div>
      {/* SEARCH & CATEGORY FILTER BAR */}
      <section className="p-2 bg-stone-100/90 border-b border-stone-200/80 sticky top-0 z-20 backdrop-blur-md shadow-xs font-sarabun">
        <div className="max-w-3xl mx-auto space-y-1">
          {/* Search Input Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเลขเล่ม (1-45) หรือหมวดธรรม..."
              className="w-full pl-8 pr-7 py-1 bg-white border border-slate-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-full text-xs text-slate-800 placeholder-slate-400 outline-none shadow-xs text-center sm:text-left"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-1 text-[10px]">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`px-2.5 py-0.5 rounded-full border transition-all shadow-xs ${
                currentFilter === 'all'
                  ? 'border-slate-900 bg-slate-900 text-amber-300 font-bold'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-600'
              }`}
            >
              ทั้งหมด (๔๕)
            </button>
            <button
              onClick={() => setCurrentFilter('vinaya')}
              className={`px-2.5 py-0.5 rounded-full border transition-all shadow-xs ${
                currentFilter === 'vinaya'
                  ? 'border-slate-900 bg-slate-900 text-amber-300 font-bold'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-600'
              }`}
            >
              พระวินัย (๑-๘)
            </button>
            <button
              onClick={() => setCurrentFilter('sutta')}
              className={`px-2.5 py-0.5 rounded-full border transition-all shadow-xs ${
                currentFilter === 'sutta'
                  ? 'border-slate-900 bg-slate-900 text-amber-300 font-bold'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-blue-600'
              }`}
            >
              พระสูตร (๙-๓๓)
            </button>
            <button
              onClick={() => setCurrentFilter('abhidhamma')}
              className={`px-2.5 py-0.5 rounded-full border transition-all shadow-xs ${
                currentFilter === 'abhidhamma'
                  ? 'border-slate-900 bg-slate-900 text-amber-300 font-bold'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-emerald-600'
              }`}
            >
              พระอภิธรรม (๓๔-๔๕)
            </button>
            <button
              onClick={() => setCurrentFilter('bookmark')}
              className={`px-2 py-0.5 rounded-full border transition-all shadow-xs flex items-center gap-1 ${
                currentFilter === 'bookmark'
                  ? 'border-amber-500 bg-amber-400 text-slate-950 font-bold'
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <span>📌</span> คั่นไว้ ({bookmarks.length})
            </button>
          </div>
        </div>
      </section>

      {/* BOOKS GRID */}
      <main className="p-2 sm:p-3 font-sarabun">
        {filteredVolumes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {filteredVolumes.map((v) => {
              const isBookmarked = bookmarks.includes(v.n);
              const isCached = PdfCacheManager.isCached(v.n);

              return (
                <div
                  key={v.n}
                  onClick={() => onOpenVolume(v)}
                  className="royal-card group cursor-pointer"
                >
                  <div className="bg-white rounded-lg border border-stone-200 hover:border-amber-400 p-1.5 sm:p-2 transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full relative overflow-hidden active:scale-98">
                    {/* Bookmark Star Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(v.n);
                      }}
                      title={isBookmarked ? 'ยกเลิกคั่นหน้า' : 'คั่นเล่มนี้'}
                      className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-white/90 hover:bg-white border border-stone-200 flex items-center justify-center text-[10px] shadow-xs active:scale-90 transition-all"
                    >
                      {isBookmarked ? '⭐' : '🤍'}
                    </button>

                    {/* Cached badge if viewed */}
                    {isCached && (
                      <span
                        className="absolute top-1 left-1 z-20 px-1 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[7px] font-bold flex items-center gap-0.5 shadow-xs"
                        title="แคชเอกสารพร้อมเปิดเร็ว"
                      >
                        <Zap className="w-2 h-2 text-emerald-600 fill-emerald-600" />
                        <span>แคชแล้ว</span>
                      </span>
                    )}

                    {/* Book Cover */}
                    <div className="block space-y-1">
                      <div className="py-0.5 flex justify-center">
                        <div className="blue-book-cover thai-pattern-overlay w-12 h-18 sm:w-16 sm:h-24 flex flex-col items-center justify-center text-amber-300 relative select-none">
                          <div className="gold-ribbon" />
                          <div className="blue-book-frame" />
                          <span className="text-[10px] text-amber-400">☸</span>
                          <span className="text-[7px] font-maitree text-amber-200/80 uppercase">
                            เล่มที่
                          </span>
                          <span className="font-charm font-bold text-sm sm:text-lg text-amber-200 leading-tight">
                            {v.thaiN}
                          </span>
                          <span className="text-[7px] font-sarabun text-amber-300/70">
                            ({v.n})
                          </span>
                        </div>
                      </div>

                      <div className="text-center pt-0.5">
                        <span
                          className={`inline-block px-1 py-0.2 rounded text-[8px] font-medium border ${v.tagBg} mb-0.5`}
                        >
                          {v.catLabel}
                        </span>
                        <h3 className="font-maitree text-[11px] font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1 leading-tight">
                          เล่มที่ {v.thaiN} ({v.n})
                        </h3>
                        <p className="text-[9px] text-stone-500 line-clamp-2 mt-0.5 leading-tight font-light">
                          {v.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-1 pt-1 border-t border-stone-100 flex items-center justify-center">
                      <span className="text-[8px] text-amber-700 group-hover:text-amber-900 font-semibold flex items-center gap-0.5">
                        <span>📖 แตะเพื่อเปิดอ่าน</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="text-center py-8 px-4">
            <div className="text-xl mb-1">🔍</div>
            <h3 className="font-maitree text-xs font-bold text-slate-700">
              ไม่พบเล่มพระไตรปิฎกที่ระบุ
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              ระบุเลขเล่ม 1-45 หรือค้นหาชื่อหมวดธรรม
            </p>
            <button
              onClick={resetSearch}
              className="mt-2 px-3 py-1 bg-slate-900 text-amber-300 rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              แสดงทั้งหมด
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
