import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AddTrade from './pages/AddTrade';
import Trades from './pages/Trades';
import Review from './pages/Review';
import Playbook from './pages/Playbook';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { ThemeProvider } from './components/ThemeProvider';
import { useAuthStore } from './store/useAuthStore';
import { syncService } from './services/sync.service';

function App() {
  const { initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      // Setup realtime sync when user is logged in
      const subscription = syncService.setupRealtimeSubscription(user.id);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300">
          <main className="container max-w-md mx-auto min-h-screen relative shadow-2xl shadow-black/5 bg-background">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<><NavBar /><Dashboard /><BottomNav /></>} />
              <Route path="/add" element={<><NavBar /><AddTrade /><BottomNav /></>} />
              <Route path="/trades" element={<><NavBar /><Trades /><BottomNav /></>} />
              <Route path="/review" element={<><NavBar /><Review /><BottomNav /></>} />
              <Route path="/playbook" element={<><NavBar /><Playbook /><BottomNav /></>} />
              <Route path="/settings" element={<><NavBar /><Settings /><BottomNav /></>} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
