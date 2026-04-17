import { createIcons, icons } from "https://esm.sh/lucide";
import Slide from "./base/slide.js";
import "./card.js";

function element(tagName, options = {}) {
  const node = document.createElement(tagName);
  (options.classes ?? []).forEach((className) => node.classList.add(className));
  Object.entries(options.attributes ?? {}).forEach(([key, value]) => node.setAttribute(key, value));
  if (options.text !== undefined) {
    node.textContent = options.text;
  }
  return node;
}

function randomCardPojo() {
  const types = ["playing-card", "foreign-word", "string-list"];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === "foreign-word") {
    return {
      type,
      tags: ["japanese"],
      data: {
        word: "生きがい",
        pronunciation: "ikigai",
        translation: "the reason for being",
      },
    };
  }

  if (type === "string-list") {
    return {
      type,
      tags: ["ideas"],
      data: {
        items: ["Idea 1", "Idea 2", "Idea 3"],
      },
    };
  }

  return {
    type,
    tags: ["tag1"],
    data: {
      pip: "Q",
      suit: "Hearts",
    },
  };
}

function renderTags(slide, holder) {
  holder.replaceChildren(
    ...slide.tags.map((tag) => element("span", { classes: ["tag"], text: tag }))
  );
}

Slide.prototype.render = function (container, callback = () => {}) {
  const slide = this;

  const root = element("section", {
    classes: ["slide"],
    attributes: { "data-slide-id": slide.id },
  });

  const header = element("div", { classes: ["slide-header"] });
  const title = element("h3", { text: slide.title });
  const tagHolder = element("div", { classes: ["tag-list"] });
  const actions = element("div", { classes: ["row-actions"] });

  const addButton = element("button", {
    classes: ["icon-button"],
    attributes: {
      type: "button",
      title: "Add card",
    },
  });

  const removeButton = element("button", {
    classes: ["icon-button", "danger"],
    attributes: {
      type: "button",
      title: "Remove slide",
    },
  });

  const cardsHolder = element("div", { classes: ["cards"] });

  addButton.textContent = "+";
removeButton.textContent = "Delete";

  actions.appendChild(addButton);
  actions.appendChild(removeButton);

  header.appendChild(title);
  header.appendChild(tagHolder);
  header.appendChild(actions);

  renderTags(slide, tagHolder);

  slide.cards.forEach((card) => {
    card.render(cardsHolder, (eventName, id) => {
      if (eventName === "remove") {
        slide.remove(id);
        cardsHolder.querySelector(`[data-card-id="${id}"]`)?.remove();
        renderTags(slide, tagHolder);
        callback("update", slide.id);
        return;
      }

      renderTags(slide, tagHolder);
      callback("update", slide.id);
    });
  });

  addButton.addEventListener("click", () => {
    const card = slide.add(randomCardPojo());

    card.render(cardsHolder, (eventName, id) => {
      if (eventName === "remove") {
        slide.remove(id);
        cardsHolder.querySelector(`[data-card-id="${id}"]`)?.remove();
      }

      renderTags(slide, tagHolder);
      callback("update", slide.id);
    });

    renderTags(slide, tagHolder);
    callback("update", slide.id);
  });

  removeButton.addEventListener("click", () => {
    if (slide.cards.length === 0) {
      callback("remove", slide.id);
    }
  });

  root.appendChild(header);
  root.appendChild(cardsHolder);
  container.appendChild(root);

  createIcons({ icons });
  return root;
};

export default Slide;