import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CommunityPost, CommunityReply } from '../types';
import { GAS_WEB_APP_URL, SAMPLE_POSTS } from '../data/tipitakaData';
import { MessageSquare, Send, RefreshCw, Trash2, PlusCircle, X, Check, User } from 'lucide-react';

const KEY_LOCAL_POSTS = 'tipitaka_local_posts_v6';

export const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // New post form state
  const [author, setAuthor] = useState<string>('');
  const [category, setCategory] = useState<string>('ถาม-ตอบ ปัญหาธรรม');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reply input state
  const [replyAuthors, setReplyAuthors] = useState<Record<string, string>>({});
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});

  const getLocalPosts = (): CommunityPost[] => {
    try {
      const stored = localStorage.getItem(KEY_LOCAL_POSTS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(KEY_LOCAL_POSTS, JSON.stringify(SAMPLE_POSTS));
      return SAMPLE_POSTS;
    } catch {
      return SAMPLE_POSTS;
    }
  };

  const savePostsToLocal = (newPosts: CommunityPost[]) => {
    try {
      localStorage.setItem(KEY_LOCAL_POSTS, JSON.stringify(newPosts));
    } catch (e) {
      console.warn('Error saving local posts:', e);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    let loaded: CommunityPost[] = [];

    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      try {
        const cacheBuster = `${GAS_WEB_APP_URL}${GAS_WEB_APP_URL.includes('?') ? '&' : '?'}t=${Date.now()}`;
        const res = await fetch(cacheBuster);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            loaded = data;
          } else {
            loaded = getLocalPosts();
          }
        } else {
          loaded = getLocalPosts();
        }
      } catch {
        loaded = getLocalPosts();
      }
    } else {
      loaded = getLocalPosts();
    }

    setPosts(loaded);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        title: 'โปรดระบุข้อมูล',
        text: 'กรุณากรอกหัวข้อและเนื้อหาข้อความให้ครบถ้วน',
        icon: 'warning',
        confirmButtonColor: '#0f172a',
        confirmButtonText: 'ตกลง',
        customClass: { popup: 'font-sarabun rounded-2xl' },
      });
      return;
    }

    setIsSubmitting(true);
    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      date: new Date().toLocaleString('th-TH'),
      author: author.trim() || 'ผู้ใฝ่ธรรมะ',
      category,
      title: title.trim(),
      content: content.trim(),
      replies: [],
    };

    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      try {
        await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'createPost', ...newPost }),
        });
      } catch {
        const currentLocal = getLocalPosts();
        savePostsToLocal([...currentLocal, newPost]);
      }
    } else {
      const currentLocal = getLocalPosts();
      savePostsToLocal([...currentLocal, newPost]);
    }

    setTitle('');
    setContent('');
    setShowForm(false);
    setIsSubmitting(false);

    Swal.fire({
      title: 'ส่งข้อความสำเร็จ!',
      text: 'เผยแพร่ข้อความสนทนาธรรมเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'font-sarabun rounded-2xl' },
    });

    await fetchPosts();
  };

  const handleSubmitReply = async (postId: string) => {
    const replyAuthor = replyAuthors[postId]?.trim() || 'ผู้ตอบธรรม';
    const replyContent = replyContents[postId]?.trim() || '';

    if (!replyContent) {
      Swal.fire({
        title: 'โปรดพิมพ์ข้อความ',
        text: 'กรุณาระบุเนื้อหาความคิดเห็นตอบกลับ',
        icon: 'info',
        confirmButtonColor: '#0f172a',
        confirmButtonText: 'ตกลง',
        customClass: { popup: 'font-sarabun rounded-2xl' },
      });
      return;
    }

    const newReply: CommunityReply = {
      id: 'rep-' + Date.now(),
      date: new Date().toLocaleString('th-TH'),
      author: replyAuthor,
      content: replyContent,
    };

    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      try {
        await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'addReply', postId, reply: newReply }),
        });
      } catch {
        const currentLocal = getLocalPosts();
        const found = currentLocal.find((p) => p.id === postId);
        if (found) {
          if (!found.replies) found.replies = [];
          found.replies.push(newReply);
          savePostsToLocal(currentLocal);
        }
      }
    } else {
      const currentLocal = getLocalPosts();
      const found = currentLocal.find((p) => p.id === postId);
      if (found) {
        if (!found.replies) found.replies = [];
        found.replies.push(newReply);
        savePostsToLocal(currentLocal);
      }
    }

    setReplyContents((prev) => ({ ...prev, [postId]: '' }));
    setExpandedReplies((prev) => ({ ...prev, [postId]: true }));
    await fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบข้อความ?',
      text: 'คุณต้องการลบข้อความสนทนานี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ลบข้อความ',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'font-sarabun rounded-2xl',
        title: 'font-maitree text-slate-900 text-sm sm:text-base font-bold',
      },
    });

    if (!result.isConfirmed) return;

    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      try {
        await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deletePost', id: postId, postId }),
        });
      } catch {
        const current = getLocalPosts().filter((p) => p.id !== postId);
        savePostsToLocal(current);
      }
    } else {
      const current = getLocalPosts().filter((p) => p.id !== postId);
      savePostsToLocal(current);
    }

    Swal.fire({
      title: 'ลบเรียบร้อย!',
      text: 'ลบข้อความสนทนาเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
      customClass: { popup: 'font-sarabun rounded-2xl' },
    });

    await fetchPosts();
  };

  const handleDeleteReply = async (postId: string, replyId: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบความคิดเห็น?',
      text: 'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ลบความคิดเห็น',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'font-sarabun rounded-2xl',
        title: 'font-maitree text-slate-900 text-sm sm:text-base font-bold',
      },
    });

    if (!result.isConfirmed) return;

    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      try {
        await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteReply', postId, replyId }),
        });
      } catch {
        const current = getLocalPosts();
        const found = current.find((p) => p.id === postId);
        if (found && found.replies) {
          found.replies = found.replies.filter((r) => r.id !== replyId);
          savePostsToLocal(current);
        }
      }
    } else {
      const current = getLocalPosts();
      const found = current.find((p) => p.id === postId);
      if (found && found.replies) {
        found.replies = found.replies.filter((r) => r.id !== replyId);
        savePostsToLocal(current);
      }
    }

    await fetchPosts();
  };

  return (
    <div className="p-2 sm:p-3 max-w-3xl mx-auto space-y-2.5 font-sarabun">
      {/* TOP COMMUNITY BANNER */}
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-indigo-950 text-white p-2.5 rounded-xl border border-amber-500/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-maitree text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <span>💬</span> ชุมชนธรรมสากัจฉา (พูดคุย แลกเปลี่ยนความรู้)
          </h2>
          <p className="text-[10px] text-slate-300 mt-0.5 opacity-90">
            ร่วมตั้งคำถาม ตอบปัญหาธรรม ตอบคอมเมนต์ และแชร์บันทึกธรรมทาน
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] sm:text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>โพสต์ข้อความ</span>
          </button>
          <button
            onClick={fetchPosts}
            disabled={isLoading}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-[10px] sm:text-xs border border-slate-700 flex items-center gap-1 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* POST SUBMISSION FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmitPost}
          className="bg-white border-2 border-amber-400 rounded-xl p-3 shadow-md space-y-2 text-xs"
        >
          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
            <h3 className="font-maitree text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>📝</span> เขียนข้อความแลกเปลี่ยนธรรมะ
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-0.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>ปิด</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                ชื่อ / นามแฝง / ฉายาพระ
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="เช่น พระสมชาย / อุบาสกใจดี"
                className="w-full px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-slate-800 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-slate-800 text-xs text-slate-800"
              >
                <option value="ถาม-ตอบ ปัญหาธรรม">❓ ถาม-ตอบ ปัญหาธรรม</option>
                <option value="ข้อคิดธรรมะประจำวัน">💡 ข้อคิดธรรมะประจำวัน</option>
                <option value="สนทนาพระสูตร/พระวินัย">📖 สนทนาพระสูตร/พระวินัย</option>
                <option value="ประสบการณ์ปฏิบัติธรรม">🧘‍♂️ ประสบการณ์ปฏิบัติธรรม</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
              หัวข้อเรื่อง
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุหัวข้อที่ต้องการพูดคุย..."
              className="w-full px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-slate-800 text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
              เนื้อหา / ข้อความสนทนา
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="พิมพ์รายละเอียดบทธรรม คำถาม หรือข้อคิดที่นี่..."
              className="w-full px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-slate-800 text-xs text-slate-800"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1 bg-slate-900 hover:bg-slate-950 text-amber-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
            </button>
          </div>
        </form>
      )}

      {/* POSTS LIST FEED */}
      {isLoading && (
        <div className="text-center py-6">
          <span className="inline-block w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[11px] text-slate-500 mt-1">กำลังโหลดข้อมูลสนทนาธรรม...</p>
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="bg-white p-5 rounded-xl text-center border border-stone-200">
          <span className="text-xl block mb-1">💬</span>
          <p className="text-xs font-semibold text-slate-700">ยังไม่มีโพสต์สนทนาธรรม</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            กดปุ่ม "โพสต์ข้อความ" เพื่อเริ่มเปิดประเด็นพูดคุยคนแรก
          </p>
        </div>
      )}

      <div className="space-y-2">
        {posts
          .slice()
          .reverse()
          .map((p) => {
            const repliesList = p.replies || [];
            const isExpanded = !!expandedReplies[p.id];

            return (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-xl p-2.5 shadow-xs hover:border-amber-400 transition-all space-y-1.5"
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-[9px] text-stone-500 border-b border-stone-100 pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                      {p.category || 'สนทนาธรรม'}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-0.5">
                      <User className="w-2.5 h-2.5 text-slate-500" />
                      {p.author || 'ผู้ไม่ประสงค์ออกนาม'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕒 {p.date || ''}</span>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      title="ลบโพสต์นี้"
                      className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-maitree text-xs font-bold text-slate-900 leading-snug">
                  {p.title}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-light">
                  {p.content}
                </p>

                {/* Footer action bar */}
                <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => toggleReplies(p.id)}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-md font-medium transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-amber-700" />
                    <span>ตอบกลับ</span>
                    <span className="bg-amber-200 text-amber-900 px-1.5 py-0.1 rounded-full text-[9px] font-bold">
                      {repliesList.length}
                    </span>
                  </button>
                  <span className="text-[9px] text-stone-400">ID: {p.id}</span>
                </div>

                {/* REPLIES SECTION (COLLAPSIBLE) */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-stone-200/80 bg-stone-50/80 p-2 rounded-lg space-y-2">
                    <div className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                      <span>ความคิดเห็นและการตอบกลับ ({repliesList.length})</span>
                    </div>

                    <div className="space-y-1.5">
                      {repliesList.length === 0 ? (
                        <p className="text-[10px] text-stone-400 py-1 text-center font-light">
                          ยังไม่มีคำตอบรับ/ความคิดเห็น เป็นคนแรกที่เริ่มตอบกลับ...
                        </p>
                      ) : (
                        repliesList.map((r) => (
                          <div
                            key={r.id}
                            className="bg-white p-2 rounded-lg border border-stone-200/80 space-y-0.5 relative group"
                          >
                            <div className="flex items-center justify-between text-[9px] text-stone-500">
                              <span className="font-bold text-amber-900">
                                💬 {r.author || 'ผู้ตอบ'}
                              </span>
                              <div className="flex items-center gap-1">
                                <span>🕒 {r.date || ''}</span>
                                <button
                                  onClick={() => handleDeleteReply(p.id, r.id)}
                                  title="ลบความคิดเห็นนี้"
                                  className="text-stone-300 hover:text-red-600 transition-colors p-0.5"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-stone-800 leading-relaxed font-light pl-1">
                              {r.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* REPLY SUBMISSION INPUT */}
                    <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <input
                          type="text"
                          value={replyAuthors[p.id] || ''}
                          onChange={(e) =>
                            setReplyAuthors((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          placeholder="ชื่อ / นามแฝงผู้ตอบ..."
                          className="sm:col-span-1 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:border-slate-800 text-slate-800"
                        />
                        <input
                          type="text"
                          value={replyContents[p.id] || ''}
                          onChange={(e) =>
                            setReplyContents((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(p.id)}
                          placeholder="พิมพ์ความคิดเห็นตอบกลับ..."
                          className="sm:col-span-2 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:border-slate-800 text-slate-800"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSubmitReply(p.id)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all"
                        >
                          <span>ส่งความเห็น</span>
                          <Send className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
