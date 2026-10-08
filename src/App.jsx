import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Books from './components/Books';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Transactions from './components/Transactions';
import Users from './components/Users';
import { defaultBooks, defaultUsers } from './data/defaults';
import { loadFromStorage, saveToStorage } from './utils/storage';

function App() {
  const [books, setBooks] = useState(() =>
    loadFromStorage('communityLibraryBooks', defaultBooks)
  );
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage('communityLibraryTransactions', [])
  );
  const [users, setUsers] = useState(() =>
    loadFromStorage('communityLibraryUsers', defaultUsers)
  );
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage('communityLibrarySession', null)
  );

  useEffect(() => {
    saveToStorage('communityLibraryBooks', books);
  }, [books]);

  useEffect(() => {
    saveToStorage('communityLibraryTransactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage('communityLibraryUsers', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('communityLibrarySession', currentUser);
  }, [currentUser]);

  function handleLogout() {
    setCurrentUser(null);
  }

  return (
    <BrowserRouter>
      <main>
        <header>
          <h1>Community Library</h1>
          <p>Manage books, track availability, and manage members.</p>
        </header>

        <Navigation currentUser={currentUser} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Dashboard books={books} />} />
          <Route
            path="/books"
            element={
              <Books
                books={books}
                setBooks={setBooks}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <Transactions
                books={books}
                setBooks={setBooks}
                transactions={transactions}
                setTransactions={setTransactions}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users
                users={users}
                setUsers={setUsers}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
