function getStatus(qty) {
  if (qty === 0) {
    return 'Out of stock';
  }
  if (qty < 2) {
    return 'Low stock';
  }
  return 'Available';
}

function Dashboard({ books }) {
  const lowStock = books.filter((b) => b.quantity < 2).length;
  let copies = 0;
  for (let i = 0; i < books.length; i++) {
    copies += books[i].quantity;
  }

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Stock overview. Yellow rows are books with 0 or 1 copy left.</p>

      <div className="summary-cards">
        <article className="summary-card">
          <h3>Titles</h3>
          <p>{books.length}</p>
        </article>
        <article className="summary-card">
          <h3>Total copies</h3>
          <p>{copies}</p>
        </article>
        <article className="summary-card warning">
          <h3>Low stock</h3>
          <p>{lowStock}</p>
        </article>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Copies</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className={book.quantity < 2 ? 'low-stock' : ''}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>{getStatus(book.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && <p>No books yet.</p>}
    </section>
  );
}

export default Dashboard;
