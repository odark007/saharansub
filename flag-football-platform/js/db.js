// DB - Minimal
export class DB {
  async init() {
    console.log('DB initialized');
    return true;
  }

  async getOfflineQueue() {
    return [];
  }

  async removeFromOfflineQueue(id) {
    return true;
  }
}