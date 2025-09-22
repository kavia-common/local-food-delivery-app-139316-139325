 /**
  * Simple modular localStorage-backed data layer for a food delivery app.
  * Provides CRUD helpers for Users, Restaurants, Menus, and Orders.
  * Includes initial seed data on first run (idempotent).
  *
  * Design goals:
  * - Keep it framework-agnostic and easily swappable for a real API later.
  * - Flat JSON arrays per entity under a single STORAGE_KEY namespace.
  * - Public helpers expose simple CRUD with predictable return values.
  * - All public functions documented with PUBLIC_INTERFACE markers.
  *
  * Note: localStorage is synchronous; for future API replacement,
  * a Promise-based wrapper could be added while keeping this API surface.
  */

 const STORAGE_KEY = 'fd_app_state_v1';

 // Entity collections within the single state object:
 // {
 //   users: [],
 //   restaurants: [],
 //   menus: [],
 //   orders: []
 // }

 // Utility: Safe JSON parse/stringify with fallbacks
 function loadState() {
   try {
     const raw = window.localStorage.getItem(STORAGE_KEY);
     if (!raw) return null;
     return JSON.parse(raw);
   } catch (e) {
     console.warn('Failed to parse local state; resetting.', e);
     return null;
   }
 }

 function saveState(state) {
   try {
     window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
   } catch (e) {
     console.error('Failed to save local state.', e);
   }
 }

 // ID generator: monotonically increasing ID per entity type
 function nextId(items) {
   if (!Array.isArray(items) || items.length === 0) return 1;
   return Math.max(...items.map((i) => Number(i.id) || 0)) + 1;
 }

 // Initialize with seed data if not present
 function ensureInitialized() {
   let state = loadState();
   if (state && state.users && state.restaurants && state.menus && state.orders) {
     return state;
   }

   const seedUsers = [
     { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
     { id: 2, name: 'Bob Smith', email: 'bob@example.com' }
   ];

   const seedRestaurants = [
     { id: 1, name: 'Pasta Palace', cuisine: 'Italian', rating: 4.6 },
     { id: 2, name: 'Sushi Central', cuisine: 'Japanese', rating: 4.8 }
   ];

   const seedMenus = [
     // Each menu item references a restaurantId
     { id: 1, restaurantId: 1, name: 'Spaghetti Carbonara', price: 12.99, description: 'Creamy sauce, pancetta, pecorino.' },
     { id: 2, restaurantId: 1, name: 'Penne Arrabbiata', price: 10.5, description: 'Spicy tomato sauce with garlic and chili.' },
     { id: 3, restaurantId: 2, name: 'Salmon Nigiri (2 pcs)', price: 6.0, description: 'Fresh salmon over seasoned rice.' },
     { id: 4, restaurantId: 2, name: 'California Roll', price: 7.5, description: 'Crab, avocado, cucumber.' }
   ];

   const seedOrders = [
     // Minimal sample order referencing a user and restaurant
     {
       id: 1,
       userId: 1,
       restaurantId: 1,
       items: [
         { menuItemId: 1, quantity: 1, unitPrice: 12.99 }
       ],
       status: 'placed', // placed | preparing | delivering | completed | cancelled
       total: 12.99,
       createdAt: new Date().toISOString()
     }
   ];

   state = {
     users: seedUsers,
     restaurants: seedRestaurants,
     menus: seedMenus,
     orders: seedOrders
   };

   saveState(state);
   return state;
 }

 // Internal accessor to always work on fresh state
 function getState() {
   return ensureInitialized();
 }

 function setState(mutator) {
   const state = getState();
   const newState = mutator({ ...state });
   saveState(newState);
   return newState;
 }

 // PUBLIC_INTERFACE
 export function resetToSeed() {
   /**
    * Resets the local storage to the initial seed data.
    * Returns the seeded state object.
    */
   // Clear first to avoid stale leftovers if schema changes.
   window.localStorage.removeItem(STORAGE_KEY);
   return ensureInitialized();
 }

 // -------- Users CRUD --------

 // PUBLIC_INTERFACE
 export function getUsers() {
   /** Returns an array of all users. */
   return getState().users.slice();
 }

 // PUBLIC_INTERFACE
 export function getUserById(id) {
   /** Returns a user by id or undefined. */
   return getState().users.find((u) => Number(u.id) === Number(id));
 }

 // PUBLIC_INTERFACE
 export function createUser(user) {
   /**
    * Creates a new user.
    * user: { name, email }
    * Returns the created user with id.
    */
   let created = null;
   setState((state) => {
     const id = nextId(state.users);
     created = { id, name: user.name, email: user.email };
     return { ...state, users: [...state.users, created] };
   });
   return created;
 }

 // PUBLIC_INTERFACE
 export function updateUser(id, patch) {
   /**
    * Updates an existing user by id with fields in patch.
    * Returns the updated user or null if not found.
    */
   let updated = null;
   setState((state) => {
     const idx = state.users.findIndex((u) => Number(u.id) === Number(id));
     if (idx === -1) return state;
     const merged = { ...state.users[idx], ...patch, id: state.users[idx].id };
     updated = merged;
     const users = state.users.slice();
     users[idx] = merged;
     return { ...state, users };
   });
   return updated;
 }

 // PUBLIC_INTERFACE
 export function deleteUser(id) {
   /**
    * Deletes a user by id.
    * Returns true if deleted, false if not found.
    */
   let deleted = false;
   setState((state) => {
     const before = state.users.length;
     const users = state.users.filter((u) => Number(u.id) !== Number(id));
     deleted = users.length < before;
     return { ...state, users };
   });
   return deleted;
 }

 // -------- Restaurants CRUD --------

 // PUBLIC_INTERFACE
 export function getRestaurants() {
   /** Returns an array of all restaurants. */
   return getState().restaurants.slice();
 }

 // PUBLIC_INTERFACE
 export function getRestaurantById(id) {
   /** Returns a restaurant by id or undefined. */
   return getState().restaurants.find((r) => Number(r.id) === Number(id));
 }

 // PUBLIC_INTERFACE
 export function createRestaurant(restaurant) {
   /**
    * Creates a new restaurant.
    * restaurant: { name, cuisine, rating }
    * Returns the created restaurant with id.
    */
   let created = null;
   setState((state) => {
     const id = nextId(state.restaurants);
     created = {
       id,
       name: restaurant.name,
       cuisine: restaurant.cuisine || '',
       rating: typeof restaurant.rating === 'number' ? restaurant.rating : 0
     };
     return { ...state, restaurants: [...state.restaurants, created] };
   });
   return created;
 }

 // PUBLIC_INTERFACE
 export function updateRestaurant(id, patch) {
   /**
    * Updates a restaurant by id with fields in patch.
    * Returns the updated restaurant or null if not found.
    */
   let updated = null;
   setState((state) => {
     const idx = state.restaurants.findIndex((r) => Number(r.id) === Number(id));
     if (idx === -1) return state;
     const merged = { ...state.restaurants[idx], ...patch, id: state.restaurants[idx].id };
     updated = merged;
     const restaurants = state.restaurants.slice();
     restaurants[idx] = merged;
     return { ...state, restaurants };
   });
   return updated;
 }

 // PUBLIC_INTERFACE
 export function deleteRestaurant(id) {
   /**
    * Deletes a restaurant by id.
    * Also deletes related menus and soft-cancels related orders.
    * Returns true if deleted, false if not found.
    */
   let deleted = false;
   setState((state) => {
     const before = state.restaurants.length;
     const restaurants = state.restaurants.filter((r) => Number(r.id) !== Number(id));
     deleted = restaurants.length < before;
     const menus = state.menus.filter((m) => Number(m.restaurantId) !== Number(id));
     const orders = state.orders.map((o) =>
       Number(o.restaurantId) === Number(id) && o.status !== 'completed'
         ? { ...o, status: 'cancelled' }
         : o
     );
     return { ...state, restaurants, menus, orders };
   });
   return deleted;
 }

 // -------- Menus CRUD --------

 // PUBLIC_INTERFACE
 export function getMenus() {
   /** Returns all menu items. */
   return getState().menus.slice();
 }

 // PUBLIC_INTERFACE
 export function getMenusByRestaurant(restaurantId) {
   /** Returns menu items for a given restaurant id. */
   return getState().menus.filter((m) => Number(m.restaurantId) === Number(restaurantId));
 }

 // PUBLIC_INTERFACE
 export function getMenuItemById(id) {
   /** Returns a menu item by id or undefined. */
   return getState().menus.find((m) => Number(m.id) === Number(id));
 }

 // PUBLIC_INTERFACE
 export function createMenuItem(menuItem) {
   /**
    * Creates a new menu item.
    * menuItem: { restaurantId, name, price, description }
    * Returns the created item with id.
    */
   let created = null;
   setState((state) => {
     const id = nextId(state.menus);
     created = {
       id,
       restaurantId: Number(menuItem.restaurantId),
       name: menuItem.name,
       price: Number(menuItem.price),
       description: menuItem.description || ''
     };
     return { ...state, menus: [...state.menus, created] };
   });
   return created;
 }

 // PUBLIC_INTERFACE
 export function updateMenuItem(id, patch) {
   /**
    * Updates a menu item by id with fields in patch.
    * Returns the updated item or null if not found.
    */
   let updated = null;
   setState((state) => {
     const idx = state.menus.findIndex((m) => Number(m.id) === Number(id));
     if (idx === -1) return state;
     const merged = { ...state.menus[idx], ...patch, id: state.menus[idx].id };
     updated = merged;
     const menus = state.menus.slice();
     menus[idx] = merged;
     return { ...state, menus };
   });
   return updated;
 }

 // PUBLIC_INTERFACE
 export function deleteMenuItem(id) {
   /**
    * Deletes a menu item by id.
    * Returns true if deleted, false if not found.
    */
   let deleted = false;
   setState((state) => {
     const before = state.menus.length;
     const menus = state.menus.filter((m) => Number(m.id) !== Number(id));
     deleted = menus.length < before;
     return { ...state, menus };
   });
   return deleted;
 }

 // -------- Orders CRUD --------

 // PUBLIC_INTERFACE
 export function getOrders() {
   /** Returns an array of all orders. */
   return getState().orders.slice();
 }

 // PUBLIC_INTERFACE
 export function getOrdersByUser(userId) {
   /** Returns orders placed by a specific user. */
   return getState().orders.filter((o) => Number(o.userId) === Number(userId));
 }

 // PUBLIC_INTERFACE
 export function getOrderById(id) {
   /** Returns an order by id or undefined. */
   return getState().orders.find((o) => Number(o.id) === Number(id));
 }

 // PUBLIC_INTERFACE
 export function createOrder(order) {
   /**
    * Creates a new order.
    * order: { userId, restaurantId, items: [{menuItemId, quantity, unitPrice?}] }
    * - If item.unitPrice is missing, it will be looked up from menu.
    * Returns the created order with id, total, status ('placed'), createdAt.
    */
   let created = null;
   setState((state) => {
     const id = nextId(state.orders);
     const itemsWithPricing = (order.items || []).map((it) => {
       const menu = state.menus.find((m) => Number(m.id) === Number(it.menuItemId));
       const price = typeof it.unitPrice === 'number' ? it.unitPrice : (menu ? Number(menu.price) : 0);
       const qty = Math.max(1, Number(it.quantity) || 1);
       return { menuItemId: Number(it.menuItemId), quantity: qty, unitPrice: price };
     });
     const total = itemsWithPricing.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
     created = {
       id,
       userId: Number(order.userId),
       restaurantId: Number(order.restaurantId),
       items: itemsWithPricing,
       status: 'placed',
       total: Number(total.toFixed(2)),
       createdAt: new Date().toISOString()
     };
     return { ...state, orders: [...state.orders, created] };
   });
   return created;
 }

 // PUBLIC_INTERFACE
 export function updateOrderStatus(id, status) {
   /**
    * Updates only the status of an order.
    * Allowed: placed | preparing | delivering | completed | cancelled
    * Returns the updated order or null if not found.
    */
   const allowed = new Set(['placed', 'preparing', 'delivering', 'completed', 'cancelled']);
   if (!allowed.has(status)) {
     console.warn('Invalid order status:', status);
   }
   let updated = null;
   setState((state) => {
     const idx = state.orders.findIndex((o) => Number(o.id) === Number(id));
     if (idx === -1) return state;
     const merged = { ...state.orders[idx], status };
     updated = merged;
     const orders = state.orders.slice();
     orders[idx] = merged;
     return { ...state, orders };
   });
   return updated;
 }

 // PUBLIC_INTERFACE
 export function deleteOrder(id) {
   /**
    * Deletes an order by id.
    * Returns true if deleted, false if not found.
    */
   let deleted = false;
   setState((state) => {
     const before = state.orders.length;
     const orders = state.orders.filter((o) => Number(o.id) !== Number(id));
     deleted = orders.length < before;
     return { ...state, orders };
   });
   return deleted;
 }

 // PUBLIC_INTERFACE
 export function getAppState() {
   /** Returns the entire app state snapshot. */
   return getState();
 }

 // Example usage notes:
 // You can run the following in any component to exercise the API:
 //
 // import {
 //   resetToSeed, getUsers, createUser,
 //   getRestaurants, getMenusByRestaurant,
 //   createOrder, getOrdersByUser
 // } from './storage/localStore';
 //
 // console.log('All users:', getUsers());
 // const newUser = createUser({ name: 'Charlie', email: 'charlie@example.com' });
 // console.log('Created user:', newUser);
 // console.log('Menus for restaurant 1:', getMenusByRestaurant(1));
 // const order = createOrder({
 //   userId: newUser.id,
 //   restaurantId: 1,
 //   items: [{ menuItemId: 1, quantity: 2 }]
 // });
 // console.log('Placed order:', order);
 // console.log('Orders for user:', getOrdersByUser(newUser.id));
