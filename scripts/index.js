import "./deck.js";
import "./slide.js";
import "./card.js";
import { load, render } from "./collection.js";

load()
  .then(() => {
    render(document.body);
  })
  .catch((error) => {
    console.error(error);
    document.body.textContent = "Failed to load collection.";
  });

