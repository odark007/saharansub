// State Management - Minimal
export class State {
  constructor() {
    this.state = {};
  }

  getState(key) {
    return this.state[key];
  }

  setState(key, value) {
    this.state[key] = value;
  }

  clearState() {
    this.state = {};
  }
}