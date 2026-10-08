import { NavLink } from 'react-router-dom';

function Navigation({ currentUser, onLogout }) {
  return (
    <nav>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">Users</NavLink>
      </div>

      {currentUser && (
        <div className="session-bar">
          <p>
            Logged in: <strong>{currentUser.name}</strong> ({currentUser.role})
          </p>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
