import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');

  const API_URL = "http://localhost:xxxx"; // backend URL

  // 🔹 FETCH all users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 CREATE new user
  const handleSubmit = async () => {
    if (!name || !age) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age })
      });
      const data = await res.json();
      alert(data.message);
      setName('');
      setAge('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // 🔹 DELETE user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API_URL}/delete-user/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 EDIT user
  const handleEdit = (user) => {
    setEditId(user._id);
    setEditName(user.name);
    setEditAge(user.age);
  };

  // 🔹 UPDATE user
  const handleUpdate = async (id) => {
    if (!editName || !editAge) {
      alert("Please fill all fields");
      return;
    }
    try {
      await fetch(`${API_URL}/update-user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, age: editAge })
      });
      setEditId(null);
      setEditName('');
      setEditAge('');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditAge('');
  };

  return (
    <div className="app-container">
      <h1>User Management System</h1>

      {/* CREATE FORM */}
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* USER LIST */}
      <div className="user-list">
        {users.length === 0 ? (
          <p className="empty-message">No users yet</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              {editId === user._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                  />
                  <button className="btn-save" onClick={() => handleUpdate(user._id)}>Save</button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <div>
                    <p>{user.name}</p>
                    <p>Age: {user.age}</p>
                  </div>
                  <div>
                    <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(user._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
