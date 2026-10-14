# Book Tracker

A small, responsive reading-list app built with plain HTML, CSS, and JavaScript—no framework or build step required.

## Features

- Add a book with a required title, author, and reading status.
- Track **To read**, **Reading**, and **Finished** books.
- Show newest additions first.
- Search by book title or author.
- Filter the shelf by reading status.
- Change a book's status or remove it from the shelf.
- Save the list in browser `localStorage`, so it remains after refreshing.
- View total, currently-reading, and finished counts.
- Responsive layout, keyboard focus styles, and accessible status messages.

## Run it

Open `index.html` in a browser. For a local server, you can use the VS Code Live Server extension or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Storage note

Books are stored locally in the browser on the device where they were added. They are not synced to an account or shared between browsers. Clearing the browser's site data can remove the saved list.

## Files

- `index.html` — accessible page structure and form
- `style.css` — layout, styling, and responsive rules
- `app.js` — validation, rendering, filtering, status changes, deletion, and local storage
- `PROMPTS.md` — AI-assisted development notes and a tracked correction

## Manual test checklist

- [ ] Adding a book with a title and author succeeds.
- [ ] Blank title or author is rejected with a useful message.
- [ ] New books appear before older books.
- [ ] Search matches title and author, ignoring case.
- [ ] Each status filter shows only matching books.
- [ ] Changing a status updates the counters and remains after refresh.
- [ ] Deleting a book removes it after refresh.
- [ ] The empty state and no-results state appear in the right situations.
- [ ] The page is usable on a narrow mobile screen.
