import Item from "./item.js";

export default class Card extends Item {
  #tags;

  constructor(card = {}) {
    super(card);

    if (new.target === Card) {
      throw new Error("Card is abstract.");
    }

    this.#tags = [...(card?.tags ?? [])];
  }

  get tags() {
    return this.#tags;
  }

  toString() {
    return this.tags.join(", ");
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tags: this.tags,
    };
  }

  static fromJSON() {
    throw new Error("Use a card subtype.");
  }
}
