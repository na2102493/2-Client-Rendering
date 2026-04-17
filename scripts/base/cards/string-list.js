import Card from "../card.js";

export default class StringList extends Card {
  #data;

  constructor(card = {}) {
    super(card);
    this.#data = {
      items: [...(card?.data?.items ?? [])],
    };
  }

  get data() {
    return this.#data;
  }

  toString() {
    return this.data.items.map((item) => `+ ${item}`).join("\n");
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "string-list",
      data: this.data,
    };
  }

  static fromJSON(card = {}) {
    return new StringList(card);
  }
}
