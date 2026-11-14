// The shape every app's content takes: review decks (parts), lessons made of
// sections, and cards. A card is { id, build(rng) -> question, info: {name, definition} }.

export class Course {
  /**
   * parts:   [{ id, number, title, summary }]
   * lessons: [{ number, title, sections: [{ id, title, kind, deckId, blocks, cards }] }]
   */
  constructor(parts, lessons, { extraCardById } = {}) {
    this.parts = parts.map((p) => ({ ...p, sections: [] }));
    this.lessons = lessons;
    this.allSections = [];
    this._cards = new Map();
    this._cardSection = new Map();
    this._sectionLesson = new Map();
    this._sectionIndex = new Map();
    this._sectionById = new Map();
    this._extraCardById = extraCardById || null;
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        this._sectionIndex.set(section, this.allSections.length);
        this.allSections.push(section);
        this._sectionLesson.set(section, lesson);
        this._sectionById.set(section.id, section);
        const part = this.parts.find((p) => p.id === section.deckId);
        if (part) part.sections.push(section);
        // A section may also have a review card that joins the deck instead of its questions.
        for (const card of section.reviewCard ? [...section.cards, section.reviewCard] : section.cards) {
          this._cards.set(card.id, card);
          this._cardSection.set(card.id, section);
        }
      }
    }
  }

  /** A card from a lesson, or one the app builds on demand (such as a drill card). */
  cardById(id) {
    return this._cards.get(id) || (this._extraCardById ? this._extraCardById(id) : null) || null;
  }

  /** Only cards that belong to a section. */
  sectionCard(id) { return this._cards.get(id) || null; }

  sectionById(id) { return this._sectionById.get(id) || null; }
  sectionOfCard(card) { return this._cardSection.get(card.id) || null; }
  partById(id) { return this.parts.find((p) => p.id === id) || null; }

  partOf(section) {
    if (!section) return null;
    return this.parts.find((p) => p.id === section.deckId) || null;
  }

  partOfCard(card) {
    if (card.partId) return this.partById(card.partId);
    return this.partOf(this.sectionOfCard(card));
  }

  lessonOf(section) { return this._sectionLesson.get(section); }
  indexOf(section) { return this._sectionIndex.get(section); }

  sectionAfter(section) {
    const i = this.indexOf(section);
    return i + 1 < this.allSections.length ? this.allSections[i + 1] : null;
  }

  /** Total cards across every section. */
  get itemCount() {
    return this.allSections.reduce((sum, s) => sum + s.cards.length, 0);
  }
}
