import React, { useMemo } from 'react';
import { getRestaurantById, getMenusByRestaurant } from '../storage/localStore';

/**
 * RestaurantDetail
 * Displays a single restaurant's information and its menu items.
 * Data fetched synchronously from local storage helpers.
 * 
 * Ocean Professional styling: clean cards, blue/amber accents.
 */
// PUBLIC_INTERFACE
export default function RestaurantDetail({ restaurantId, onBack }) {
  /** 
   * Renders the full details of a restaurant, including its menu.
   * Props:
   * - restaurantId: number|string, the restaurant's id to display
   * - onBack: function to call when the user wants to go back to the list
   */
  const restaurant = useMemo(() => getRestaurantById(restaurantId), [restaurantId]);
  const menu = useMemo(() => getMenusByRestaurant(restaurantId), [restaurantId]);

  const styles = {
    page: {
      background: '#f9fafb',
      minHeight: '100vh',
      paddingTop: 24,
      paddingBottom: 24,
    },
    container: {
      maxWidth: 960,
      margin: '0 auto',
      padding: '0 16px',
    },
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: '#ffffff',
      border: '1px solid rgba(17,24,39,0.12)',
      color: '#1f2937',
      padding: '8px 12px',
      borderRadius: 10,
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      marginBottom: 16
    },
    headerCard: {
      background: '#ffffff',
      border: '1px solid rgba(17,24,39,0.06)',
      borderRadius: 16,
      padding: 20,
      boxShadow: '0 4px 14px rgba(37,99,235,0.08)',
      marginBottom: 20,
    },
    title: {
      margin: 0,
      color: '#111827',
      fontSize: 26,
      fontWeight: 800,
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 10,
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      color: '#0f172a',
      background: 'linear-gradient(180deg, rgba(37,99,235,0.08), #ffffff)',
      border: '1px solid rgba(37,99,235,0.25)',
    },
    chipAmber: {
      background: 'linear-gradient(180deg, rgba(245,158,11,0.12), #ffffff)',
      border: '1px solid rgba(245,158,11,0.35)',
      color: '#7c2d12',
    },
    sectionTitle: {
      margin: '16px 0 8px',
      color: '#111827',
      fontSize: 18,
      fontWeight: 800,
    },
    desc: {
      margin: '8px 0 0',
      color: '#374151',
      fontSize: 14,
      lineHeight: 1.5,
    },
    menuList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 16,
      marginTop: 12,
    },
    menuCard: {
      background: '#ffffff',
      border: '1px solid rgba(17,24,39,0.06)',
      borderRadius: 14,
      padding: 14,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    },
    menuNameRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 6,
    },
    menuName: {
      margin: 0,
      color: '#111827',
      fontSize: 16,
      fontWeight: 700,
    },
    priceTag: {
      background: 'linear-gradient(180deg, rgba(37,99,235,0.08), #ffffff)',
      border: '1px solid rgba(37,99,235,0.25)',
      color: '#1e3a8a',
      borderRadius: 999,
      padding: '4px 10px',
      fontSize: 12,
      fontWeight: 800,
      whiteSpace: 'nowrap',
    },
    menuDesc: {
      margin: 0,
      color: '#4b5563',
      fontSize: 13,
      lineHeight: 1.5,
    },
    empty: {
      background: '#ffffff',
      border: '1px dashed rgba(17,24,39,0.15)',
      borderRadius: 12,
      padding: 24,
      color: '#6b7280',
      marginTop: 12,
    },
    notFound: {
      background: '#ffffff',
      border: '1px solid rgba(239,68,68,0.2)',
      color: '#991b1b',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 1px 2px rgba(239,68,68,0.12)',
    }
  };

  if (!restaurant) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <button
            type="button"
            onClick={onBack}
            style={styles.backBtn}
            aria-label="Back to restaurants"
          >
            ← Back
          </button>
          <div style={styles.notFound} role="alert">
            Restaurant not found. It may have been removed.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main aria-label="Restaurant details" style={styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={onBack}
          style={styles.backBtn}
          aria-label="Back to restaurants"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.10)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(17,24,39,0.12)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; }}
        >
          ← Back
        </button>

        <section style={styles.headerCard}>
          <h1 style={styles.title}>{restaurant.name}</h1>
          <div style={styles.metaRow}>
            <span style={styles.chip} aria-label={`Cuisine ${restaurant.cuisine}`}>🍽️ {restaurant.cuisine}</span>
            <span style={{ ...styles.chip, ...styles.chipAmber }} aria-label={`Rating ${restaurant.rating}`}>
              ⭐ {Number(restaurant.rating).toFixed(1)}
            </span>
          </div>
          {restaurant.description ? (
            <>
              <h3 style={styles.sectionTitle}>About</h3>
              <p style={styles.desc}>{restaurant.description}</p>
            </>
          ) : null}
        </section>

        <section aria-label="Menu">
          <h2 style={styles.sectionTitle}>Menu</h2>
          {(!menu || menu.length === 0) ? (
            <div style={styles.empty} role="status" aria-live="polite">
              No menu items are available for this restaurant yet.
            </div>
          ) : (
            <ul style={styles.menuList}>
              {menu.map((item) => (
                <li key={item.id} style={{ listStyle: 'none' }}>
                  <article
                    style={styles.menuCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.10)';
                      e.currentTarget.style.borderColor = 'rgba(37,99,235,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(17,24,39,0.06)';
                    }}
                  >
                    <div style={styles.menuNameRow}>
                      <h3 style={styles.menuName}>{item.name}</h3>
                      <span style={styles.priceTag}>${Number(item.price).toFixed(2)}</span>
                    </div>
                    {item.description ? (
                      <p style={styles.menuDesc}>{item.description}</p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
