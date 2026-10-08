import { NavLink } from 'react-router-dom';

function Navigation({ currentUser, onLogout }) {
  return (
    <nav aria-label="Main navigation">
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">Users</NavLink>
      </div>

      {currentUser && (
        <div className="session-bar">
          <p>
            Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})
          </p>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
