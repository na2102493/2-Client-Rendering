import Deck from "./deck.js";

let decks = [];
let activeTags = new Set();

function element(tagName, options = {}) {
  const node = document.createElement(tagName);
  (options.classes ?? []).forEach((className) => node.classList.add(className));
  Object.entries(options.attributes ?? {}).forEach(([key, value]) => node.setAttribute(key, value));
  if (options.text !== undefined) {
    node.textContent = options.text;
  }
  return node;
}

function uniqueTags(tagGroups = []) {
  return [...new Set(tagGroups.flat())].sort();
}

function collectionTags() {
  return uniqueTags(decks.map((deck) => deck.tags));
}

function randomDeckTitle() {
  const titles = ["Deck", "Languages", "Practice", "Projects", "Notes"];
  return titles[Math.floor(Math.random() * titles.length)];
}

export function save() {
  localStorage.setItem(
    "collection",
    JSON.stringify(decks.map((deck) => deck.toJSON()))
  );
}

export async function load() {
  const local = localStorage.getItem("collection");

  if (local) {
    decks = JSON.parse(local).map((deck) => Deck.fromJSON(deck));
    return decks;
  }

  const response = await fetch("./data/collection.json");
  const json = await response.json();
  decks = json.map((deck) => Deck.fromJSON(deck));
  save();
  return decks;
}

function applyFiltering(scope) {
  const cards = [...scope.querySelectorAll("[data-card-id]")];

  cards.forEach((card) => {
    const tags = (card.getAttribute("data-tags") ?? "")
      .split(" ")
      .filter(Boolean);

    const visible =
      activeTags.size === 0 || tags.some((tag) => activeTags.has(tag));

    card.classList.toggle("filtered", !visible);
  });

  const filterTags = [...scope.querySelectorAll(".collection-tags .tag")];

  filterTags.forEach((tag) => {
    tag.classList.toggle("active", activeTags.has(tag.textContent));
  });
}

export function render(scope) {
  const app = element("main", { classes: ["page"] });
  const controls = element("section", { classes: ["toolbar"] });
  const title = element("h1", { text: "2 Client Rendering" });

  const addButton = element("button", {
    classes: ["primary-button"],
    attributes: { type: "button" },
    text: "Add Deck",
  });

  const tagPanel = element("div", { classes: ["collection-tags"] });
  const decksHolder = element("div", { classes: ["decks"] });

  controls.appendChild(title);
  controls.appendChild(addButton);
  controls.appendChild(tagPanel);

  collectionTags().forEach((tagName) => {
    const tag = element("button", {
      classes: ["tag"],
      attributes: { type: "button" },
      text: tagName,
    });

    tag.addEventListener("click", (event) => {
      if (event.altKey) {
        activeTags =
          activeTags.size === 1 && activeTags.has(tagName)
            ? new Set()
            : new Set([tagName]);
      } else if (activeTags.has(tagName)) {
        activeTags.delete(tagName);
      } else {
        activeTags.add(tagName);
      }

      applyFiltering(app);
    });

    tagPanel.appendChild(tag);
  });

  decks.forEach((deck) => {
    deck.render(decksHolder, (eventName, id) => {
      if (eventName === "remove") {
        decks = decks.filter((item) => item.id !== id);
        decksHolder.querySelector(`[data-deck-id="${id}"]`)?.remove();
      }

      save();
      render(scope);
    });
  });

  addButton.addEventListener("click", () => {
    decks.push(Deck.fromJSON({ title: randomDeckTitle(), slides: [] }));
    save();
    render(scope);
  });

  app.appendChild(controls);
  app.appendChild(decksHolder);

  scope.replaceChildren(app);
  applyFiltering(app);
}