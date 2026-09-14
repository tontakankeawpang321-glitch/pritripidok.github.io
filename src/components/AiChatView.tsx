import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import {
  Send,
  Key,
  Copy,
  Check,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const DEFAULT_THAILLM_KEY = 'qq7mS60haC11qfirqIh6jUoIQarZvOaW';

export const AiChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: 'เจริญพร... ระบบเชื่อมต่อ ThaiLLM API เรียบร้อยแล้ว มีข้อสงสัยในบทธรรม พระสูตร หรือพระวินัย ๔๕ เล่มส่วนใด สอบถามอาตมาได้ทันที',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      source: 'thaillm',
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thaiLlmKey, setThaiLlmKey] = useState<string>(DEFAULT_THAILLM_KEY);
  const [showKeySetting, setShowKeySetting] = useState<boolean>(false);
  const [keySavedToast, setKeySavedToast] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load saved ThaiLLM API Key from localStorage or use default key
  useEffect(() => {
    const savedKey = localStorage.getItem('thaillm_api_key');
    if (savedKey) {
      setThaiLlmKey(savedKey);
    } else {
      setThaiLlmKey(DEFAULT_THAILLM_KEY);
      localStorage.setItem('thaillm_api_key', DEFAULT_THAILLM_KEY);
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSaveKey = () => {
    const keyToSave = thaiLlmKey.trim() || DEFAULT_THAILLM_KEY;
    setThaiLlmKey(keyToSave);
    localStorage.setItem('thaillm_api_key', keyToSave);
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeySetting(false);
    }, 1200);
  };

  const handleResetDefaultKey = () => {
    setThaiLlmKey(DEFAULT_THAILLM_KEY);
    localStorage.setItem('thaillm_api_key', DEFAULT_THAILLM_KEY);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 1200);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!query || isThinking) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsThinking(true);

    try {
      const savedKey = localStorage.getItem('thaillm_api_key') || thaiLlmKey;

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          thaillm_api_key: savedKey.trim() || undefined,
          history: messages.slice(-4),
        }),
      });

      let replyText = '';
      let source: 'thaillm' | 'gemini' | 'builtin' = 'builtin';

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
        source = data.source || 'builtin';
      } else {
        replyText = 'ขออภัย ระบบเชื่อมต่อขัดข้องชั่วคราว โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        role: 'assistant',
        text: 'เจริญพร... ขออภัยเกิดข้อผิดพลาดในการรับข้อมูล โปรดลองถามคำถามอีกครั้ง',
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        source: 'builtin',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickPrompts = [
    { label: '💡 อริยสัจ ๔', query: 'สรุปอริยสัจ 4 โดยย่อ' },
    { label: '📖 พระวินัยเล่ม ๑', query: 'สรุปความสำคัญของ เล่มที่ 1 พระวินัย' },
    { label: '🧘‍♂️ เจริญสติ', query: 'การเจริญสติในชีวิตประจำวันทำอย่างไร' },
    { label: '☸️ มรรค ๘', query: 'มรรคมีองค์ 8 ประกอบด้วยอะไรบ้าง' },
  ];

  return (
    <div className="p-1.5 sm:p-3 max-w-3xl mx-auto font-sarabun">
      <div className="bg-white border border-slate-300 rounded-xl shadow-md overflow-hidden flex flex-col h-[78vh] sm:h-[80vh]">
        {/* COMPACT HEADER */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-3 py-2 flex items-center justify-between border-b border-amber-500/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 text-sm">☸</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-maitree text-xs font-bold text-amber-300 leading-none">
                  AI วิสัชนาธรรม
                </h3>
                <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-mono">
                  {thaiLlmKey ? 'ThaiLLM เชื่อมต่อแล้ว' : 'ระบบมาตรฐาน'}
                </span>
              </div>
              <p className="text-[9px] text-slate-300 opacity-80 mt-0.5">
                สอบถามข้อสงสัยในพระไตรปิฎก ๔๕ เล่ม และหลักธรรมะ
              </p>
            </div>
          </div>

          {/* ThaiLLM API Key Setting Toggle */}
          <button
            onClick={() => setShowKeySetting(!showKeySetting)}
            className={`px-2 py-1 rounded-lg text-[10px] border flex items-center gap-1 transition-all ${
              thaiLlmKey
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-800 border-amber-500/40 text-amber-300 hover:bg-slate-700'
            }`}
            title="ตั้งค่า ThaiLLM API Key"
          >
            <Key className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">ThaiLLM Key</span>
            {showKeySetting ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* THAILLM API KEY CONFIG DRAWER (COMPACT & CLEAN) */}
        {showKeySetting && (
          <div className="bg-stone-100 border-b border-stone-200 p-2.5 transition-all text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ตั้งค่า ThaiLLM API Key (thaillm.or.th)
              </span>
              <span className="text-[9px] text-slate-500">บันทึกในอุปกรณ์ ปลอดภัย</span>
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={thaiLlmKey}
                onChange={(e) => setThaiLlmKey(e.target.value)}
                placeholder="ป้อน thaillm_api_key..."
                className="flex-1 px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:border-slate-800 text-slate-800 font-mono"
              />
              <button
                onClick={handleSaveKey}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-950 text-amber-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                {keySavedToast ? <Check className="w-3 h-3 text-emerald-400" /> : 'บันทึก'}
              </button>
              <button
                onClick={handleResetDefaultKey}
                className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs transition-colors"
                title="รีเซ็ตเป็นคีย์หลักที่เชื่อมต่อไว้"
              >
                รีเซ็ต
              </button>
            </div>

            <p className="text-[9px] text-emerald-700 font-medium leading-tight flex items-center gap-1">
              <span>✓</span> เชื่อมต่อ API Key ของ ThaiLLM ({thaiLlmKey ? `${thaiLlmKey.slice(0, 6)}...${thaiLlmKey.slice(-4)}` : 'พร้อมใช้งาน'}) เรียบร้อยแล้ว
            </p>
          </div>
        )}

        {/* QUICK PROMPT CHIPS */}
        <div className="bg-stone-100 px-2 py-1 border-b border-stone-200 flex gap-1 overflow-x-auto text-[10px] whitespace-nowrap custom-scrollbar flex-shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              className="px-2 py-0.5 bg-white border border-stone-300 rounded-full text-stone-700 hover:bg-amber-50 active:scale-95 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* CHAT MESSAGES HISTORY */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-2.5 overflow-y-auto bg-stone-50 space-y-2.5 custom-scrollbar text-xs"
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 shadow-xs">
                    ☸
                  </div>
                )}

                <div
                  className={`max-w-[86%] sm:max-w-[80%] p-2 rounded-xl text-xs leading-relaxed shadow-xs relative group ${
                    isUser
                      ? 'bg-slate-900 text-amber-200 rounded-tr-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Bubble Footer: Timestamp & Action buttons for AI */}
                  <div
                    className={`mt-1 flex items-center justify-between text-[9px] pt-0.5 ${
                      isUser ? 'text-amber-300/60 justify-end' : 'text-stone-400 border-t border-stone-100'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-70 font-mono">{m.time}</span>
                        {m.source && (
                          <span className="px-1 py-0.2 rounded bg-stone-100 text-stone-600 text-[8px]">
                            {m.source === 'thaillm'
                              ? 'ThaiLLM'
                              : m.source === 'gemini'
                              ? 'Gemini'
                              : 'พระไตรปิฎก'}
                          </span>
                        )}
                      </div>
                    )}

                    {!isUser && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeak(m.text)}
                          className="p-1 hover:text-amber-800 text-stone-400 transition-colors"
                          title="ฟังเสียงอ่าน"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopy(m.text, m.id)}
                          className="p-1 hover:text-amber-800 text-stone-400 transition-colors"
                          title="คัดลอกข้อความ"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {isUser && <span className="font-mono">{m.time}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex items-start gap-1.5">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 animate-pulse">
                ☸
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                <span>กำลังค้นหาคัมภีร์วิสัชนาธรรม...</span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT FOOTER */}
        <div className="p-2 bg-white border-t border-stone-200 flex gap-1.5 items-center flex-shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="พิมพ์ปัญหาธรรมะที่นี่..."
            className="flex-1 px-3 py-1.5 bg-stone-100 border border-stone-300 focus:border-slate-900 focus:bg-white rounded-lg text-xs text-stone-800 outline-none transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isThinking}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 disabled:opacity-40 text-amber-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all active:scale-95"
          >
            <span>ส่ง</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
