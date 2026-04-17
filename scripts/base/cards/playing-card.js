import Card from "../card.js";

export default class PlayingCard extends Card {
  #data;

  constructor(card = {}) {
    super(card);
    this.#data = {
      pip: card?.data?.pip ?? "A",
      suit: card?.data?.suit ?? "Spades",
    };
  }

  get data() {
    return this.#data;
  }

  toString() {
    return `${this.data.pip} of ${this.data.suit}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "playing-card",
      data: this.data,
    };
  }

  static fromJSON(card = {}) {
    return new PlayingCard(card);
  }
}
