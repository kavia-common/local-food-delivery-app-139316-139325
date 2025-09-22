import React, { useState, useEffect } from 'react';
import './App.css';
import RestaurantList from './components/RestaurantList';

// PUBLIC_INTERFACE
function App() {
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

      <RestaurantList />
    </div>
  );
}

export default App;
