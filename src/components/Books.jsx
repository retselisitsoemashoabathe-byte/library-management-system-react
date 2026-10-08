import { useState } from 'react';
import { cleanIsbn } from '../utils/isbn';

const blankBook = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: ''
};

function Books({ books, setBooks, currentUser }) {
  const [form, setForm] = useState(blankBook);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const canEdit = currentUser && currentUser.role === 'Librarian';

  function onChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    setForm((old) => ({ ...old, [field]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!canEdit) {
      setMsg('Login as librarian first (Users page).');
      return;
    }

    const title = form.title.trim();
    const author = form.author.trim();
    const genre = form.genre.trim();
    const isbn = form.isbn.trim();
    const qty = Number(form.quantity);

    if (!title || !author || !genre || !isbn || form.quantity.trim() === '') {
      setMsg('Fill in all the fields.');
      return;
    }

    // qty has to be 0, 1, 2... not 1.5
    if (!Number.isInteger(qty) || qty < 0) {
      setMsg('Quantity must be 0 or a positive whole number.');
      return;
    }

    const duplicate = books.some(
      (b) => b.id !== editId && cleanIsbn(b.isbn) === cleanIsbn(isbn)
    );
    if (duplicate) {
      setMsg('That ISBN is already in the list.');
      return;
    }

    if (editId) {
      setBooks((old) =>
        old.map((b) =>
          b.id === editId ? { ...b, title, author, genre, isbn, quantity: qty } : b
        )
      );
      setEditId(null);
      setForm(blankBook);
      setMsg('Updated.');
      return;
    }

    setBooks((old) => [
      ...old,
      {
        id: crypto.randomUUID(),
        title,
        author,
        genre,
        isbn,
        quantity: qty
      }
    ]);
    setForm(blankBook);
    setMsg('Book added.');
  }

  function startEdit(book) {
    setEditId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: String(book.quantity)
    });
    setMsg('Editing: ' + book.title);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(blankBook);
    setMsg('');
  }

  function removeBook(id) {
    if (!canEdit) {
      setMsg('Login as librarian first (Users page).');
      return;
    }

    if (!window.confirm('Delete this book?')) {
      return;
    }

    setBooks((old) => old.filter((b) => b.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm(blankBook);
    }
    setMsg('Deleted.');
  }

  return (
    <section>
      <h2>Books</h2>
      <p>Add a book, or click Update on a row to change it.</p>

      {!canEdit && (
        <p>You can look at the list, but only a librarian can change books.</p>
      )}

      <form className="app-form" onSubmit={onSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={onChange} required disabled={!canEdit} />
        </label>
        <label>
          Author
          <input name="author" value={form.author} onChange={onChange} required disabled={!canEdit} />
        </label>
        <label>
          Genre
          <input name="genre" value={form.genre} onChange={onChange} required disabled={!canEdit} />
        </label>
        <label>
          ISBN
          <input name="isbn" value={form.isbn} onChange={onChange} required disabled={!canEdit} />
        </label>
        <label>
          {editId ? 'Quantity' : 'Initial Quantity'}
          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            value={form.quantity}
            onChange={onChange}
            required
            disabled={!canEdit}
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={!canEdit}>
            {editId ? 'Save' : 'Add Book'}
          </button>
          {editId && (
            <button type="button" className="secondary-button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <p>{msg}</p>

      <h3>Current books</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Copies</th>
              <th></th>
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
                      onClick={() => startEdit(book)}
                      disabled={!canEdit}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => removeBook(book.id)}
                      disabled={!canEdit}
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

      {books.length === 0 && <p>No books yet.</p>}
    </section>
  );
}

export default Books;
