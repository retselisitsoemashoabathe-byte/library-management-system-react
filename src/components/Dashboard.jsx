function stockStatus(quantity) {
  if (quantity === 0) {
    return 'Out of stock';
  }

  if (quantity < 2) {
    return 'Low stock';
  }

  return 'Available';
}

function Dashboard({ books }) {
  const lowStockCount = books.filter((book) => book.quantity < 2).length;
  const totalCopies = books.reduce((total, book) => total + book.quantity, 0);

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Current book availability. Fewer than 2 copies means low stock.</p>

      <div className="summary-cards">
        <article className="summary-card">
          <h3>Titles</h3>
          <p>{books.length}</p>
        </article>
        <article className="summary-card">
          <h3>Copies in stock</h3>
          <p>{totalCopies}</p>
        </article>
        <article className="summary-card warning">
          <h3>Low stock titles</h3>
          <p>{lowStockCount}</p>
        </article>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Genre</th>
              <th scope="col">Copies</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className={book.quantity < 2 ? 'low-stock' : ''}
              >
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>{stockStatus(book.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && <p>No books have been added yet.</p>}
    </section>
  );
}

export default Dashboard;
