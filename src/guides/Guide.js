import ListSection from './ListSection';
import TextSection from './TextSection';

export default class Guide {
  constructor(title = '', description = '') {
    this.title = title;
    this.description = description;
    this.sections = [];
  }

  addText(title, text) {
    this.sections.push(new TextSection(title, text));
    return this;
  }

  addList(title, items) {
    this.sections.push(new ListSection(title, items));
    return this;
  }
}
