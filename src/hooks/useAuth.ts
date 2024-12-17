import { useState, useEffect } from 'react';
import { getAuthUrl, exchangeCodeForToken } from '../config/oauth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('airtable_token');
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      exchangeCodeForToken(code)
        .then((token) => {
          localStorage.setItem('airtable_token', token);
          setIsAuthenticated(true);
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch((err) => {
          setError('Failed to authenticate with Airtable');
          console.error('Auth error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate authentication');
      console.error('Login error:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('airtable_token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}