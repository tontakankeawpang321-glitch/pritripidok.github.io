import React, { useState } from 'react';
import { PODCAST_LIST } from '../data/tipitakaData';
import { PodcastItem } from '../types';
import { X, Play, Film } from 'lucide-react';

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PodcastModal: React.FC<PodcastModalProps> = ({ isOpen, onClose }) => {
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItem>(PODCAST_LIST[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sarabun text-slate-100">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-base">🎬</span>
            <div>
              <h2 className="font-maitree text-xs sm:text-sm font-bold text-amber-300 leading-tight">
                วิดีโอสรุปเนื้อหา & พอดแคสต์ธรรมะ
              </h2>
              <p className="text-[9px] text-slate-300 opacity-80">
                ฟังธรรมบรรยายและภาพรวมพระไตรปิฎก ๔๕ เล่ม
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player & Playlist */}
        <div className="p-2 sm:p-3 overflow-y-auto custom-scrollbar flex-1 space-y-2.5">
          <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${currentPodcast.ytId}?autoplay=1&rel=0`}
                title={currentPodcast.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
            <h3 className="font-maitree font-semibold text-xs text-amber-200">
              {currentPodcast.title}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-light">
              {currentPodcast.desc}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Film className="w-3 h-3 text-red-400" />
              <span>รายการพอดแคสต์สรุปบทธรรม:</span>
            </h4>

            <div className="space-y-1 max-h-44 sm:max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {PODCAST_LIST.map((item, idx) => {
                const isActive = item.ytId === currentPodcast.ytId;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPodcast(item)}
                    className={`w-full text-left p-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-red-950/40 border-red-500/50 text-red-200'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-red-600/20 text-red-400'
                      }`}
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-medium truncate">
                        {idx + 1}. {item.title}
                      </h5>
                      <p className="text-[9px] text-slate-400 truncate font-light">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-[9px] text-slate-400">รองรับการแสดงผลทุกขนาดหน้าจอ</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium rounded-lg text-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
