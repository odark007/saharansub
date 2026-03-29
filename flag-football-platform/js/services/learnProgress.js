// js/services/learnProgress.js
// ─────────────────────────────────────────────────────────────
// Progress read/write for the Learn to Play feature.
//
// Storage strategy:
//   - Always writes to localStorage immediately (offline-safe)
//   - Also writes to Supabase if user is authenticated
//   - On sign-in: guest localStorage data merges into Supabase
//
// localStorage key per track: 'ltp_{trackId}'
// localStorage value: { completedLessons: string[], lastLessonId: string|null }
// ─────────────────────────────────────────────────────────────

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL     = 'https://xfkguhvailhntmyratbl.supabase.co';
const SUPABASE_ANON    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma2d1aHZhaWxobnRteXJhdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTgyNjgsImV4cCI6MjA3NzQzNDI2OH0.2JGSlS-xeB9jn7KnXjjlNZ8025vEH0yWOSpXskrwxI4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Export client so learn-to-play.html can reuse it (avoids duplicate instances)
export function getSupabaseClient() { return supabase; }

// ─────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────

function localKey(trackId) {
  return `ltp_${trackId}`;
}

function readLocal(trackId) {
  try {
    const raw = localStorage.getItem(localKey(trackId));
    if (!raw) return { completedLessons: [], lastLessonId: null };
    const parsed = JSON.parse(raw);
    return {
      completedLessons: parsed.completedLessons || [],
      lastLessonId:     parsed.lastLessonId     || null,
    };
  } catch {
    return { completedLessons: [], lastLessonId: null };
  }
}

function writeLocal(trackId, completedLessons, lastLessonId) {
  localStorage.setItem(localKey(trackId), JSON.stringify({
    completedLessons,
    lastLessonId,
  }));
}

function clearLocal(trackId) {
  localStorage.removeItem(localKey(trackId));
}

// ─────────────────────────────────────────────
// Supabase helpers
// ─────────────────────────────────────────────

async function getCurrentUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch {
    return null;
  }
}

function getSessionId() {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', id);
  }
  return id;
}

async function readRemote(userId, trackId) {
  try {
    const { data, error } = await supabase
      .from('learn_to_play_progress')
      .select('completed_lessons, last_lesson_id')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      completedLessons: data.completed_lessons || [],
      lastLessonId:     data.last_lesson_id    || null,
    };
  } catch {
    return null;
  }
}

async function writeRemote(userId, trackId, completedLessons, lastLessonId) {
  try {
    const { error } = await supabase.rpc('upsert_ltp_progress', {
      p_user_id:           userId,
      p_session_id:        null,
      p_track_id:          trackId,
      p_completed_lessons: completedLessons,
      p_last_lesson_id:    lastLessonId,
    });
    if (error) throw error;
  } catch (err) {
    console.warn('[learnProgress] Remote write failed:', err.message);
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * Load progress for a specific track.
 * Returns { completedLessons: string[], lastLessonId: string|null }
 */
export async function loadProgress(trackId) {
  const userId = await getCurrentUserId();

  if (userId) {
    const remote = await readRemote(userId, trackId);
    if (remote) return remote;
    // No remote record — fall back to local if it exists
    return readLocal(trackId);
  }

  return readLocal(trackId);
}

/**
 * Load progress for ALL tracks at once.
 * Returns a map: { [trackId]: { completedLessons, lastLessonId } }
 * Used by the hub to render progress bars without multiple awaits.
 */
export async function loadAllProgress(trackIds) {
  const userId = await getCurrentUserId();
  const result = {};

  if (userId) {
    try {
      const { data, error } = await supabase
        .from('learn_to_play_progress')
        .select('track_id, completed_lessons, last_lesson_id')
        .eq('user_id', userId)
        .in('track_id', trackIds);

      if (!error && data) {
        data.forEach(row => {
          result[row.track_id] = {
            completedLessons: row.completed_lessons || [],
            lastLessonId:     row.last_lesson_id    || null,
          };
        });
      }
    } catch {
      // Fall through to localStorage
    }
  }

  // Fill any missing tracks from localStorage
  trackIds.forEach(id => {
    if (!result[id]) {
      result[id] = readLocal(id);
    }
  });

  return result;
}

/**
 * Save progress for a track.
 * Always writes to localStorage, also writes to Supabase if authed.
 */
export async function saveProgress(trackId, completedLessons, lastLessonId) {
  // Always write locally first
  writeLocal(trackId, completedLessons, lastLessonId);

  // Write to Supabase if authenticated
  const userId = await getCurrentUserId();
  if (userId) {
    await writeRemote(userId, trackId, completedLessons, lastLessonId);
  }
}

/**
 * Mark a lesson as complete.
 * Adds lessonId to completedLessons, updates lastLessonId.
 * Returns updated { completedLessons, lastLessonId }.
 */
export async function markLessonComplete(trackId, lessonId) {
  const current = await loadProgress(trackId);

  const updated = current.completedLessons.includes(lessonId)
    ? current.completedLessons
    : [...current.completedLessons, lessonId];

  await saveProgress(trackId, updated, lessonId);

  return { completedLessons: updated, lastLessonId: lessonId };
}

/**
 * Get progress percentage for a track.
 * @param {string[]} completedLessons
 * @param {number} totalLessons
 * @returns {number} 0–100
 */
export function getProgressPercent(completedLessons, totalLessons) {
  if (!totalLessons || totalLessons === 0) return 0;
  return Math.round((completedLessons.length / totalLessons) * 100);
}

/**
 * Check if a specific lesson is complete.
 */
export function isLessonComplete(completedLessons, lessonId) {
  return completedLessons.includes(lessonId);
}

/**
 * Get the next incomplete lesson id in a track.
 * Returns null if all lessons are complete.
 */
export function getNextIncompleteLesson(lessons, completedLessons) {
  const next = lessons.find(l => !completedLessons.includes(l.id));
  return next ? next.id : null;
}

/**
 * Merge all guest localStorage progress into Supabase after sign-in.
 * Finds all 'ltp_*' keys in localStorage and upserts them to Supabase.
 * Completed lessons are unioned (local + remote).
 * Called from the auth sign-in handler.
 */
export async function mergeGuestProgress(userId) {
  const ltpKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ltp_')) {
      ltpKeys.push(key);
    }
  }

  if (ltpKeys.length === 0) return;

  for (const key of ltpKeys) {
    const trackId = key.replace('ltp_', '');
    const local   = readLocal(trackId);
    if (local.completedLessons.length === 0 && !local.lastLessonId) continue;

    // Fetch existing remote record
    const remote = await readRemote(userId, trackId);

    // Union completed lessons
    const merged = remote
      ? Array.from(new Set([...local.completedLessons, ...remote.completedLessons]))
      : local.completedLessons;

    // Keep the most recent lastLessonId (prefer remote if both exist)
    const lastLessonId = remote?.lastLessonId || local.lastLessonId;

    await writeRemote(userId, trackId, merged, lastLessonId);
    clearLocal(trackId);
  }

  console.log('[learnProgress] Guest progress merged into Supabase.');
}

/**
 * Reset all progress for a track.
 * Clears both localStorage and Supabase record.
 */
export async function resetTrackProgress(trackId) {
  clearLocal(trackId);

  const userId = await getCurrentUserId();
  if (userId) {
    try {
      await supabase
        .from('learn_to_play_progress')
        .delete()
        .eq('user_id', userId)
        .eq('track_id', trackId);
    } catch (err) {
      console.warn('[learnProgress] Remote reset failed:', err.message);
    }
  }
}
