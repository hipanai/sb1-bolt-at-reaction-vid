import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

interface LoginButtonProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function LoginButton({ isAuthenticated, onLogin, onLogout }: LoginButtonProps) {
  return (
    <button
      onClick={isAuthenticated ? onLogout : onLogin}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      {isAuthenticated ? (
        <>
          <LogOut size={20} />
          Logout
        </>
      ) : (
        <>
          <LogIn size={20} />
          Login with Airtable
        </>
      )}
    </button>
  );
}