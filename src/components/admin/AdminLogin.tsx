'use client';
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      setPassword('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <p>Enter your password to access the admin panel</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
              autoFocus
            />
          </div>

          {error && <div className="form-message error">{error}</div>}

          <button type="submit" className="btn btn-gold">
            Login
          </button>
        </form>

        <div className="admin-help">
          <p></p>
          <p className="text-sm"></p>
        </div>
      </div>
    </div>
  );
}
