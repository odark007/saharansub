// Authentication with Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Initialize Supabase client
const SUPABASE_URL = 'https://xfkguhvailhntmyratbl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma2d1aHZhaWxobnRteXJhdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTgyNjgsImV4cCI6MjA3NzQzNDI2OH0.2JGSlS-xeB9jn7KnXjjlNZ8025vEH0yWOSpXskrwxI4'; // Replace with your actual anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class Auth {
  constructor() {
    this.currentUser = null;
  }

  // Get current user
  async getCurrentUser() {
    try {
      // First check if there's a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.log('No active session');
        return null;
      }

      if (!session) {
        console.log('No session found');
        return null;
      }

      // If session exists, get user
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      this.currentUser = user;
      return user;
    } catch (error) {
      // Don't log error if it's just "no session"
      if (!error.message.includes('session')) {
        console.error('Get current user error:', error);
      }
      return null;
    }
  }

  // Get user data from database
  async getUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Sign up new user
  async signUp(email, password, userData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role,
            age_range: userData.ageRange,
            gender: userData.gender,
            location: userData.location,
            experience_level: userData.experienceLevel,
            default_rulebook: userData.defaultRulebook
          }
        }
      });

      if (authError) throw authError;

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.currentUser = null;
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }

  // Sync bookmark to Supabase
  async syncBookmark(data) {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .upsert({
          user_id: data.userId,
          rule_id: data.ruleId,
          folder_name: data.folderName || null
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Sync bookmark error:', error);
      throw error;
    }
  }

  // Sync progress to Supabase
  async syncProgress(data) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: data.userId,
          rule_id: data.ruleId,
          rulebook_id: data.rulebookId,
          viewed: data.viewed,
          time_spent: data.timeSpent,
          last_viewed: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Sync progress error:', error);
      throw error;
    }
  }

  // Sync quiz attempt to Supabase
  async syncQuizAttempt(data) {
    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: data.userId,
          quiz_id: data.quizId,
          score: data.score,
          passed: data.passed,
          answers: data.answers
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Sync quiz attempt error:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Export supabase client for use in other modules
export { supabase };