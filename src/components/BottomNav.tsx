import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Plus, LineChart, Book } from 'lucide-react';
import { cn } from '../lib/utils';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface pb-safe transition-colors duration-300">
      <div className="flex h-16 items-center justify-around px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
            )
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        
        <NavLink
          to="/trades"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
            )
          }
        >
          <List className="h-5 w-5" />
          <span>Trades</span>
        </NavLink>

        <NavLink
          to="/add"
          className="flex flex-col items-center justify-center -mt-6"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg transition-transform active:scale-95 text-accent-foreground">
            <Plus className="h-8 w-8" />
          </div>
        </NavLink>

        <NavLink
          to="/review"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
            )
          }
        >
          <LineChart className="h-5 w-5" />
          <span>Review</span>
        </NavLink>

        <NavLink
          to="/playbook"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
            )
          }
        >
          <Book className="h-5 w-5" />
          <span>Playbook</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
