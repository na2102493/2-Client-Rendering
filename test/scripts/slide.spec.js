import { describe, expect, test } from "bun:test";
import Slide from "../../scripts/base/slide.js";
import PlayingCard from "../../scripts/base/cards/playing-card.js";
import ForeignWord from "../../scripts/base/cards/foreign-word.js";

describe("class Slide", () => {
  test("add(card) adds the card to #cards", () => {
    const slide = new Slide();
    const card = slide.add({ type: "playing-card", data: { pip: "Q", suit: "Hearts" } });
    expect(slide.cards.length).toBe(1);
    expect(slide.get(card.id)).toBe(card);
  });

  test("remove(id) removes the card with id from #cards", () => {
    const slide = new Slide();
    const card = slide.add({ type: "playing-card", data: { pip: "A", suit: "Spades" } });
    slide.remove(card.id);
    expect(slide.cards.length).toBe(0);
  });

  test("get(id) returns a reference to a card in #cards", () => {
    const slide = new Slide();
    const card = slide.add({ type: "foreign-word", data: { word: "先生", pronunciation: "sensei", translation: "teacher" } });
    const found = slide.get(card.id);
    found.data.translation = "instructor";
    expect(slide.get(card.id).data.translation).toBe("instructor");
  });

  test("cards() returns a copy of #cards and not a reference to it", () => {
    const slide = new Slide();
    slide.add({ type: "playing-card", data: { pip: "10", suit: "Clubs" } });
    const cards = slide.cards;
    cards.push(new PlayingCard({ data: { pip: "K", suit: "Diamonds" } }));
    expect(slide.cards.length).toBe(1);
  });

  test("tags() returns an array of unique elements", () => {
    const slide = new Slide({
      cards: [
        { type: "playing-card", tags: ["tag1", "tag2"], data: { pip: "Q", suit: "Hearts" } },
        { type: "foreign-word", tags: ["tag1", "japanese"], data: { word: "ありがとう", pronunciation: "arigatou", translation: "thank you" } },
      ],
    });
    expect(slide.tags).toEqual(["japanese", "tag1", "tag2"]);
  });

  test("#toCard(card) uses the correct type when creating a card", () => {
    const slide = new Slide({ cards: [{ type: "foreign-word", data: { word: "شكرًا", pronunciation: "shukran", translation: "thank you" } }] });
    expect(slide.cards[0]).toBeInstanceOf(ForeignWord);
  });
});
