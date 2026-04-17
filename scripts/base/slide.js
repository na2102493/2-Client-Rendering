import Item from "./item.js";
import PlayingCard from "./cards/playing-card.js";
import ForeignWord from "./cards/foreign-word.js";
import StringList from "./cards/string-list.js";

function uniqueTags(tagGroups = []) {
  return [...new Set(tagGroups.flat())].sort();
}

export default class Slide extends Item {
  #title;
  #cards;

  constructor(slide = {}) {
    super(slide);
    this.#title = slide?.title ?? "Untitled";
    this.#cards = (slide?.cards ?? []).map((card) => this.#toCard(card));
  }

  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value ?? "Untitled";
  }

  get cards() {
    return [...this.#cards];
  }

  get tags() {
    return uniqueTags(this.#cards.map((card) => card.tags));
  }

  get(id) {
    if (id === undefined) {
      return undefined;
    }

    return this.#cards.find((card) => card.id === id);
  }

  add(card) {
    const item = this.#toCard(card);
    this.#cards.push(item);
    return item;
  }

  remove(id) {
    const item = this.get(id);
    this.#cards = this.#cards.filter((card) => card.id !== id);
    return item;
  }

  toString() {
    const tagText = this.tags.length > 0 ? ` {${this.tags.join(", ")}}` : "";
    const cardsText = this.cards.map((card) => card.toString()).join("\n");
    return `### ${this.title}${tagText}\n${cardsText}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      cards: this.#cards.map((card) => card.toJSON()),
    };
  }

  static fromJSON(slide = {}) {
    return new Slide(slide);
  }

  #toCard(card) {
    if (card instanceof PlayingCard || card instanceof ForeignWord || card instanceof StringList) {
      return card;
    }

    if (card?.type === "playing-card") {
      return PlayingCard.fromJSON(card);
    }

    if (card?.type === "foreign-word") {
      return ForeignWord.fromJSON(card);
    }

    if (card?.type === "string-list") {
      return StringList.fromJSON(card);
    }

    throw new Error("Unknown card type.");
  }
}
