import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import User from '../models/User';
import UserFormProps from '../models/UserFormProps';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch users from API
  useEffect(() => {
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching users');
        setLoading(false);
      });
  }, []);

  // Create a new user
  const createUser = (newUser: User) => {
    axios
      .post<User>('https://jsonplaceholder.typicode.com/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setView('list');
      })
      .catch((error) => console.error('Error creating user:', error));
  };

  // Edit existing user
  const updateUser = (updatedUser: User) => {
    axios
      .put<User>(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser)
      .then((response) => {
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? response.data : user))
        );
        setView('list');
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  // Delete a user
  const handleDelete = (id: number) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch(() => setError('Failed to delete user'));
  };

  // Switch to edit view with selected user
  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setView('edit');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User Management</h1>

      {/* Navigation between list, create, and edit */}
      {view === 'list' && (
        <div>
          <button type='submit' onClick={() => setView('create')}>Create User</button>
        </div>
      )}

      {/* Display User List */}
      {view === 'list' && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><Link to={`/user/${user.id}`}>{user.name}</Link></td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button type='submit' onClick={() => handleEditClick(user)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display Create User Form */}
      {view === 'create' && (
        <UserForm
          onSubmit={createUser}
          onCancel={() => setView('list')}
          initialData={{ name: '', email: '', phone: '' }}
        />
      )}

      {/* Display Edit User Form */}
      {view === 'edit' && currentUser && (
        <UserForm
          onSubmit={updateUser}
          onCancel={() => setView('list')}
          initialData={currentUser}
        />
      )}
    </div>
  );
};

const UserForm = ({ onSubmit, onCancel, initialData }: UserFormProps) => {
  const [formData, setFormData] = useState<Partial<User>>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      onSubmit(formData as User);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default Users;
