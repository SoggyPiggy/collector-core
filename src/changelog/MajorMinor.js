export default class MajorMinor {
  constructor({ version = '0.0', name = 'Undefined', patches = [] }) {
    this.version = version;
    this.name = name;
    this.patches = patches;
  }
}
