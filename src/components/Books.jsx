import { useState } from 'react';
import { normaliseIsbn } from '../utils/isbn';

const emptyForm = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: ''
};

function Books({ books, setBooks, currentUser }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const isLibrarian = currentUser?.role === 'Librarian';

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isLibrarian) {
      setMessage('Only librarians can add or update books.');
      return;
    }

    const title = form.title.trim();
    const author = form.author.trim();
    const genre = form.genre.trim();
    const isbn = form.isbn.trim();
    const quantity = Number(form.quantity);

    if (!title || !author || !genre || !isbn || !form.quantity.trim()) {
      setMessage('Please complete every field.');
      return;
    }

    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      setMessage('Quantity must be a whole number of zero or more.');
      return;
    }

    const isbnTaken = books.some(
      (book) =>
        book.id !== editingId &&
        normaliseIsbn(book.isbn) === normaliseIsbn(isbn)
    );

    if (isbnTaken) {
      setMessage('A book with this ISBN already exists.');
      return;
    }

    if (editingId) {
      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book.id === editingId
            ? { ...book, title, author, genre, isbn, quantity }
            : book
        )
      );

      setEditingId(null);
      setForm(emptyForm);
      setMessage('Book updated successfully.');
      return;
    }

    const newBook = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      isbn,
      quantity
    };

    setBooks((previousBooks) => [...previousBooks, newBook]);
    setForm(emptyForm);
    setMessage('Book added successfully.');
  }

  function handleEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: String(book.quantity)
    });
    setMessage(`Editing “${book.title}”.`);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('Edit cancelled.');
  }

  function handleDelete(bookId) {
    if (!isLibrarian) {
      setMessage('Only librarians can delete books.');
      return;
    }

    const confirmed = window.confirm('Delete this book?');

    if (!confirmed) {
      return;
    }

    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.id !== bookId)
    );

    if (editingId === bookId) {
      setEditingId(null);
      setForm(emptyForm);
    }

    setMessage('Book deleted successfully.');
  }

  return (
    <section>
      <h2>Book Management</h2>
      <p>
        Add new titles, update details, or remove books that are no longer held.
      </p>

      {!isLibrarian && (
        <p role="status">
          Log in as a librarian on the Users page to add, update, or delete books.
        </p>
      )}

      <form className="app-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          Author
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          Genre
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          ISBN
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          {editingId ? 'Quantity' : 'Initial Quantity'}
          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!isLibrarian}>
            {editingId ? 'Save Changes' : 'Add Book'}
          </button>
          {editingId && (
            <button type="button" className="secondary-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <p role="status">{message}</p>

      <h3>Book List</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Genre</th>
              <th scope="col">ISBN</th>
              <th scope="col">Copies</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="update-button"
                      onClick={() => handleEdit(book)}
                      disabled={!isLibrarian}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(book.id)}
                      disabled={!isLibrarian}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && <p>No books have been added yet.</p>}
    </section>
  );
}

export default Books;
