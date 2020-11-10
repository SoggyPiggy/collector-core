export default class TextSection extends String {
  constructor(title, text) {
    super(text);
    this.title = title;
  }
}
