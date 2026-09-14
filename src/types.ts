export interface VolumeItem {
  n: number;
  thaiN: string;
  catKey: 'vinaya' | 'sutta' | 'abhidhamma';
  catLabel: string;
  tagBg: string;
  link: string;
  driveFileId: string;
  desc: string;
}

export interface AudioTrack {
  title: string;
  url: string;
}

export interface PodcastItem {
  ytId: string;
  title: string;
  desc: string;
}

export interface CommunityReply {
  id: string;
  date: string;
  author: string;
  content: string;
}

export interface CommunityPost {
  id: string;
  date: string;
  author: string;
  category: string;
  title: string;
  content: string;
  replies?: CommunityReply[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  source?: 'thaillm' | 'gemini' | 'builtin';
}

export type ReaderThemeId = 'manuscript' | 'royal-navy' | 'sepia' | 'oled' | 'clean';

export interface ReaderTheme {
  id: ReaderThemeId;
  name: string;
  icon: string;
  bg: string;
  text: string;
  barBg: string;
  barBorder: string;
  accent: string;
}

export interface CachedDocMeta {
  volumeNum: number;
  title: string;
  desc: string;
  fileId: string;
  cachedAt: number;
  lastOpenedAt: number;
  openCount: number;
}
