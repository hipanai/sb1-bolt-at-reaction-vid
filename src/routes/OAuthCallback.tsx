import React, { useEffect, useState } from 'react';
import { exchangeCodeForToken } from '../config/oauth';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setError(error);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    exchangeCodeForToken(code)
      .then((token) => {
        localStorage.setItem('airtable_token', token);
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('OAuth error:', err);
        setError('Failed to complete authentication');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Authentication failed: {error}</p>
          <a href="/" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}