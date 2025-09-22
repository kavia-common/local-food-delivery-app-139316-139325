import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getRestaurantById, getMenusByRestaurant, addToCart } from '../storage/localStore';

/**
 * RestaurantDetail
 * Enhanced detail view for a single restaurant with:
 * - Large banner image with overlay
 * - Prominent name & cuisine
 * - Stats chips (rating, dish count, price range)
 * - Visually separated sections (About, Menu)
 * - Styled menu grid with animated cards
 * - Subtle transitions and reveal-on-scroll
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
  const menu = useMemo(() => getMenusByRestaurant(restaurantId), [restaurantId]);

  // Generate simple options schema for items that do not yet define options.
  const enhanceItem = (it) => {
    if (it && it.options) return it;
    const base = { ...it };
    const lowerName = (it?.name || '').toLowerCase();
    const options = {};

    // Add size options for common items
    if (
      lowerName.includes('roll') ||
      lowerName.includes('nigiri') ||
      lowerName.includes('spaghetti') ||
      lowerName.includes('penne')
    ) {
      options.size = {
        type: 'select',
        label: 'Size',
        values: ['Regular', 'Large']
      };
    }

    // Simple add-ons example
    if (lowerName.includes('spaghetti') || lowerName.includes('penne')) {
      options.addons = {
        type: 'multi',
        label: 'Add-ons',
        values: ['Extra Cheese', 'Garlic Bread']
      };
    }
    if (lowerName.includes('roll')) {
      options.addons = {
        type: 'multi',
        label: 'Add-ons',
        values: ['Extra Wasabi', 'Ginger']
      };
    }

    return { ...base, options: Object.keys(options).length ? options : undefined };
  };

  const enhancedMenu = useMemo(() => (menu || []).map(enhanceItem), [menu]);

  // Stats helpers
  const dishesCount = enhancedMenu.length;
  const priceStats = useMemo(() => {
    const prices = enhancedMenu.map((i) => Number(i.price) || 0).filter((n) => !Number.isNaN(n));
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max, label: `$${min.toFixed(2)}–$${max.toFixed(2)}` };
  }, [enhancedMenu]);

  // Local UI state map: { [menuItemId]: { quantity, size, addons:Set } }
  const [selections, setSelections] = useState({});

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
      aspectRatio: '21 / 9', // Larger banner
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
    chipAmber: {
      background: 'linear-gradient(180deg, rgba(245,158,11,0.12), #ffffff)',
      border: '1px solid rgba(245,158,11,0.35)',
      color: '#7c2d12',
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
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 12
    },
    menuImgWrap: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      borderRadius: 10,
      background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.8))',
      border: '1px solid rgba(37,99,235,0.18)',
    },
    menuImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    menuContentCol: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
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
      fontWeight: 800,
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
    controlRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 10
    },
    select: {
      padding: '6px 8px',
      borderRadius: 8,
      border: '1px solid rgba(17,24,39,0.15)',
      background: '#fff',
      fontSize: 12
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    },
    qtyInput: {
      width: 64,
      padding: '6px 8px',
      borderRadius: 8,
      border: '1px solid rgba(17,24,39,0.15)'
    },
    addBtn: {
      marginLeft: 'auto',
      background: '#2563EB',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '8px 12px',
      fontSize: 13,
      fontWeight: 800,
      boxShadow: '0 6px 16px rgba(37,99,235,0.22)',
      cursor: 'pointer',
      transition: 'transform .08s ease, opacity 0.2s ease'
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
            <ul style={styles.menuList} aria-label="Menu item list">
              {enhancedMenu.map((item, idx) => (
                <li key={item.id} style={{ listStyle: 'none' }}>
                  <article
                    style={styles.menuCard}
                    className="reveal-on-scroll hover-lift"
                    data-animate="fade-up"
                    data-animate-delay={`${idx * 40}ms`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(37,99,235,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(17,24,39,0.06)';
                    }}
                    aria-label={`${item.name}, priced at $${Number(item.price).toFixed(2)}`}
                  >
                    <div style={styles.menuImgWrap} aria-hidden>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'}
                        alt={item.name}
                        style={styles.menuImg}
                        loading="lazy"
                      />
                    </div>
                    <div style={styles.menuContentCol}>
                      <div style={styles.menuNameRow}>
                        <h3 style={styles.menuName}>{item.name}</h3>
                        <span style={styles.priceTag}>${Number(item.price).toFixed(2)}</span>
                      </div>

                      {item.description ? (
                        <p style={styles.menuDesc}>{item.description}</p>
                      ) : null}

                      <div style={styles.controlRow} aria-label="Customization options">
                        {/* Size select if provided */}
                        {item.options && item.options.size && item.options.size.values && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, color: '#374151', fontWeight: 800 }}>
                              {item.options.size.label || 'Size'}:
                            </span>
                            <select
                              style={styles.select}
                              value={(selections[item.id]?.size) || item.options.size.values[0]}
                              onChange={(e) => {
                                const v = e.target.value;
                                setSelections((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...(prev[item.id] || {}),
                                    size: v,
                                    quantity: Math.max(1, Number(prev[item.id]?.quantity) || 1),
                                    addons: prev[item.id]?.addons || new Set()
                                  }
                                }));
                              }}
                              aria-label={`${item.name} size`}
                            >
                              {item.options.size.values.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </label>
                        )}

                        {/* Add-ons checkboxes if provided */}
                        {item.options && item.options.addons && item.options.addons.values && (
                          <div style={styles.checkboxGroup} role="group" aria-label={item.options.addons.label || 'Add-ons'}>
                            <span style={{ fontSize: 12, color: '#374151', fontWeight: 800 }}>
                              {item.options.addons.label || 'Add-ons'}:
                            </span>
                            {item.options.addons.values.map((ad) => {
                              const selectedSet = selections[item.id]?.addons || new Set();
                              const checked = selectedSet.has(ad);
                              return (
                                <label key={ad} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      setSelections((prev) => {
                                        const existing = prev[item.id] || {};
                                        const nextSet = new Set(existing.addons || []);
                                        if (e.target.checked) nextSet.add(ad);
                                        else nextSet.delete(ad);
                                        return {
                                          ...prev,
                                          [item.id]: {
                                            ...existing,
                                            addons: nextSet,
                                            quantity: Math.max(1, Number(existing.quantity) || 1),
                                            size: existing.size || (item.options?.size?.values?.[0])
                                          }
                                        };
                                      });
                                    }}
                                    aria-label={`${ad} add-on`}
                                  />
                                  {ad}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Quantity input always */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: '#374151', fontWeight: 800 }}>Qty:</span>
                          <input
                            type="number"
                            min={1}
                            step={1}
                            style={styles.qtyInput}
                            value={Math.max(1, Number(selections[item.id]?.quantity) || 1)}
                            onChange={(e) => {
                              const v = Math.max(1, Number(e.target.value) || 1);
                              setSelections((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] || {}),
                                  quantity: v,
                                  addons: prev[item.id]?.addons || new Set(),
                                  size: prev[item.id]?.size || (item.options?.size?.values?.[0])
                                }
                              }));
                            }}
                            aria-label={`Quantity for ${item.name}`}
                          />
                        </label>

                        <button
                          type="button"
                          style={styles.addBtn}
                          onClick={(e) => {
                            const sel = selections[item.id] || {};
                            const qty = Math.max(1, Number(sel.quantity) || 1);
                            const size = sel.size || (item.options?.size?.values?.[0]);
                            const addonsArray = sel.addons ? Array.from(sel.addons) : [];

                            if (qty < 1 || Number.isNaN(qty)) {
                              window.alert('Please enter a valid quantity.');
                              return;
                            }

                            // Subtle click feedback
                            e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
                            setTimeout(() => {
                              e.currentTarget.style.transform = 'none';
                            }, 120);

                            addToCart({
                              restaurantId: restaurant.id,
                              menuItemId: item.id,
                              name: item.name,
                              unitPrice: Number(item.price) || 0,
                              quantity: qty,
                              ...(size ? { size } : {}),
                              ...(addonsArray.length ? { addons: addonsArray } : {})
                            });

                            window.alert(`Added ${qty} x ${item.name}${size ? ' (' + size + ')' : ''} to cart.`);
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.95'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                          aria-label={`Add ${item.name} to cart`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
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
