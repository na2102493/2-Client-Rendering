import Item from "./item.js";
import Slide from "./slide.js";

function uniqueTags(tagGroups = []) {
  return [...new Set(tagGroups.flat())].sort();
}

export default class Deck extends Item {
  #title;
  #slides;

  constructor(deck = {}) {
    super(deck);
    this.#title = deck?.title ?? "Untitled";
    this.#slides = (deck?.slides ?? []).map((slide) => this.#toSlide(slide));
  }

  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value ?? "Untitled";
  }

  get slides() {
    return [...this.#slides];
  }

  get tags() {
    return uniqueTags(this.#slides.map((slide) => slide.tags));
  }

  get(id) {
    if (id === undefined) {
      return undefined;
    }

    return this.#slides.find((slide) => slide.id === id);
  }

  add(slide) {
    const item = this.#toSlide(slide);
    this.#slides.push(item);
    return item;
  }

  remove(id) {
    const item = this.get(id);
    this.#slides = this.#slides.filter((slide) => slide.id !== id);
    return item;
  }

  toString() {
    const tagText = this.tags.length > 0 ? ` {${this.tags.join(", ")}}` : "";
    const slidesText = this.slides.map((slide) => slide.toString()).join("\n\n");
    return `## Deck${tagText}\n\n${slidesText}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      slides: this.#slides.map((slide) => slide.toJSON()),
    };
  }

  static fromJSON(deck = {}) {
    return new Deck(deck);
  }

  #toSlide(slide) {
    return slide instanceof Slide ? slide : Slide.fromJSON(slide);
  }
}
