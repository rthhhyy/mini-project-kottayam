// Book Tracker: all app behaviour lives in this file.
const STORAGE_KEY = "book-tracker-books-v1";
const VALID_STATUSES = ["To read", "Reading", "Finished"];

const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#book-title");
const authorInput = document.querySelector("#book-author");
const statusInput = document.querySelector("#book-status");
const titleError = document.querySelector("#title-error");
const authorError = document.querySelector("#author-error");
const formMessage = document.querySelector("#form-message");
const searchInput = document.querySelector("#book-search");
const bookList = document.querySelector("#book-list");
const bookTemplate = document.querySelector("#book-template");
const emptyState = document.querySelector("#empty-state");
const noResults = document.querySelector("#no-results");
const shelfCount = document.querySelector("#shelf-count");
const totalCount = document.querySelector("#total-count");
const readingCount = document.querySelector("#reading-count");
const finishedCount = document.querySelector("#finished-count");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const clearSearchButton = document.querySelector("#clear-search");

// Load saved books safely. A bad or old storage value should not crash the page.
function loadBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((book) =>
      book &&
      typeof book.id === "string" &&
      typeof book.title === "string" &&
      typeof book.author === "string" &&
      VALID_STATUSES.includes(book.status) &&
      typeof book.createdAt === "number"
    );
  } catch (error) {
    console.warn("Could not read saved books. Starting with an empty shelf.", error);
    return [];
  }
}

let books = loadBooks();
let activeFilter = "All";

// Persist every change so the shelf survives refreshes and browser restarts.
function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch (error) {
    console.error("Could not save books to local storage.", error);
    formMessage.textContent = "Your browser could not save changes. Check storage settings.";
    return false;
  }
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(timestamp));
}

function updateStats() {
  totalCount.textContent = String(books.length);
  readingCount.textContent = String(books.filter((book) => book.status === "Reading").length);
  finishedCount.textContent = String(books.filter((book) => book.status === "Finished").length);
  shelfCount.textContent = String(books.length);
}

function getVisibleBooks() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  // Sort a copy so newest books appear first without mutating the saved list.
  return [...books]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((book) => {
      const matchesFilter = activeFilter === "All" || book.status === activeFilter;
      const matchesSearch =
        book.title.toLocaleLowerCase().includes(query) ||
        book.author.toLocaleLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
}

function renderBooks() {
  bookList.replaceChildren();
  const visibleBooks = getVisibleBooks();
  const hasAnyBooks = books.length > 0;
  emptyState.classList.toggle("hidden", hasAnyBooks);
  noResults.classList.toggle("hidden", !hasAnyBooks || visibleBooks.length > 0);
  bookList.classList.toggle("hidden", visibleBooks.length === 0);

  for (const book of visibleBooks) {
    const fragment = bookTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".book-row");
    const title = fragment.querySelector(".book-title");
    const author = fragment.querySelector(".book-author");
    const added = fragment.querySelector(".book-added");
    const statusSelect = fragment.querySelector(".status-select");
    const deleteButton = fragment.querySelector(".delete-button");

    // textContent keeps user-entered titles/authors from being treated as HTML.
    title.textContent = book.title;
    author.textContent = book.author;
    added.textContent = `Added ${formatDate(book.createdAt)}`;
    statusSelect.value = book.status;
    statusSelect.setAttribute("aria-label", `Reading status for ${book.title}`);
    deleteButton.setAttribute("aria-label", `Delete ${book.title}`);

    statusSelect.addEventListener("change", () => {
      const currentBook = books.find((item) => item.id === book.id);
      if (!currentBook || !VALID_STATUSES.includes(statusSelect.value)) return;
      currentBook.status = statusSelect.value;
      saveBooks();
      updateStats();
      renderBooks();
    });

    deleteButton.addEventListener("click", () => {
      const shouldDelete = window.confirm(`Remove "${book.title}" from your shelf?`);
      if (!shouldDelete) return;
      books = books.filter((item) => item.id !== book.id);
      saveBooks();
      updateStats();
      renderBooks();
    });

    row.dataset.status = book.status;
    bookList.append(fragment);
  }
}

function setActiveFilter(nextFilter) {
  activeFilter = nextFilter;
  for (const button of filterButtons) {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
  renderBooks();
}

function clearValidation() {
  titleError.textContent = "";
  authorError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
  authorInput.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidation();
  formMessage.textContent = "";

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  let isValid = true;

  if (!title) {
    titleError.textContent = "Please enter a book title.";
    titleInput.setAttribute("aria-invalid", "true");
    isValid = false;
  }
  if (!author) {
    authorError.textContent = "Please enter the author's name.";
    authorInput.setAttribute("aria-invalid", "true");
    isValid = false;
  }
  if (!isValid) {
    (title ? authorInput : titleInput).focus();
    return;
  }

  const newBook = {
    id: (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `book-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    author,
    status: VALID_STATUSES.includes(statusInput.value) ? statusInput.value : "To read",
    createdAt: Date.now()
  };

  // Add to the front, which also makes it the newest item in the shelf.
  books.unshift(newBook);
  const saved = saveBooks();
  form.reset();
  clearValidation();
  setActiveFilter("All");
  searchInput.value = "";
  updateStats();
  renderBooks();
  titleInput.focus();
  formMessage.textContent = saved ? "Book added to your shelf." : "Book added for now, but could not be saved.";
});

titleInput.addEventListener("input", () => {
  titleError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
});
authorInput.addEventListener("input", () => {
  authorError.textContent = "";
  authorInput.removeAttribute("aria-invalid");
});
searchInput.addEventListener("input", renderBooks);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveFilter(button.dataset.filter));
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  setActiveFilter("All");
  searchInput.focus();
});

// First render displays saved data, or a friendly empty state for new users.
updateStats();
renderBooks();