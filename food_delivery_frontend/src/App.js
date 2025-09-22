import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  resetToSeed,
  getAppState,
  getUsers,
  createUser,
  getRestaurants,
  getMenusByRestaurant,
  createOrder,
  getOrdersByUser
} from './storage/localStore';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [debugInfo, setDebugInfo] = useState('');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Demonstrate storage layer usage on first mount (console + on-screen debug text)
  useEffect(() => {
    // Reset to seed on first load in development sessions for consistency
    const seeded = resetToSeed();

    // Create a sample user and order to show usage
    const user = createUser({ name: 'Dev Tester', email: 'dev@test.local' });
    const restaurants = getRestaurants();
    const firstRestaurant = restaurants[0];
    const menus = firstRestaurant ? getMenusByRestaurant(firstRestaurant.id) : [];
    const firstMenuItem = menus[0];

    let placedOrder = null;
    if (firstRestaurant && firstMenuItem) {
      placedOrder = createOrder({
        userId: user.id,
        restaurantId: firstRestaurant.id,
        items: [{ menuItemId: firstMenuItem.id, quantity: 2 }]
      });
    }

    const users = getUsers();
    const userOrders = getOrdersByUser(user.id);
    const snapshot = getAppState();

    // Log to console and show a compact debug summary on the page
    // so developers can confirm that the storage layer works.
    // eslint-disable-next-line no-console
    console.log('Seeded:', seeded);
    // eslint-disable-next-line no-console
    console.log('All Users:', users);
    // eslint-disable-next-line no-console
    console.log('Restaurants:', restaurants);
    // eslint-disable-next-line no-console
    console.log('Menus for first restaurant:', menus);
    // eslint-disable-next-line no-console
    console.log('Placed Order:', placedOrder);
    // eslint-disable-next-line no-console
    console.log('Orders for Dev Tester:', userOrders);
    // eslint-disable-next-line no-console
    console.log('Full App State Snapshot:', snapshot);

    setDebugInfo(JSON.stringify({
      createdUserId: user?.id,
      firstRestaurant: firstRestaurant?.name,
      firstMenuItem: firstMenuItem?.name,
      placedOrderId: placedOrder?.id,
      userOrderCount: userOrders.length
    }, null, 2));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        <div style={{ textAlign: 'left', maxWidth: 640, background: 'var(--bg-primary)', border: `1px solid var(--border-color)`, borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            Storage Layer Debug (seed, CRUD, order placement)
          </div>
          <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
            {debugInfo}
          </pre>
        </div>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
