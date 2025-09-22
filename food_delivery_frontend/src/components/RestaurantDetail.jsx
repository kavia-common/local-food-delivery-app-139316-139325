import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/home.css';
import { getRestaurantById, getMenusByRestaurant, addToCart } from '../storage/localStore';

/**
 * RestaurantDetail
 * Enhanced detail view for a single restaurant with:
 * - Large banner image with overlay
 * - Prominent name & cuisine
 * - Stats chips (rating, dish count, price range)
 * - Visually separated sections (About, Menu)
 * - Styled menu grid with structured, accessible cards
 * - Ocean-themed buttons with clear hover/disabled states and subtle feedback
 * - Optional ribbons/tags on images (e.g., Best Seller, New)
 * - Accessible and responsive layout
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
  const rawMenu = useMemo(() => getMenusByRestaurant(restaurantId), [restaurantId]);

  // Generate options schema and optional ribbon tag for items without options/tags.
  const enhanceItem = (it) => {
    const base = { ...it };
    const lowerName = (it?.name || '').toLowerCase();

    // Optional ribbons/tags heuristic: Sushi items as Best Seller, Pasta as New
    if (!base.tag) {
      if (lowerName.includes('roll') || lowerName.includes('nigiri')) {
        base.tag = { label: 'Best Seller', tone: 'amber' };
      } else if (lowerName.includes('spaghetti') || lowerName.includes('penne')) {
        base.tag = { label: 'New', tone: 'blue' };
      }
    }

    if (it && it.options) return base;

    const options = {};
    if (
      lowerName.includes('roll') ||
      lowerName.includes('nigiri') ||
      lowerName.includes('spaghetti') ||
      lowerName.includes('penne')
    ) {
      options.size = {
        type: 'select',
        label: 'Size',
        values: ['Regular', 'Large'],
      };
    }

    if (lowerName.includes('spaghetti') || lowerName.includes('penne')) {
      options.addons = {
        type: 'multi',
        label: 'Add-ons',
        values: ['Extra Cheese', 'Garlic Bread'],
      };
    }
    if (lowerName.includes('roll')) {
      options.addons = {
        type: 'multi',
        label: 'Add-ons',
        values: ['Extra Wasabi', 'Ginger'],
      };
    }

    return { ...base, options: Object.keys(options).length ? options : undefined };
  };

  const menu = useMemo(() => (rawMenu || []).map(enhanceItem), [rawMenu]);

  // Stats helpers
  const dishesCount = menu.length;
  const priceStats = useMemo(() => {
    const prices = menu.map((i) => Number(i.price) || 0).filter((n) => !Number.isNaN(n));
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max, label: `$${min.toFixed(2)}–$${max.toFixed(2)}` };
  }, [menu]);

  // Local UI state maps
  // selections: { [menuItemId]: { quantity, size, addons:Set } }
  const [selections, setSelections] = useState({});
  // customization panel open state
  const [openCustom, setOpenCustom] = useState({}); // { [menuItemId]: boolean }
  // add-to-cart transient feedback state
  const [adding, setAdding] = useState({}); // { [menuItemId]: boolean }
  const [announce, setAnnounce] = useState(''); // aria-live message

  // Reveal-on-scroll within this component
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll('.reveal-on-scroll'));
    if (items.length === 0) return;

    const applyVisible = (el) => el.classList.add('is-visible');

    if (!('IntersectionObserver' in window)) {
      items.forEach(applyVisible);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-animate-delay') || '0ms';
            el.style.setProperty('--a-delay', delay);
            applyVisible(el);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [restaurantId]);

  // Inline styles for page sections (kept minimal; card/button/menu handled via CSS classes)
  const styles = {
    page: {
      background: '#f9fafb',
      minHeight: '100vh',
      paddingTop: 16,
      paddingBottom: 32,
    },
    container: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: '0 16px',
    },
    backRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12
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
    },
    bannerCard: {
      background: '#ffffff',
      border: '1px solid rgba(17,24,39,0.06)',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 8px 22px rgba(37,99,235,0.10)',
      marginBottom: 18,
    },
    heroWrap: {
      position: 'relative',
      width: '100%',
      aspectRatio: '21 / 9',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.8))',
      borderBottom: '1px solid rgba(37,99,235,0.18)',
    },
    heroImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: 'scale(1)',
      transition: 'transform .8s ease',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 85%)',
      pointerEvents: 'none',
    },
    pillRow: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 16,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
    },
    bannerTitle: {
      margin: 0,
      color: '#ffffff',
      fontSize: 28,
      fontWeight: 900,
      letterSpacing: 0.2,
      textShadow: '0 2px 8px rgba(0,0,0,0.35)'
    },
    bannerMetaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
      flexWrap: 'wrap',
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 800,
      background: 'linear-gradient(180deg, rgba(37,99,235,0.08), #ffffff)',
      border: '1px solid rgba(37,99,235,0.25)',
      color: '#0f172a',
      boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
    },
    chipInverted: {
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.45)',
      color: '#ffffff',
      textShadow: '0 1px 4px rgba(0,0,0,0.3)'
    },
    sectionCard: {
      background: '#ffffff',
      border: '1px solid rgba(17,24,39,0.06)',
      borderRadius: 16,
      padding: 18,
      boxShadow: '0 4px 14px rgba(37,99,235,0.08)',
      marginBottom: 18,
    },
    sectionHeaderRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 8,
    },
    sectionTitle: {
      margin: 0,
      color: '#111827',
      fontSize: 20,
      fontWeight: 900,
    },
    sectionSubtle: {
      color: '#6b7280',
      fontSize: 13,
      margin: 0
    },
    desc: {
      margin: '8px 0 0',
      color: '#374151',
      fontSize: 14,
      lineHeight: 1.55,
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

  const bannerSrc =
    restaurant.image ||
    'https://images.unsplash.com/photo-1498656307815-132743b76b03?q=80&w=1200&auto=format&fit=crop';

  // Handlers
  const toggleCustomize = (id) => {
    setOpenCustom((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setQty = (item, v) => {
    const coerced = Math.max(1, Number(v) || 1);
    setSelections((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        quantity: coerced,
        addons: prev[item.id]?.addons || new Set(),
        size: prev[item.id]?.size || (item.options?.size?.values?.[0]),
      },
    }));
  };

  const setSize = (item, size) => {
    setSelections((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        size,
        quantity: Math.max(1, Number(prev[item.id]?.quantity) || 1),
        addons: prev[item.id]?.addons || new Set(),
      },
    }));
  };

  const toggleAddon = (item, ad, checked) => {
    setSelections((prev) => {
      const existing = prev[item.id] || {};
      const nextSet = new Set(existing.addons || []);
      if (checked) nextSet.add(ad);
      else nextSet.delete(ad);
      return {
        ...prev,
        [item.id]: {
          ...existing,
          addons: nextSet,
          quantity: Math.max(1, Number(existing.quantity) || 1),
          size: existing.size || (item.options?.size?.values?.[0]),
        },
      };
    });
  };

  const onAddToCart = (e, item) => {
    const sel = selections[item.id] || {};
    const qty = Math.max(1, Number(sel.quantity) || 1);
    const size = sel.size || (item.options?.size?.values?.[0]);
    const addonsArray = sel.addons ? Array.from(sel.addons) : [];

    if (qty < 1 || Number.isNaN(qty)) {
      window.alert('Please enter a valid quantity.');
      return;
    }

    // Subtle button feedback and disabled state
    setAdding((prev) => ({ ...prev, [item.id]: true }));
    e.currentTarget.classList.add('pulse-once');

    addToCart({
      restaurantId: restaurant.id,
      menuItemId: item.id,
      name: item.name,
      unitPrice: Number(item.price) || 0,
      quantity: qty,
      ...(size ? { size } : {}),
      ...(addonsArray.length ? { addons: addonsArray } : {}),
    });

    setAnnounce(`Added ${qty} × ${item.name}${size ? ` (${size})` : ''} to cart.`);
    // Brief reset for feedback
    setTimeout(() => {
      setAdding((prev) => ({ ...prev, [item.id]: false }));
      e.currentTarget.classList.remove('pulse-once');
    }, 900);
  };

  return (
    <main aria-label="Restaurant details" style={styles.page} ref={rootRef}>
      <div style={styles.container}>
        <div style={styles.backRow}>
          <button
            type="button"
            onClick={onBack}
            style={styles.backBtn}
            aria-label="Back to restaurants"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.10)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(17,24,39,0.12)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Banner with overlayed title and stats */}
        <section
          style={styles.bannerCard}
          className="reveal-on-scroll"
          data-animate="fade-in"
          data-animate-delay="0ms"
          aria-label="Restaurant banner"
        >
          <div
            style={styles.heroWrap}
            aria-hidden={false}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            <img
              src={bannerSrc}
              alt={`Banner image for ${restaurant.name}`}
              style={styles.heroImg}
              loading="lazy"
            />
            <div style={styles.overlay} />
            <div style={styles.pillRow}>
              <div>
                <h1 style={styles.bannerTitle}>{restaurant.name}</h1>
                <div style={styles.bannerMetaRow}>
                  <span style={{ ...styles.chip, ...styles.chipInverted }} aria-label={`Cuisine ${restaurant.cuisine}`}>
                    🍽️ {restaurant.cuisine}
                  </span>
                  <span style={{ ...styles.chip, ...styles.chipInverted }} aria-label={`Rating ${restaurant.rating}`}>
                    ⭐ {Number(restaurant.rating).toFixed(1)}
                  </span>
                  {typeof dishesCount === 'number' && dishesCount > 0 && (
                    <span style={{ ...styles.chip, ...styles.chipInverted }} aria-label={`${dishesCount} dishes available`}>
                      🧾 {dishesCount} dishes
                    </span>
                  )}
                  {!!priceStats && (
                    <span style={{ ...styles.chip, ...styles.chipInverted }} aria-label={`Price range ${priceStats.label}`}>
                      💲 {priceStats.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        {restaurant.description ? (
          <section
            style={styles.sectionCard}
            className="reveal-on-scroll"
            data-animate="fade-up"
            data-animate-delay="60ms"
            aria-label="About restaurant"
          >
            <div style={styles.sectionHeaderRow}>
              <h2 style={styles.sectionTitle}>About</h2>
            </div>
            <p style={styles.desc}>{restaurant.description}</p>
          </section>
        ) : null}

        {/* Menu Section */}
        <section
          style={styles.sectionCard}
          className="reveal-on-scroll"
          data-animate="fade-up"
          data-animate-delay="120ms"
          aria-label="Menu"
        >
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>Menu</h2>
            <p style={styles.sectionSubtle}>
              {dishesCount > 0 ? `${dishesCount} item${dishesCount > 1 ? 's' : ''}` : 'No items yet'}
            </p>
          </div>

          {(!menu || menu.length === 0) ? (
            <div style={styles.empty} role="status" aria-live="polite">
              No menu items are available for this restaurant yet.
            </div>
          ) : (
            <>
              {/* aria-live region for add-to-cart feedback (screen-reader only) */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {announce}
              </div>

              <ul className="menu-grid" aria-label="Menu item list">
                {menu.map((item, idx) => (
                  <li key={item.id} style={{ listStyle: 'none' }}>
                    <article
                      className="menu-card reveal-on-scroll"
                      data-animate="fade-up"
                      data-animate-delay={`${idx * 40}ms`}
                      aria-label={`${item.name}, priced at $${Number(item.price || 0).toFixed(2)}`}
                    >
                      <div className="menu-media" aria-hidden>
                        <img
                          className="menu-image"
                          src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'}
                          alt=""
                          loading="lazy"
                        />
                        {item.tag?.label ? (
                          <div
                            className={`menu-ribbon ${item.tag.tone === 'amber' ? 'is-amber' : 'is-blue'}`}
                            aria-hidden="true"
                          >
                            {item.tag.label}
                          </div>
                        ) : null}
                      </div>

                      <div className="menu-body">
                        <header className="menu-head">
                          <h3 className="menu-title">{item.name}</h3>
                          <span className="price-chip">${Number(item.price || 0).toFixed(2)}</span>
                        </header>

                        {item.description ? <p className="menu-desc">{item.description}</p> : null}

                        <div className="menu-actions">
                          {item.options ? (
                            <button
                              type="button"
                              className="btn-outline-ocean"
                              aria-expanded={!!openCustom[item.id]}
                              aria-controls={`options-${item.id}`}
                              onClick={() => toggleCustomize(item.id)}
                            >
                              {openCustom[item.id] ? 'Hide options' : 'Customize'}
                            </button>
                          ) : (
                            <span className="menu-meta-hint" aria-hidden>
                              No customization
                            </span>
                          )}

                          <div className="qty-wrap" role="group" aria-label={`Quantity for ${item.name}`}>
                            <label className="field-label" htmlFor={`qty-${item.id}`}>Qty</label>
                            <input
                              id={`qty-${item.id}`}
                              type="number"
                              min={1}
                              step={1}
                              className="field-input qty"
                              value={Math.max(1, Number(selections[item.id]?.quantity) || 1)}
                              onChange={(e) => setQty(item, e.target.value)}
                            />
                          </div>

                          <button
                            type="button"
                            className="btn-ocean"
                            disabled={!!adding[item.id]}
                            aria-busy={!!adding[item.id]}
                            onClick={(e) => onAddToCart(e, item)}
                            aria-label={`Add ${item.name} to cart`}
                          >
                            {adding[item.id] ? 'Adding…' : 'Add to Cart'}
                          </button>
                        </div>

                        {item.options ? (
                          <div
                            id={`options-${item.id}`}
                            className={`options-panel ${openCustom[item.id] ? 'is-open' : ''}`}
                            aria-hidden={!openCustom[item.id]}
                          >
                            {/* Size select if provided */}
                            {item.options.size?.values?.length ? (
                              <div className="option-row">
                                <label className="field-label" htmlFor={`size-${item.id}`}>
                                  {item.options.size.label || 'Size'}
                                </label>
                                <select
                                  id={`size-${item.id}`}
                                  className="field-input"
                                  value={(selections[item.id]?.size) || item.options.size.values[0]}
                                  onChange={(e) => setSize(item, e.target.value)}
                                  aria-label={`${item.name} size`}
                                >
                                  {item.options.size.values.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            ) : null}

                            {/* Add-ons checkboxes if provided */}
                            {item.options.addons?.values?.length ? (
                              <fieldset className="option-row">
                                <legend className="field-label">
                                  {item.options.addons.label || 'Add-ons'}
                                </legend>
                                <div className="checkbox-group">
                                  {item.options.addons.values.map((ad) => {
                                    const selectedSet = selections[item.id]?.addons || new Set();
                                    const checked = selectedSet.has(ad);
                                    return (
                                      <label key={ad} className="checkbox-label">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(e) => toggleAddon(item, ad, e.target.checked)}
                                          aria-label={`${ad} add-on`}
                                        />
                                        <span>{ad}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
