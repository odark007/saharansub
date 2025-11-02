// Authentication with Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Initialize Supabase client
const SUPABASE_URL = 'https://xfkguhvailhntmyratbl.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your actual anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class Auth {
  constructor() {
    this.currentUser = null;
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
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
        password
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          role: userData.role,
          age_range: userData.ageRange || null,
          location: userData.location || null,
          experience_level: userData.experienceLevel || null,
          default_rulebook: userData.defaultRulebook || 'nfl_flag'
        });

      if (profileError) throw profileError;

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