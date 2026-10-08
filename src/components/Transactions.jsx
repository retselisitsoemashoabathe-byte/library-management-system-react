import { useState } from 'react';

function Transactions({ books, setBooks, transactions, setTransactions, currentUser }) {
  const [bookId, setBookId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const isLibrarian = currentUser?.role === 'Librarian';

  function recordTransaction(type) {
    if (!isLibrarian) {
      setMessage('Only librarians can record stock changes.');
      return;
    }

    const selectedBook = books.find((book) => book.id === bookId);
    const amount = Number(quantity);

    if (!selectedBook) {
      setMessage('Please choose a book.');
      return;
    }

    if (!quantity.trim() || !Number.isSafeInteger(amount) || amount < 1) {
      setMessage('Enter a whole number of 1 or more.');
      return;
    }

    if (type === 'borrow' && selectedBook.quantity < amount) {
      if (selectedBook.quantity === 0) {
        setMessage(`“${selectedBook.title}” is out of stock.`);
      } else {
        setMessage(
          `Only ${selectedBook.quantity} cop${selectedBook.quantity === 1 ? 'y' : 'ies'} available.`
        );
      }
      return;
    }

    const remaining =
      type === 'add'
        ? selectedBook.quantity + amount
        : selectedBook.quantity - amount;

    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === selectedBook.id ? { ...book, quantity: remaining } : book
      )
    );

    const entry = {
      id: crypto.randomUUID(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      type,
      quantity: amount,
      remaining,
      recordedBy: currentUser.name,
      date: new Date().toISOString()
    };

    setTransactions((previousTransactions) => [entry, ...previousTransactions]);
    setQuantity('');
    setMessage(
      type === 'add'
        ? `Added ${amount} cop${amount === 1 ? 'y' : 'ies'} of “${selectedBook.title}”.`
        : `Recorded borrow of ${amount} cop${amount === 1 ? 'y' : 'ies'} of “${selectedBook.title}”.`
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section>
      <h2>Transactions</h2>
      <p>Add stock when new copies arrive, or deduct stock when books are borrowed.</p>

      {!isLibrarian && (
        <p role="status">
          Log in as a librarian on the Users page to record transactions.
        </p>
      )}

      <form className="app-form" onSubmit={handleSubmit}>
        <label>
          Book
          <select
            value={bookId}
            onChange={(event) => setBookId(event.target.value)}
            disabled={!isLibrarian}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.quantity} in stock)
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
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={!isLibrarian}
          />
        </label>

        <div className="form-actions">
          <button
            type="button"
            disabled={!isLibrarian}
            onClick={() => recordTransaction('add')}
          >
            Add Stock
          </button>
          <button
            type="button"
            className="update-button"
            disabled={!isLibrarian}
            onClick={() => recordTransaction('borrow')}
          >
            Deduct Stock (Borrow)
          </button>
        </div>
      </form>

      <p role="status">{message}</p>

      <h3>Transaction History</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Book</th>
              <th scope="col">Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Remaining</th>
              <th scope="col">Recorded by</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleString()}</td>
                <td>{entry.bookTitle}</td>
                <td>{entry.type === 'add' ? 'Add stock' : 'Borrow'}</td>
                <td>{entry.quantity}</td>
                <td>{entry.remaining}</td>
                <td>{entry.recordedBy || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && <p>No transactions have been recorded yet.</p>}
    </section>
  );
}

export default Transactions;
