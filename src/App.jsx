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
  // keep these in App so the pages can share the same lists
  const [books, setBooks] = useState(() =>
    loadFromStorage('lmsBooks', defaultBooks)
  );
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage('lmsTransactions', [])
  );
  const [users, setUsers] = useState(() =>
    loadFromStorage('lmsUsers', defaultUsers)
  );
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage('lmsSession', null)
  );

  useEffect(() => {
    saveToStorage('lmsBooks', books);
  }, [books]);

  useEffect(() => {
    saveToStorage('lmsTransactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage('lmsUsers', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('lmsSession', currentUser);
  }, [currentUser]);

  function logout() {
    setCurrentUser(null);
  }

  return (
    <BrowserRouter>
      <main>
        <header>
          <h1>Community Library</h1>
          <p>Books, stock and members for the community library.</p>
        </header>

        <Navigation currentUser={currentUser} onLogout={logout} />

        <Routes>
          <Route path="/" element={<Dashboard books={books} />} />
          <Route
            path="/books"
            element={
              <Books books={books} setBooks={setBooks} currentUser={currentUser} />
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
