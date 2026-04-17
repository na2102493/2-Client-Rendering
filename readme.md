# Report

Name: Nadya Jassim Alkubaisi
Student ID: 202102493

---

## 2 Client Rendering

| Task        | Done? | Comments |
|------------|------|----------|
| Testing     | [x]  | All Slide tests passed successfully using Bun. |
| Application | [x]  | Application loads and renders decks from JSON and localStorage. |
| Persistence | [x]  | Data is saved and loaded using localStorage. |
| Rendering   | [x]  | DOM rendering implemented using render() methods for Deck, Slide, and Card. |
| Actions     | [x]  | Add and remove operations implemented using event handlers. |
| Events      | [x]  | Events are handled properly using click listeners. |
| Callbacks   | [x]  | Callback chain implemented from Card → Slide → Deck → Collection. |
| Shuffling   | [x]  | Cards are shuffled on click (data and tags updated). |
| Filtering   | [x]  | Cards filtered using tag selection and Alt-click behavior. |
| Screenshot  | [x]  | Screenshot included in results folder. |
| Report      | [x]  | This report is provided. |
| Plagiarism  | [x]  | Work is original. |

---

## Explanation

### Application
The application loads a collection of decks either from localStorage or from the provided JSON file.  
If local data exists, it is used; otherwise, the JSON file is fetched and stored locally.

### Rendering
Rendering is implemented using DOM manipulation.  
Each class (Deck, Slide, Card) has a render() method that creates and updates its corresponding HTML elements.

### Actions
Users can:
- Add decks
- Add slides
- Add cards
- Remove items when allowed (empty slide/deck)

All actions update the UI incrementally without re-rendering the entire page.

### Callbacks
A callback system is implemented to propagate changes:
- Card → Slide → Deck → Collection

This ensures that updates trigger proper UI updates and persistence.

### Persistence
All changes are saved using localStorage.  
When the page reloads, the data is restored automatically.

### Shuffling
Clicking on a card updates:
- its tags
- its data

The card is re-rendered dynamically.

### Filtering
Users can filter cards by tags:
- Click → toggle tag
- Alt + Click → isolate tag

Cards not matching the selected tags are hidden.

---

## Conclusion

This project demonstrates:
- Object-oriented design
- DOM manipulation
- Event handling
- Data persistence
- Interactive UI behavior

The system is fully functional and meets all assignment requirements.