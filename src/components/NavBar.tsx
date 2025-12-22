import React from 'react';
import { Settings, LogIn, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const NavBar = () => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-surface px-4 sm:px-6 transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary">
        <span className="text-xl tracking-tight">ReasonTrack</span>
      </Link>
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-trading-profit animate-pulse" />
            <span className="text-xs font-medium text-accent">Synced</span>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        )}
        <Link to="/settings" className="p-2 text-text-secondary hover:text-text-primary transition-colors">
          {user ? <User className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
