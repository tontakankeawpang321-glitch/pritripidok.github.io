import React, { useState } from 'react';
import { AUDIO_LIST } from '../data/tipitakaData';
import { AudioTrack } from '../types';
import { X, Headphones, Play, Pause } from 'lucide-react';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({ isOpen, onClose }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(AUDIO_LIST[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sarabun">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
        {/* Header */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-base">🎧</span>
            <div>
              <h2 className="font-maitree text-xs sm:text-sm font-bold text-amber-300 leading-tight">
                เสียงอ่านพระไตรปิฎก & คลังลิงก์เสียง
              </h2>
              <p className="text-[9px] text-slate-300 opacity-80">
                รับฟังเสียงอ่านคัมภีร์ธรรมะ และพระสูตรสำคัญ
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

        {/* Content */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-2.5">
          {/* Active Player Card */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-200 truncate pr-2">
                {currentTrack ? currentTrack.title : 'กดเลือกบทธรรมด้านล่างเพื่อเริ่มฟัง...'}
              </span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex-shrink-0">
                Audio Player
              </span>
            </div>
            <audio
              controls
              autoPlay={isPlaying}
              src={currentTrack.url}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-9 rounded-lg border border-slate-600 bg-slate-950"
            >
              เบราว์เซอร์ของท่านไม่รองรับการเล่นไฟล์เสียง
            </audio>
          </div>

          {/* Playlist */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">📜 คลังรายการเสียงอ่าน:</span>
              <span className="text-[10px] text-amber-400 font-normal">
                {AUDIO_LIST.length} รายการ
              </span>
            </h4>

            <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {AUDIO_LIST.map((item, idx) => {
                const isActive = currentTrack.url === item.url;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTrack(item);
                      setIsPlaying(true);
                    }}
                    className={`w-full p-2 rounded-lg border flex items-center justify-between gap-2 transition-all text-left ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-emerald-600/20 text-emerald-400'
                        }`}
                      >
                        {isActive && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-medium truncate">{item.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-[9px] text-slate-400">รองรับไฟล์ MP3 และการสตรีมออนไลน์</span>
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
