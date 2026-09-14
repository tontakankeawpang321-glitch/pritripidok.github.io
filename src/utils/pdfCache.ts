import { CachedDocMeta } from '../types';

const CACHE_DOCS_KEY = 'tipitaka_cached_docs_v1';
const LAST_READ_KEY = 'tipitaka_last_read_volume';

export const PdfCacheManager = {
  // Get all cached documents metadata
  getCachedDocs(): Record<number, CachedDocMeta> {
    try {
      const data = localStorage.getItem(CACHE_DOCS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Error loading pdf cache:', e);
      return {};
    }
  },

  // Check if a specific volume is already cached/visited
  isCached(volumeNum: number): boolean {
    const docs = this.getCachedDocs();
    return !!docs[volumeNum];
  },

  // Record a volume being opened / cached
  recordAccess(volumeNum: number, title: string, desc: string, fileId: string): CachedDocMeta {
    try {
      const docs = this.getCachedDocs();
      const now = Date.now();
      const existing = docs[volumeNum];

      const updated: CachedDocMeta = {
        volumeNum,
        title,
        desc,
        fileId,
        cachedAt: existing ? existing.cachedAt : now,
        lastOpenedAt: now,
        openCount: existing ? existing.openCount + 1 : 1,
      };

      docs[volumeNum] = updated;
      localStorage.setItem(CACHE_DOCS_KEY, JSON.stringify(docs));
      localStorage.setItem(LAST_READ_KEY, volumeNum.toString());
      return updated;
    } catch (e) {
      console.warn('Error writing pdf cache:', e);
      return {
        volumeNum,
        title,
        desc,
        fileId,
        cachedAt: Date.now(),
        lastOpenedAt: Date.now(),
        openCount: 1,
      };
    }
  },

  // Get the last read volume number
  getLastReadVolume(): number | null {
    try {
      const val = localStorage.getItem(LAST_READ_KEY);
      return val ? parseInt(val, 10) : null;
    } catch {
      return null;
    }
  },

  // Get total cached count
  getCachedCount(): number {
    return Object.keys(this.getCachedDocs()).length;
  },

  // Clear all cached reading metadata
  clearAllCache(): void {
    localStorage.removeItem(CACHE_DOCS_KEY);
    localStorage.removeItem(LAST_READ_KEY);
  },
};
