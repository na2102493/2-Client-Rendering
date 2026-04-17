import Card from "../card.js";

export default class ForeignWord extends Card {
  #data;

  constructor(card = {}) {
    super(card);
    this.#data = {
      word: card?.data?.word ?? "",
      pronunciation: card?.data?.pronunciation ?? "",
      translation: card?.data?.translation ?? "",
    };
  }

  get data() {
    return this.#data;
  }

  toString() {
    return `${this.data.word} (${this.data.pronunciation}): ${this.data.translation}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "foreign-word",
      data: this.data,
    };
  }

  static fromJSON(card = {}) {
    return new ForeignWord(card);
  }
}
