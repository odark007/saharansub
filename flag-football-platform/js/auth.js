// Auth - Minimal
export class Auth {
  async getCurrentUser() {
    return null; // Anonymous for now
  }

  async getUserData(userId) {
    return null;
  }

  async signOut() {
    return true;
  }

  async syncBookmark(data) {
    return true;
  }

  async syncProgress(data) {
    return true;
  }

  async syncQuizAttempt(data) {
    return true;
  }
}