import { useState } from 'react';

const emptyUserForm = {
  name: '',
  membershipId: '',
  role: 'Member'
};

function Users({ users, setUsers, currentUser, setCurrentUser }) {
  const [loginId, setLoginId] = useState('');
  const [form, setForm] = useState(emptyUserForm);
  const [editingId, setEditingId] = useState(null);
  const [loginMessage, setLoginMessage] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const isLibrarian = currentUser?.role === 'Librarian';

  function handleLogin(event) {
    event.preventDefault();

    const membershipId = loginId.trim().toUpperCase();
    const match = users.find(
      (user) => user.membershipId.toUpperCase() === membershipId
    );

    if (!match) {
      setLoginMessage('No user found with that membership ID.');
      return;
    }

    setCurrentUser(match);
    setLoginId('');
    setLoginMessage(`Welcome, ${match.name}.`);
  }

  function handleUserChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  function handleUserSubmit(event) {
    event.preventDefault();

    if (!isLibrarian) {
      setAdminMessage('Only librarians can manage users.');
      return;
    }

    const name = form.name.trim();
    const membershipId = form.membershipId.trim().toUpperCase();
    const role = form.role;

    if (!name || !membershipId || !role) {
      setAdminMessage('Please complete every field.');
      return;
    }

    const idTaken = users.some(
      (user) =>
        user.id !== editingId &&
        user.membershipId.toUpperCase() === membershipId
    );

    if (idTaken) {
      setAdminMessage('That membership ID is already in use.');
      return;
    }

    if (editingId) {
      const updatedUser = { id: editingId, name, membershipId, role };

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === editingId ? updatedUser : user
        )
      );

      if (currentUser?.id === editingId) {
        setCurrentUser(updatedUser);
      }

      setEditingId(null);
      setForm(emptyUserForm);
      setAdminMessage('User updated successfully.');
      return;
    }

    setUsers((previousUsers) => [
      ...previousUsers,
      {
        id: crypto.randomUUID(),
        name,
        membershipId,
        role
      }
    ]);

    setForm(emptyUserForm);
    setAdminMessage('User added successfully.');
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role
    });
    setAdminMessage(`Editing ${user.name}.`);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyUserForm);
    setAdminMessage('Edit cancelled.');
  }

  function handleDelete(userId) {
    if (!isLibrarian) {
      setAdminMessage('Only librarians can delete users.');
      return;
    }

    if (currentUser?.id === userId) {
      setAdminMessage('You cannot delete the account you are using.');
      return;
    }

    const confirmed = window.confirm('Delete this user?');

    if (!confirmed) {
      return;
    }

    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== userId)
    );

    if (editingId === userId) {
      setEditingId(null);
      setForm(emptyUserForm);
    }

    setAdminMessage('User deleted successfully.');
  }

  return (
    <section>
      <h2>User Management</h2>
      <p>Members sign in with their membership ID. Librarians can add, update, and delete accounts.</p>

      <h3>Login</h3>
      {currentUser ? (
        <p role="status">
          You are signed in as {currentUser.name} ({currentUser.membershipId}).
        </p>
      ) : (
        <form className="app-form" onSubmit={handleLogin}>
          <label>
            Membership ID
            <input
              name="membershipId"
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="e.g. LIB001"
              required
            />
          </label>
          <button type="submit">Log in</button>
        </form>
      )}
      <p role="status">{loginMessage}</p>
      {!currentUser && (
        <p>Sample accounts: librarian <strong>LIB001</strong>, member <strong>MEM001</strong>.</p>
      )}

      <h3>Admin view</h3>
      {!isLibrarian && (
        <p role="status">
          Sign in with a librarian membership ID to add, update, or delete users.
        </p>
      )}

      <form className="app-form" onSubmit={handleUserSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleUserChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          Membership ID
          <input
            name="membershipId"
            value={form.membershipId}
            onChange={handleUserChange}
            required
            disabled={!isLibrarian}
          />
        </label>

        <label>
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleUserChange}
            disabled={!isLibrarian}
          >
            <option value="Member">Member</option>
            <option value="Librarian">Librarian</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!isLibrarian}>
            {editingId ? 'Save Changes' : 'Add User'}
          </button>
          {editingId && (
            <button type="button" className="secondary-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <p role="status">{adminMessage}</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Membership ID</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.membershipId}</td>
                <td>{user.role}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="update-button"
                      onClick={() => handleEdit(user)}
                      disabled={!isLibrarian}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(user.id)}
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

      {users.length === 0 && <p>No users have been added yet.</p>}
    </section>
  );
}

export default Users;
