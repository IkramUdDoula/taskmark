import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLocalModeWarning, setShowLocalModeWarning] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalMode = () => {
    setShowLocalModeWarning(true);
  };

  const confirmLocalMode = () => {
    localStorage.setItem('taskmark_local_mode', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] font-mono">&lt;taskmark&gt;</h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Or{' '}
            <Link to="/auth/signup" className="font-medium text-[var(--accent)] hover:text-[var(--accent-light)]">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-[var(--button-delete-bg)] p-4">
              <div className="text-sm text-[var(--button-delete-icon)]">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border)] placeholder-[var(--text-muted)] text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-t-md focus:outline-none focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border)] placeholder-[var(--text-muted)] text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-b-md focus:outline-none focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/auth/reset-password" className="font-medium text-[var(--accent)] hover:text-[var(--accent-light)]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--bg-primary)] bg-[var(--accent)] hover:bg-[var(--accent-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLocalMode}
              className="w-full flex justify-center py-2 px-4 border border-[var(--border)] rounded-md shadow-sm text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Local Mode
            </button>
          </div>
        </form>

        {showLocalModeWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                Local Mode Warning
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                In local mode:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] mb-6 space-y-2">
                <li>Your notes will be stored only on this device</li>
                <li>Data will not be synced to the cloud</li>
                <li>You can switch to cloud mode later</li>
                <li>Your data will be lost if you clear browser data</li>
              </ul>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLocalModeWarning(false)}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLocalMode}
                  className="px-4 py-2 text-sm font-medium text-[var(--bg-primary)] bg-[var(--accent)] hover:bg-[var(--accent-light)] rounded-md"
                >
                  Continue in Local Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 