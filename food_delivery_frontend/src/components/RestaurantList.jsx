import React, { useEffect, useState } from 'react';
import { getRestaurants, resetToSeed } from '../storage/localStore';
import RestaurantDetail from './RestaurantDetail';

/**
 * RestaurantList
 * A simple, accessible list of restaurants using Ocean Professional theme cues.
 * Now supports selecting a restaurant to view its details and menu.
 */
// PUBLIC_INTERFACE
export default function RestaurantList() {
  /** Displays a list of restaurants with name, cuisine, and rating. */
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // Ensure seed exists at least once so the list renders on first app run.
    resetToSeed();
    setRestaurants(getRestaurants());

    // Support basic hash routing: #/restaurant/<id>
    const applyHash = () => {
      const m = window.location.hash.match(/#\/restaurant\/(\d+)/);
      if (m && m[1]) {
        setSelectedId(Number(m[1]));
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const goToDetail = (id) => {
    setSelectedId(id);
    // Update hash to preserve selection on refresh/back-forward
    window.location.hash = `#/restaurant/${id}`;
  };

  const goBackToList = () => {
    setSelectedId(null);
    // Clear hash
    if (window.location.hash.startsWith('#/restaurant/')) {
      window.location.hash = '#/';
    } else {
      window.location.hash = '';
    }
  };

  if (selectedId != null) {
    return <RestaurantDetail restaurantId={selectedId} onBack={goBackToList} />;
  }

  const styles = {
    container: {
      maxWidth: 960,
      margin: '24px auto',
      padding: '0 16px',
    },
    header: {
      color: '#111827',
      margin: '8px 0 16px',
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: 0.2,
    },
    helper: {
      color: '#6b7280',
      fontSize: 14,
      marginBottom: 16,
    },
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 16,
    },
    card: {
      background: '#ffffff', // surface
      border: '1px solid rgba(17,24,39,0.06)',
      borderRadius: 12,
      padding: 16,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(37,99,235,0.10)', // primary-tinted shadow
      borderColor: 'rgba(37,99,235,0.25)', // primary
    },
    name: {
      margin: 0,
      color: '#111827', // text
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 1.3,
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 8,
      gap: 8,
      flexWrap: 'wrap',
    },
    imageWrap: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      borderRadius: 10,
      background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.8))',
      border: '1px solid rgba(37,99,235,0.18)',
      boxShadow: '0 6px 14px rgba(37,99,235,0.08)',
      marginBottom: 12
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      color: '#111827',
      background: '#f9fafb', // background
      border: '1px solid rgba(17,24,39,0.06)',
    },
    cuisineChip: {
      background: 'linear-gradient(180deg, rgba(37,99,235,0.08), rgba(255,255,255,0.9))',
      borderColor: 'rgba(37,99,235,0.25)',
      color: '#0f172a',
    },
    ratingChip: {
      background: 'linear-gradient(180deg, rgba(245,158,11,0.12), rgba(255,255,255,0.9))',
      borderColor: 'rgba(245,158,11,0.35)',
      color: '#7c2d12',
    },
    empty: {
      background: '#ffffff',
      border: '1px dashed rgba(17,24,39,0.15)',
      borderRadius: 12,
      padding: 24,
      color: '#6b7280',
    },
  };

  const handleKeyCard = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetail(id);
    }
  };

  return (
    <main
      aria-label="Restaurant directory"
      style={{
        background: '#f9fafb', // page background
        minHeight: '100vh',
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <div style={styles.container}>
        <h1 style={styles.header}>Explore Restaurants</h1>
        <p style={styles.helper}>
          Browse our curated selection. Click a restaurant to view its menu.
        </p>

        {(!restaurants || restaurants.length === 0) ? (
          <div role="status" aria-live="polite" style={styles.empty}>
            No restaurants found. Please refresh to seed demo data or add restaurants.
          </div>
        ) : (
          <section>
            <ul style={styles.list} aria-label="Restaurant list">
              {restaurants.map((r) => (
                <li key={r.id} style={{ listStyle: 'none' }}>
                  <article
                    tabIndex={0}
                    role="button"
                    aria-label={`${r.name}, ${r.cuisine}, rated ${r.rating}. Press Enter to view menu.`}
                    onKeyDown={(e) => handleKeyCard(e, r.id)}
                    style={styles.card}
                    onClick={() => goToDetail(r.id)}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.card);
                      e.currentTarget.style.cursor = 'pointer';
                    }}
                  >
                    <div style={styles.imageWrap} aria-hidden>
                      <img
                        src={r.image || 'https://images.unsplash.com/photo-1498656307815-132743b76b03?q=80&w=1200&auto=format&fit=crop'}
                        alt=""
                        style={styles.image}
                        loading="lazy"
                      />
                    </div>
                    <header>
                      <h2 style={styles.name}>{r.name}</h2>
                    </header>
                    <div style={styles.metaRow}>
                      <span style={{ ...styles.chip, ...styles.cuisineChip }} aria-label={`Cuisine ${r.cuisine}`}>
                        🍽️ {r.cuisine}
                      </span>
                      <span style={{ ...styles.chip, ...styles.ratingChip }} aria-label={`Rating ${r.rating}`}>
                        ⭐ {Number(r.rating).toFixed(1)}
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
