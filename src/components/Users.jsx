import { useState } from 'react';

const blankUser = {
  name: '',
  membershipId: '',
  role: 'Member'
};

function Users({ users, setUsers, currentUser, setCurrentUser }) {
  const [loginId, setLoginId] = useState('');
  const [form, setForm] = useState(blankUser);
  const [editId, setEditId] = useState(null);
  const [loginMsg, setLoginMsg] = useState('');
  const [msg, setMsg] = useState('');

  const canEdit = currentUser && currentUser.role === 'Librarian';

  function login(e) {
    e.preventDefault();
    const id = loginId.trim().toUpperCase();
    const found = users.find((u) => u.membershipId.toUpperCase() === id);

    if (!found) {
      setLoginMsg('Wrong membership ID.');
      return;
    }

    setCurrentUser(found);
    setLoginId('');
    setLoginMsg('Hi ' + found.name);
  }

  function onChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    setForm((old) => ({ ...old, [field]: value }));
  }

  function saveUser(e) {
    e.preventDefault();

    if (!canEdit) {
      setMsg('Need librarian login to manage users.');
      return;
    }

    const name = form.name.trim();
    const membershipId = form.membershipId.trim().toUpperCase();
    const role = form.role;

    if (!name || !membershipId || !role) {
      setMsg('Fill in all the fields.');
      return;
    }

    const taken = users.some(
      (u) => u.id !== editId && u.membershipId.toUpperCase() === membershipId
    );
    if (taken) {
      setMsg('Membership ID already used.');
      return;
    }

    if (editId) {
      const updated = { id: editId, name, membershipId, role };
      setUsers((old) => old.map((u) => (u.id === editId ? updated : u)));
      if (currentUser && currentUser.id === editId) {
        setCurrentUser(updated);
      }
      setEditId(null);
      setForm(blankUser);
      setMsg('User updated.');
      return;
    }

    setUsers((old) => [
      ...old,
      { id: crypto.randomUUID(), name, membershipId, role }
    ]);
    setForm(blankUser);
    setMsg('User added.');
  }

  function startEdit(user) {
    setEditId(user.id);
    setForm({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role
    });
    setMsg('Editing ' + user.name);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(blankUser);
    setMsg('');
  }

  function removeUser(id) {
    if (!canEdit) {
      setMsg('Need librarian login to manage users.');
      return;
    }

    if (currentUser && currentUser.id === id) {
      setMsg("Don't delete the account you're using.");
      return;
    }

    if (!window.confirm('Delete this user?')) {
      return;
    }

    setUsers((old) => old.filter((u) => u.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm(blankUser);
    }
    setMsg('User deleted.');
  }

  return (
    <section>
      <h2>Users</h2>
      <p>Login with membership ID. Librarian can add / update / delete people.</p>

      <h3>Login</h3>
      {currentUser ? (
        <p>
          Currently: {currentUser.name} ({currentUser.membershipId})
        </p>
      ) : (
        <form className="app-form" onSubmit={login}>
          <label>
            Membership ID
            <input
              name="membershipId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      )}
      <p>{loginMsg}</p>
      {!currentUser && (
        <p>
          Try <strong>LIB001</strong> (librarian) or <strong>MEM001</strong> (member).
        </p>
      )}

      <h3>Manage users</h3>
      {!canEdit && <p>Librarian login needed for the form below.</p>}

      <form className="app-form" onSubmit={saveUser}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required disabled={!canEdit} />
        </label>
        <label>
          Membership ID
          <input
            name="membershipId"
            value={form.membershipId}
            onChange={onChange}
            required
            disabled={!canEdit}
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={onChange} disabled={!canEdit}>
            <option value="Member">Member</option>
            <option value="Librarian">Librarian</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" disabled={!canEdit}>
            {editId ? 'Save' : 'Add User'}
          </button>
          {editId && (
            <button type="button" className="secondary-button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <p>{msg}</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th></th>
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
                      onClick={() => startEdit(user)}
                      disabled={!canEdit}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => removeUser(user.id)}
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
    </section>
  );
}

export default Users;
