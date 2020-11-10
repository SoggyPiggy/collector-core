export default class ListSection extends Array {
  constructor(title, items) {
    super(...items);
    this.title = title;
  }
}
