import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const { error } = await resetPassword(email);
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] font-mono">&lt;taskmark&gt;</h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Remember your password?{' '}
            <Link to="/auth/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-light)]">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-[var(--button-delete-bg)] p-4">
              <div className="text-sm text-[var(--button-delete-icon)]">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-[var(--bg-secondary)] p-4">
              <div className="text-sm text-[var(--text-primary)]">
                Check your email for a password reset link.
              </div>
            </div>
          )}
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-[var(--text-muted)] text-[var(--text-primary)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--bg-primary)] bg-[var(--accent)] hover:bg-[var(--accent-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : success ? 'Reset Link Sent' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 