import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import RestaurantList from './components/RestaurantList';

// PUBLIC_INTERFACE
function App() {
  /**
   * App root: shows the designed HomePage first, then the restaurant list section.
   * Keeps Ocean Professional header toggle for theme demo.
   */
  const [theme, setTheme] = useState('light');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      {/* Ocean Professional minimal app chrome */}
      <header
        style={{
          background: theme === 'light' ? '#f9fafb' : 'var(--bg-secondary)',
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(17,24,39,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 10
          }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            aria-hidden
            style={{
              width: 12,
              height: 12,
              borderRadius: 4,
              background: '#2563EB',
              boxShadow: '0 0 0 4px rgba(37,99,235,0.15)'
            }}
          />
          <div style={{ fontWeight: 800, color: '#111827' }}>Local Food Delivery</div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      {/* Homepage hero per design */}
      <Home onExplore={() => { /* no-op; scrolling handled in component */ }} />

      {/* Anchor bridge so CTA can scroll here */}
      <div id="restaurant-list" />

      {/* Continue with the app content: Restaurant directory */}
      <RestaurantList />
    </div>
  );
}

export default App;
