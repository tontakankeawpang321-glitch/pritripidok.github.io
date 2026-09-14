import React, { useState, useEffect, useRef } from 'react';
import { VolumeItem, ReaderTheme, ReaderThemeId } from '../types';
import { PdfCacheManager } from '../utils/pdfCache';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Palette,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface PdfWebViewModalProps {
  volume: VolumeItem | null;
  allVolumes: VolumeItem[];
  bookmarks: number[];
  onToggleBookmark: (volumeNum: number) => void;
  onSelectVolume: (volume: VolumeItem) => void;
  onClose: () => void;
}

const THEMES: ReaderTheme[] = [
  {
    id: 'manuscript',
    name: 'คัมภีร์ใบลาน',
    icon: '📜',
    bg: '#fcfbf7',
    text: '#1e293b',
    barBg: '#0e1a34',
    barBorder: '#d4af37',
    accent: '#d4af37',
  },
  {
    id: 'royal-navy',
    name: 'รัตนราตรี',
    icon: '🌌',
    bg: '#0a101d',
    text: '#f8fafc',
    barBg: '#0f172a',
    barBorder: '#38bdf8',
    accent: '#38bdf8',
  },
  {
    id: 'sepia',
    name: 'ถนอมสายตา',
    icon: '🍂',
    bg: '#f5eee1',
    text: '#432818',
    barBg: '#2c1810',
    barBorder: '#b08968',
    accent: '#d4a373',
  },
  {
    id: 'oled',
    name: 'มืดสนิท (OLED)',
    icon: '🌑',
    bg: '#000000',
    text: '#e2e8f0',
    barBg: '#050505',
    barBorder: '#64748b',
    accent: '#facc15',
  },
  {
    id: 'clean',
    name: 'สว่างคมชัด',
    icon: '☀️',
    bg: '#ffffff',
    text: '#0f172a',
    barBg: '#1e293b',
    barBorder: '#94a3b8',
    accent: '#3b82f6',
  },
];

