# AI Development Log

This file records the AI assistance used to build the Book Tracker and the implementation issue corrected during development.

## Initial request

> Build a simple web page where someone keeps a list of books they want to read. Add a book with title, author, and status (To read, Reading, Finished); title and author are required; show newest first; search by title or author; change status; persist data using localStorage. Optional: delete books, show counts, support mobile. Use plain HTML/CSS/JS, explain each step, and record an actual AI error noticed and fixed.

## Follow-up prompt

> Implement the remaining functionality with plain HTML, CSS, and JavaScript. Keep the interface responsive and accessible, validate required fields, persist changes in localStorage, and document the correction in this file.

## Error / omission noticed and fixed

**Issue:** The first draft of the JavaScript kept the list only in an in-memory `books = []` array. It did not read from or write to `localStorage`, so refreshing the page would erase the user's list. The draft also did not yet implement search or status editing.

**Correction:** Added `loadBooks()` and `saveBooks()`, using a versioned storage key (`book-tracker-books-v1`). The app now loads saved books on startup and saves additions, status changes, and deletions. Search and status filters are implemented in `getVisibleBooks()` and `setActiveFilter()`. The code also handles invalid stored data and storage errors without crashing.

## Verification status

The code has been written to cover the listed behaviours. Run the manual checklist in `README.md` in a browser before treating the app as fully tested. Do not mark a manual test as passed until it has actually been performed.
