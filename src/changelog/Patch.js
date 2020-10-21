export default class Patch {
  constructor({ version = '0', notes = [] }) {
    this.version = version;
    this.notes = notes;
  }
}
