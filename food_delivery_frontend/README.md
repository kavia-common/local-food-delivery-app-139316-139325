# Food Delivery Frontend (Local JSON Storage)

A lightweight React frontend that simulates backend persistence using the browser's `localStorage`. This initial structure focuses on a modular data layer with CRUD operations for Users, Restaurants, Menus, and Orders.

## Quick Start

- `npm start` – run locally at http://localhost:3000
- The app seeds example data on first load and demonstrates the data layer in the console and a small debug panel.

## Data Model and Storage

- Backed by a single JSON object in `localStorage` under key `fd_app_state_v1`.
- Entities:
  - `users`: `{ id, name, email }`
  - `restaurants`: `{ id, name, cuisine, rating }`
  - `menus`: `{ id, restaurantId, name, price, description }`
  - `orders`: `{ id, userId, restaurantId, items: [{menuItemId, quantity, unitPrice}], status, total, createdAt }`

Storage helper: `src/storage/localStore.js`

### Public API

All public functions are marked with `PUBLIC_INTERFACE` and include docstrings.

- App State
  - `getAppState()`
  - `resetToSeed()`
- Users
  - `getUsers()`, `getUserById(id)`, `createUser({ name, email })`, `updateUser(id, patch)`, `deleteUser(id)`
- Restaurants
  - `getRestaurants()`, `getRestaurantById(id)`, `createRestaurant({...})`, `updateRestaurant(id, patch)`, `deleteRestaurant(id)`
- Menus
  - `getMenus()`, `getMenusByRestaurant(restaurantId)`, `getMenuItemById(id)`, `createMenuItem({...})`, `updateMenuItem(id, patch)`, `deleteMenuItem(id)`
- Orders
  - `getOrders()`, `getOrdersByUser(userId)`, `getOrderById(id)`, `createOrder({...})`, `updateOrderStatus(id, status)`, `deleteOrder(id)`

### Example Usage

See `src/App.js` for a mounted effect that:
- Resets seed data,
- Creates a sample user,
- Places an order against the first restaurant/menu item,
- Logs snapshots to the console and shows a compact debug summary.

To try ad-hoc calls, you can import functions in any component:
```js
import { getUsers, createOrder } from './storage/localStore';
```

## Extensibility

- This storage layer is deliberately small and synchronous for clarity.
- It can be adapted to a Promise-based API without changing call sites significantly.
- Replace the implementation with real API calls later while keeping the same exported interface.

## Styling

The template uses simple CSS variables in `src/App.css` for light/dark themes.