export const PdfWebViewModal: React.FC<PdfWebViewModalProps> = ({
  volume,
  allVolumes,
  bookmarks,
  onToggleBookmark,
  onSelectVolume,
  onClose,
}) => {
  if (!volume) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [themeId, setThemeId] = useState<ReaderThemeId>('manuscript');
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cachedBadge, setCachedBadge] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const isBookmarked = bookmarks.includes(volume.n);

  // Record access and check cache status
  useEffect(() => {
    setIsLoading(true);
    const isAlreadyCached = PdfCacheManager.isCached(volume.n);
    setCachedBadge(isAlreadyCached);

    PdfCacheManager.recordAccess(volume.n, `เล่มที่ ${volume.thaiN} (${volume.n})`, volume.desc, volume.driveFileId);
    setIframeKey(Date.now());

    // Reset zoom when switching volume
    setZoomLevel(100);
  }, [volume.n]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 20, 220));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 20, 60));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrevVolume = () => {
    const prevIndex = volume.n - 2;
    if (prevIndex >= 0 && allVolumes[prevIndex]) {
      onSelectVolume(allVolumes[prevIndex]);
    }
  };

  const handleNextVolume = () => {
    const nextIndex = volume.n;
    if (nextIndex < allVolumes.length && allVolumes[nextIndex]) {
      onSelectVolume(allVolumes[nextIndex]);
    }
  };

  const driveEmbedUrl = `https://drive.google.com/file/d/${volume.driveFileId}/preview`;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-sarabun text-slate-100 select-none overflow-hidden"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* COMPACT TOP WEBVIEW BAR */}
      <div
        className="px-2.5 py-1.5 border-b shadow-md flex items-center justify-between gap-2 z-30 relative transition-colors duration-300"
        style={{
          backgroundColor: currentTheme.barBg,
          borderColor: currentTheme.barBorder,
        }}
      >
        {/* Left: Close & Title Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors flex items-center justify-center text-xs"
            title="ปิดหน้าจออ่าน"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">☸</span>
              <h2 className="font-maitree font-bold text-xs sm:text-sm text-amber-300 truncate leading-tight">
                เล่มที่ {volume.thaiN} ({volume.n})
              </h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-200 truncate hidden sm:inline-block">
                {volume.catLabel}
              </span>
            </div>
            <p className="text-[10px] text-slate-300/80 truncate font-light leading-tight">
              {volume.desc}
            </p>
          </div>
        </div>

        {/* Right: Controls (Theme, Zoom, Bookmark, External) */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Cache speed badge */}
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[9px] text-emerald-300"
            title="ระบบแคชทำงาน โหลดเอกสารความเร็วสูง"
          >
            <Zap className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
            <span>{cachedBadge ? 'แคชพร้อมใช้' : 'กำลังจัดเก็บแคช'}</span>
          </div>

          {/* Theme Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 text-xs flex items-center gap-1 transition-all"
              title="เปลี่ยนธีมสีการอ่าน"
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline text-[10px]">{currentTheme.name}</span>
            </button>

            {/* Theme Dropdown Menu */}
            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl p-1.5 z-40 space-y-1">
                <div className="text-[10px] text-amber-300/80 font-bold px-2 py-0.5 border-b border-slate-800 flex items-center justify-between">
                  <span>🎨 เลือกธีมสีอ่าน</span>
                  <span className="text-[9px] text-slate-400">พอดีจอ</span>
                </div>
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setThemeId(th.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      themeId === th.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{th.icon}</span>
                      <span>{th.name}</span>
                    </span>
                    {themeId === th.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(volume.n)}
            className={`p-1 sm:p-1.5 rounded-lg border transition-colors flex items-center justify-center text-xs ${
              isBookmarked
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-white/10 text-slate-300 hover:text-white border-white/20'
            }`}
            title={isBookmarked ? 'ยกเลิกคั่นหน้า' : 'คั่นเล่มนี้'}
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-slate-950' : ''}`} />
          </button>

          {/* External Link / Google Drive */}
          <a
            href={volume.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/20 transition-colors flex items-center justify-center text-xs"
            title="เปิดใน Google Drive โดยตรง"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECONDARY FLOATING ZOOM & QUICK ACTION BAR (MOBILE OPTIMIZED) */}
      <div
        className="px-2 py-1 flex items-center justify-between border-b text-xs backdrop-blur-md z-20"
        style={{
          backgroundColor:
            themeId === 'oled'
              ? 'rgba(10, 10, 10, 0.95)'
              : themeId === 'royal-navy'
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(240, 238, 230, 0.95)',
          borderColor: currentTheme.barBorder + '40',
          color: currentTheme.text,
        }}
      >
        {/* Left: Volume selector dropdown */}
        <div className="flex items-center gap-1">
          <label className="text-[10px] opacity-70 hidden sm:inline">เลือกเล่ม:</label>
          <select
            value={volume.n}
            onChange={(e) => {
              const selectedN = parseInt(e.target.value, 10);
              const found = allVolumes.find((v) => v.n === selectedN);
              if (found) onSelectVolume(found);
            }}
            className="px-2 py-0.5 rounded-lg bg-black/20 border border-slate-500/30 text-[11px] font-semibold outline-none cursor-pointer"
            style={{ color: currentTheme.text }}
          >
            {allVolumes.map((v) => (
              <option key={v.n} value={v.n} className="bg-slate-900 text-white">
                เล่มที่ {v.thaiN} ({v.n}) - {v.catLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Center & Right: FREE ZOOM CONTROLS (ซูมอิสระบนมือถือ พอดีจอ) */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 60}
            className="p-1 rounded-md bg-black/15 hover:bg-black/25 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center"
            title="ย่อขนาด"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 rounded-md bg-black/15 hover:bg-black/25 text-[10px] font-mono font-semibold active:scale-95 transition-all flex items-center gap-1"
            title="รีเซ็ตพอดีจอ (100%)"
          >
            <RotateCcw className="w-2.5 h-2.5 opacity-70" />
            <span>{zoomLevel}%</span>
          </button>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 220}
            className="p-1 rounded-md bg-black/15 hover:bg-black/25 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center"
            title="ขยายขนาด (ซูม)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-md bg-black/15 hover:bg-black/25 text-[10px] hidden sm:flex items-center justify-center transition-all ml-1"
            title="เต็มจอ"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MAIN DOCUMENT VIEWPORT (EDGE TO EDGE, ZOOMABLE) */}
      <div
        className="flex-1 relative w-full h-full overflow-auto custom-scrollbar flex items-start justify-center p-0.5 sm:p-1"
        style={{ backgroundColor: currentTheme.bg }}
      >
        {/* Loading Spinner Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs text-white">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="font-maitree text-xs font-semibold text-amber-300 flex items-center gap-1">
              <span>☸</span> กำลังเปิดคัมภีร์ เล่มที่ {volume.thaiN}...
            </p>
            <span className="text-[10px] text-slate-300 opacity-80 mt-0.5">
              ระบบแคชกำลังเชื่อมต่อเอกสารความละเอียดสูง
            </span>
          </div>
        )}

        {/* Iframe WebView Wrapper with Free Zoom */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            width: zoomLevel > 100 ? `${zoomLevel}%` : '100%',
            minHeight: '100%',
          }}
        >
          <iframe
            key={iframeKey}
            src={driveEmbedUrl}
            title={`พระไตรปิฎก เล่มที่ ${volume.n}`}
            className="w-full h-full rounded-md border-0 shadow-lg"
            style={{
              minHeight: 'calc(100vh - 90px)',
              backgroundColor: currentTheme.bg,
            }}
            onLoad={() => setIsLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* BOTTOM CONTINUOUS READING CONTROLS */}
      <div
        className="px-3 py-1.5 border-t shadow-lg flex items-center justify-between text-xs z-20 transition-colors duration-300"
        style={{
          backgroundColor: currentTheme.barBg,
          borderColor: currentTheme.barBorder + '40',
        }}
      >
        <button
          onClick={handlePrevVolume}
          disabled={volume.n <= 1}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-200 hover:text-white transition-all flex items-center gap-1 text-[11px]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>เล่มก่อนหน้า ({volume.n > 1 ? volume.n - 1 : '-'})</span>
        </button>

        <div className="text-center hidden sm:block">
          <span className="text-[10px] text-amber-300 font-medium">
            คัมภีร์รัตนบรมธรรม • พอดีจอ • ซูมอิสระ
          </span>
        </div>

        <button
          onClick={handleNextVolume}
          disabled={volume.n >= 45}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-200 hover:text-white transition-all flex items-center gap-1 text-[11px]"
        >
          <span>เล่มถัดไป ({volume.n < 45 ? volume.n + 1 : '-'})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
