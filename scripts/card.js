import { createIcons, icons } from "https://esm.sh/lucide";
import Card from "./base/card.js";
import ForeignWord from "./cards/foreign-word.js";
import PlayingCard from "./cards/playing-card.js";
import StringList from "./cards/string-list.js";

function element(tagName, options = {}) {
  const node = document.createElement(tagName);
  (options.classes ?? []).forEach((className) => node.classList.add(className));
  Object.entries(options.attributes ?? {}).forEach(([key, value]) => node.setAttribute(key, value));
  if (options.text !== undefined) {
    node.textContent = options.text;
  }
  return node;
}

function randomTags() {
  const source = ["tag1", "tag2", "japanese", "arabic", "ideas", "ci", "cd"];
  return source.filter(() => Math.random() > 0.55).slice(0, 3);
}

function randomData(type) {
  if (type === "foreign-word") {
    const words = [
      { word: "先生", pronunciation: "sensei", translation: "teacher" },
      { word: "ありがとう", pronunciation: "arigatou", translation: "thank you" },
      { word: "شكرًا", pronunciation: "shukran", translation: "thank you" },
    ];
    return words[Math.floor(Math.random() * words.length)];
  }

  if (type === "string-list") {
    const sets = [
      ["Plan", "Code", "Build"],
      ["Read", "Practice", "Review"],
      ["Think", "Draw", "Present"],
    ];
    return { items: sets[Math.floor(Math.random() * sets.length)] };
  }

  const pips = ["A", "2", "7", "10", "J", "Q", "K"];
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

  return {
    pip: pips[Math.floor(Math.random() * pips.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
  };
}

function shuffleCard(card) {
  card.tags.splice(0, card.tags.length, ...randomTags());
  const data = randomData(card.toJSON().type);
  Object.keys(card.data).forEach((key) => delete card.data[key]);
  Object.assign(card.data, data);
}

Card.prototype.render = function (container, callback = () => {}) {
  const card = this;

  const root = element("article", {
    classes: ["card"],
    attributes: {
      "data-card-id": card.id,
      "data-tags": card.tags.join(" "),
      tabindex: "0",
    },
  });

  const header = element("div", { classes: ["card-header"] });
  const body = element("div", { classes: ["card-body"] });
  const tags = element("div", { classes: ["tag-list"] });

  const removeButton = element("button", {
    classes: ["icon-button", "danger"],
    attributes: {
      type: "button",
      title: "Remove card",
    },
  });

 removeButton.textContent = "Delete";

  header.appendChild(element("strong", { text: card.toJSON().type }));
  header.appendChild(removeButton);

  if (card instanceof ForeignWord) {
    body.appendChild(
      element("p", { text: `${card.data.word} (${card.data.pronunciation})` })
    );
    body.appendChild(element("p", { text: card.data.translation }));
  }

  if (card instanceof PlayingCard) {
    body.appendChild(
      element("p", { text: `${card.data.pip} of ${card.data.suit}` })
    );
  }

  if (card instanceof StringList) {
    const list = element("ul");
    card.data.items.forEach((item) => {
      list.appendChild(element("li", { text: item }));
    });
    body.appendChild(list);
  }

  card.tags.slice().sort().forEach((tag) => {
    tags.appendChild(element("span", { classes: ["tag"], text: tag }));
  });

  removeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    callback("remove", card.id);
  });

  root.addEventListener("click", () => {
    shuffleCard(card);
    const replacement = card.render(container, callback);
    root.replaceWith(replacement);
    callback("update", card.id);
  });

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(tags);
  container.appendChild(root);

  createIcons({ icons });
  return root;
};

export default Card;