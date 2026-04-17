let nanoid;

try {
  ({ nanoid } = await import("nanoid"));
} catch {
  ({ nanoid } = await import("https://esm.sh/nanoid/nanoid"));
}

export default class Item {
  #id;

  constructor(item = {}) {
    if (new.target === Item) {
      throw new Error("Item is abstract.");
    }

    this.#id = item?.id ?? nanoid(10);
  }

  get id() {
    return this.#id;
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return { id: this.id };
  }

  static fromJSON(item = {}) {
    return new this(item);
  }
}
