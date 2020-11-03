export default class Logger {
  constructor() {
    this._id = undefined;
    this.transaction = '';
    this.note = '';
    this.before = {};
    this.after = {};
    this.timestamp = new Date();
  }

  setNote(note) {
    this.note = `${note}`;
    return this;
  }

  setBefore(account) {
    this.before = { ...account };
    return this;
  }

  setAfter(account) {
    this.after = { ...account };
    const keys = [...(new Set([
      ...Object.keys(this.before),
      ...Object.keys(this.after),
    ]).values())];
    const altered = keys.filter((key) => this.before[key] !== this.after[key]);
    this.before = Object.fromEntries(altered.map((key) => [key, this.before[key]]));
    this.after = Object.fromEntries(altered.map((key) => [key, this.after[key]]));
    return this;
  }
}
