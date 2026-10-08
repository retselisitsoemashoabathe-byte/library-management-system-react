# Community Library

React library management system for a community library. Librarians can manage books, track stock, record borrow/add-stock transactions, and manage member accounts. Data is stored in the browser with local storage.

## Run the app

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/`).

## Sample accounts

Sign in on the Users page with a membership ID:

- Librarian: `LIB001`
- Member: `MEM001`

## Features

- Dashboard with availability and low-stock highlighting
- Add, update, and delete books
- Add stock and deduct stock when books are borrowed, with a transaction history
- Login plus add, update, and delete users (librarian only)
- React Router navigation and React hooks for state
