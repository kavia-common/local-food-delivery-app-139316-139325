import React, { useEffect } from 'react';
import '../styles/home.css';
import TopNav from '../components/TopNav';
import Hero from '../components/Hero';

/**
 * Home
 * Implements the extracted homepage layout: red canvas, white rounded card,
 * right-aligned navigation, hero split, and a call-to-action bridge section.
 *
 * Adds Ocean Professional content blocks with subtle animations:
 * - Features/services grid
 * - Promo banner
 * - Testimonials
 * - About snippet
 */
// PUBLIC_INTERFACE
export default function Home({ onExplore }) {
  /**
   * Renders the homepage with the hero design and enhanced sections.
   * Props:
   * - onExplore: optional callback when the user chooses to scroll/explore restaurants
   */

  const handleContact = () => {
    // Smoothly scroll to explore or list anchors
    const target =
      document.getElementById('explore-restaurants') ||
      document.getElementById('restaurant-list');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onExplore) onExplore();
  };

  // Lightweight reveal-on-scroll using IntersectionObserver
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal-on-scroll'));
    if (items.length === 0) return;

    const applyVisible = (el) => el.classList.add('is-visible');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show immediately when IO unsupported
      items.forEach(applyVisible);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Optional per-element delay via data attribute
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
  }, []);

  return (
    <main role="main" className="page-canvas">
      <div className="card">
        <TopNav items={['Home', 'Blog', 'Services', 'Location']} />

        {/* Hero with subtle animation/tilt */}
        <Hero
          title="Food Delivery"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ctaLabel="CONTACT"
          illustrationSrc="/assets/illustrations/hero-food-delivery.svg"
          onCtaClick={handleContact}
        />

        {/* Bridge CTA to restaurant list */}
        <section className="cta-section" aria-label="Explore restaurants">
          <div
            className="cta-panel reveal-on-scroll"
            id="explore-restaurants"
            data-animate="fade-in"
            data-animate-delay="60ms"
          >
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            <span>
              Ready to order? <strong>Explore restaurants</strong> below.
            </span>
            <a
              href="#restaurant-list"
              className="cta-link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('restaurant-list');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (onExplore) onExplore();
              }}
            >
              Browse ↓
            </a>
          </div>
        </section>

        {/* Service features (Ocean Professional accents) */}
        <section className="features" aria-label="Service features">
          <header
            className="section-header reveal-on-scroll"
            data-animate="fade-up"
            data-animate-delay="0ms"
          >
            <h2>Why choose us</h2>
            <p>Modern, reliable delivery with live tracking and top-rated partners.</p>
          </header>
          <ul className="features-grid">
            <li
              className="feature-card reveal-on-scroll hover-lift"
              data-animate="fade-up"
              data-animate-delay="0ms"
            >
              <div className="feature-icon" aria-hidden>
                ⚡
              </div>
              <h3>Lightning-fast</h3>
              <p>Average delivery times under 30 minutes in most areas.</p>
            </li>
            <li
              className="feature-card reveal-on-scroll hover-lift"
              data-animate="fade-up"
              data-animate-delay="80ms"
            >
              <div className="feature-icon" aria-hidden>
                📍
              </div>
              <h3>Live tracking</h3>
              <p>Follow your order with minute-by-minute status updates.</p>
            </li>
            <li
              className="feature-card reveal-on-scroll hover-lift"
              data-animate="fade-up"
              data-animate-delay="160ms"
            >
              <div className="feature-icon" aria-hidden>
                ⭐
              </div>
              <h3>Top partners</h3>
              <p>Curated selection of highly rated restaurants near you.</p>
            </li>
            <li
              className="feature-card reveal-on-scroll hover-lift"
              data-animate="fade-up"
              data-animate-delay="240ms"
            >
              <div className="feature-icon" aria-hidden>
                🔒
              </div>
              <h3>Secure payments</h3>
              <p>Protected transactions with industry-standard encryption.</p>
            </li>
          </ul>
        </section>

        {/* Promo banner */}
        <section
          className="promo reveal-on-scroll"
          aria-label="Promotions"
          data-animate="fade-in"
          data-animate-delay="0ms"
        >
          <div className="promo-banner">
            <span className="badge">New</span>
            <p>
              Free delivery on your first order — use code <strong>WELCOME</strong>
            </p>
            <a
              className="promo-cta"
              href="#restaurant-list"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('restaurant-list');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (onExplore) onExplore();
              }}
            >
              Order now →
            </a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" aria-label="Customer testimonials">
          <header
            className="section-header reveal-on-scroll"
            data-animate="fade-up"
            data-animate-delay="0ms"
          >
            <h2>Loved by diners</h2>
            <p>Hear what our customers are saying.</p>
          </header>
          <ul className="quotes">
            <li
              className="quote-card reveal-on-scroll"
              data-animate="fade-up"
              data-animate-delay="0ms"
            >
              <blockquote>
                “Delivery was quick and the tracking made it stress-free. Definitely my go-to app!”
              </blockquote>
              <cite>— Priya S.</cite>
            </li>
            <li
              className="quote-card reveal-on-scroll"
              data-animate="fade-up"
              data-animate-delay="120ms"
            >
              <blockquote>
                “Great selection and the UI feels modern and clean. Highly recommended.”
              </blockquote>
              <cite>— Lucas M.</cite>
            </li>
            <li
              className="quote-card reveal-on-scroll"
              data-animate="fade-up"
              data-animate-delay="200ms"
            >
              <blockquote>“Secure checkout and fast delivery times. Five stars!”</blockquote>
              <cite>— Aisha K.</cite>
            </li>
          </ul>
        </section>

        {/* About */}
        <section
          className="about reveal-on-scroll"
          aria-label="About our service"
          data-animate="fade-in"
          data-animate-delay="0ms"
        >
          <h2>About us</h2>
          <p>
            We connect you with local favorites using a modern, reliable experience. Our Ocean
            Professional design brings clarity and calm to every screen, with blue and amber accents
            guiding key actions.
          </p>
        </section>
      </div>
    </main>
  );
}
