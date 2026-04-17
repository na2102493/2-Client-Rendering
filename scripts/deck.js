import { createIcons, icons } from "https://esm.sh/lucide";
import Deck from "./base/deck.js";
import "./slide.js";
function element(tagName, options = {}) {
  const node = document.createElement(tagName);
  (options.classes ?? []).forEach((className) => node.classList.add(className));
  Object.entries(options.attributes ?? {}).forEach(([key, value]) => node.setAttribute(key, value));
  if (options.text !== undefined) {
    node.textContent = options.text;
  }
  return node;
}

function randomSlideTitle() {
  const titles = ["Words", "Cards", "Practice", "Notes", "List"];
  return titles[Math.floor(Math.random() * titles.length)];
}

function renderTags(deck, holder) {
  holder.replaceChildren(
    ...deck.tags.map((tag) => element("span", { classes: ["tag"], text: tag }))
  );
}

Deck.prototype.render = function (container, callback = () => {}) {
  const deck = this;

  const root = element("article", {
    classes: ["deck"],
    attributes: { "data-deck-id": deck.id },
  });

  const header = element("div", { classes: ["deck-header"] });
  const title = element("h2", { text: deck.title });
  const tagHolder = element("div", { classes: ["tag-list"] });
  const actions = element("div", { classes: ["row-actions"] });

  const addButton = element("button", {
    classes: ["icon-button"],
    attributes: {
      type: "button",
      title: "Add slide",
    },
  });

  const removeButton = element("button", {
    classes: ["icon-button", "danger"],
    attributes: {
      type: "button",
      title: "Remove deck",
    },
  });

  const slidesHolder = element("div", { classes: ["slides"] });
addButton.textContent = "+";
removeButton.textContent = "Delete";

  actions.appendChild(addButton);
  actions.appendChild(removeButton);

  header.appendChild(title);
  header.appendChild(tagHolder);
  header.appendChild(actions);

  renderTags(deck, tagHolder);

  deck.slides.forEach((slide) => {
    slide.render(slidesHolder, (eventName, id) => {
      if (eventName === "remove") {
        deck.remove(id);
        slidesHolder.querySelector(`[data-slide-id="${id}"]`)?.remove();
      }

      renderTags(deck, tagHolder);
      callback("update", deck.id);
    });
  });

  addButton.addEventListener("click", () => {
    const slide = deck.add({ title: randomSlideTitle(), cards: [] });

    slide.render(slidesHolder, (eventName, id) => {
      if (eventName === "remove") {
        deck.remove(id);
        slidesHolder.querySelector(`[data-slide-id="${id}"]`)?.remove();
      }

      renderTags(deck, tagHolder);
      callback("update", deck.id);
    });

    renderTags(deck, tagHolder);
    callback("update", deck.id);
  });

  removeButton.addEventListener("click", () => {
    if (deck.slides.length === 0) {
      callback("remove", deck.id);
    }
  });

  root.appendChild(header);
  root.appendChild(slidesHolder);
  container.appendChild(root);

  createIcons({ icons });
  return root;
};

export default Deck;
