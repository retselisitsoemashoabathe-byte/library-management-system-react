import { useState } from 'react';

function Transactions({ books, setBooks, transactions, setTransactions, currentUser }) {
  const [bookId, setBookId] = useState('');
  const [qty, setQty] = useState('');
  const [msg, setMsg] = useState('');

  const canEdit = currentUser && currentUser.role === 'Librarian';

  function saveTx(type) {
    if (!canEdit) {
      setMsg('Login as librarian first (Users page).');
      return;
    }

    const book = books.find((b) => b.id === bookId);
    const amount = Number(qty);

    if (!book) {
      setMsg('Pick a book.');
      return;
    }

    if (qty.trim() === '' || !Number.isInteger(amount) || amount < 1) {
      setMsg('Quantity must be at least 1.');
      return;
    }

    if (type === 'borrow' && book.quantity < amount) {
      setMsg('Not enough copies. Available: ' + book.quantity);
      return;
    }

    const left = type === 'add' ? book.quantity + amount : book.quantity - amount;

    setBooks((old) =>
      old.map((b) => (b.id === book.id ? { ...b, quantity: left } : b))
    );

    setTransactions((old) => [
      {
        id: crypto.randomUUID(),
        bookId: book.id,
        bookTitle: book.title,
        type,
        quantity: amount,
        remaining: left,
        recordedBy: currentUser.name,
        date: new Date().toISOString()
      },
      ...old
    ]);

    setQty('');
    if (type === 'add') {
      setMsg('Stock added for ' + book.title);
    } else {
      setMsg('Borrowed from ' + book.title);
    }
  }

  return (
    <section>
      <h2>Transactions</h2>
      <p>Use this page when new copies come in, or when someone borrows a book.</p>

      {!canEdit && <p>Only a librarian can record transactions.</p>}

      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Book
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            disabled={!canEdit}
          >
            <option value="">-- choose --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.quantity} left)
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            step="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={!canEdit}
          />
        </label>

        <div className="form-actions">
          <button type="button" disabled={!canEdit} onClick={() => saveTx('add')}>
            Add stock
          </button>
          <button
            type="button"
            className="update-button"
            disabled={!canEdit}
            onClick={() => saveTx('borrow')}
          >
            Borrow
          </button>
        </div>
      </form>

      <p>{msg}</p>

      <h3>History</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Book</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Left</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.bookTitle}</td>
                <td>{tx.type === 'add' ? 'Add stock' : 'Borrow'}</td>
                <td>{tx.quantity}</td>
                <td>{tx.remaining}</td>
                <td>{tx.recordedBy || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && <p>No history yet.</p>}
    </section>
  );
}

export default Transactions;
