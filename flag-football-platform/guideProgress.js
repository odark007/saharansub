// js/services/guideProgress.js
// Handles read/write of referee guide progress for:
//   - Authenticated users → Supabase table referee_guide_progress
//   - Guest users         → localStorage key 'nfl_guide_progress'
//
// Merge strategy: when a guest signs in, localStorage progress is
// compared to any existing Supabase record and the furthest page wins.

import { supabase } from '../auth.js';
import { TOTAL_PAGES } from '../data/nflGuidePages.js';

const LOCAL_KEY = 'nfl_guide_progress';

// ─────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────

function getLocalProgress() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      currentPage:     parsed.currentPage     || 1,
      completedPages:  parsed.completedPages  || [],
      lastUpdated:     parsed.lastUpdated     || null,
    };
  } catch {
    return null;
  }
}

function setLocalProgress(currentPage, completedPages) {
  const record = {
    currentPage,
    completedPages,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_KEY, JSON.stringify(record));
}

function clearLocalProgress() {
  localStorage.removeItem(LOCAL_KEY);
}

async function getRemoteProgress(userId) {
  const { data, error } = await supabase
    .from('referee_guide_progress')
    .select('current_page, completed_pages, last_updated')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[guideProgress] getRemoteProgress error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    currentPage:    data.current_page,
    completedPages: data.completed_pages || [],
    lastUpdated:    data.last_updated,
  };
}

async function saveRemoteProgress(userId, currentPage, completedPages) {
  const { error } = await supabase.rpc('upsert_guide_progress', {
    p_user_id:         userId,
    p_session_id:      null,
    p_current_page:    currentPage,
    p_completed_pages: completedPages,
  });
  if (error) {
    console.error('[guideProgress] saveRemoteProgress error:', error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────

/**
 * Load progress for the current user.
 * Checks auth state and returns { currentPage, completedPages }.
 * Falls back to { currentPage: 1, completedPages: [] } if no record found.
 */
export async function loadProgress() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    const remote = await getRemoteProgress(session.user.id);
    if (remote) return remote;
    // No remote record yet — check if there's local progress to migrate
    const local = getLocalProgress();
    if (local) return local;
  } else {
    // Guest
    const local = getLocalProgress();
    if (local) return local;
  }

  return { currentPage: 1, completedPages: [] };
}

/**
 * Save progress after every page advance.
 * @param {number} currentPage   - The page the user just arrived on
 * @param {number[]} completedPages - Array of completed page numbers
 */
export async function saveProgress(currentPage, completedPages) {
  const { data: { session } } = await supabase.auth.getSession();

  // Always write to localStorage (instant, offline-safe)
  setLocalProgress(currentPage, completedPages);

  // Also write to Supabase if authenticated
  if (session?.user) {
    try {
      await saveRemoteProgress(session.user.id, currentPage, completedPages);
    } catch {
      // Non-fatal — local copy already saved, will sync next time
      console.warn('[guideProgress] Remote save failed; local copy preserved.');
    }
  }
}

/**
 * Mark a page as completed and advance to the next page.
 * Returns the new { currentPage, completedPages }.
 * @param {number} completedPageNumber - Page number just finished
 */
export async function advancePage(completedPageNumber) {
  const { completedPages } = await loadProgress();

  const updated = completedPages.includes(completedPageNumber)
    ? completedPages
    : [...completedPages, completedPageNumber];

  const nextPage = Math.min(completedPageNumber + 1, TOTAL_PAGES);
  await saveProgress(nextPage, updated);

  return { currentPage: nextPage, completedPages: updated };
}

/**
 * Navigate to a specific page without marking any page as complete.
 * Used for Prev navigation and resume from saved position.
 */
export async function navigateToPage(pageNumber) {
  const { completedPages } = await loadProgress();
  const safePage = Math.max(1, Math.min(pageNumber, TOTAL_PAGES));
  await saveProgress(safePage, completedPages);
  return { currentPage: safePage, completedPages };
}

/**
 * Merge guest localStorage progress into Supabase after sign-in.
 * Called from app.js handleAuthenticatedUser().
 * The furthest current_page wins; completed_pages are merged (union).
 */
export async function mergeGuestProgress(userId) {
  const local = getLocalProgress();
  if (!local) return; // Nothing to merge

  const remote = await getRemoteProgress(userId);

  const mergedCurrentPage = remote
    ? Math.max(local.currentPage, remote.currentPage)
    : local.currentPage;

  const localSet  = new Set(local.completedPages);
  const remoteSet = remote ? new Set(remote.completedPages) : new Set();
  const mergedCompleted = Array.from(new Set([...localSet, ...remoteSet]));

  await saveRemoteProgress(userId, mergedCurrentPage, mergedCompleted);
  clearLocalProgress(); // Clean up now that it's in Supabase

  console.log('[guideProgress] Guest progress merged into Supabase:', {
    mergedCurrentPage,
    mergedCompleted,
  });
}

/**
 * Reset all progress (both local and remote).
 * Used for "start over" functionality.
 */
export async function resetProgress() {
  clearLocalProgress();

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { error } = await supabase
      .from('referee_guide_progress')
      .delete()
      .eq('user_id', session.user.id);
    if (error) {
      console.error('[guideProgress] resetProgress remote error:', error.message);
    }
  }
}

/**
 * Get a simple progress percentage (0–100).
 */
export function getProgressPercent(completedPages) {
  if (!completedPages || completedPages.length === 0) return 0;
  return Math.round((completedPages.length / TOTAL_PAGES) * 100);
}

/**
 * Check if the guide has been completed (all pages done).
 */
export function isGuideComplete(completedPages) {
  return completedPages && completedPages.length >= TOTAL_PAGES;
}