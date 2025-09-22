import React from 'react';
import '../styles/home.css';
import TopNav from '../components/TopNav';
import Hero from '../components/Hero';

/**
 * Home
 * Implements the extracted homepage layout: red canvas, white rounded card,
 * right-aligned navigation, hero split, and a call-to-action bridge section.
 */
// PUBLIC_INTERFACE
export default function Home({ onExplore }) {
  /**
   * Renders the homepage with the hero design.
   * Props:
   * - onExplore: optional callback when the user chooses to scroll/explore restaurants
   */
  const handleContact = () => {
    // Placeholder interaction: focus the explore section if provided
    const target = document.getElementById('explore-restaurants') || document.getElementById('restaurant-list');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onExplore) onExplore();
  };

  return (
    <main role="main" className="page-canvas">
      <div className="card">
        <TopNav items={['Home', 'Blog', 'Services', 'Location']} />
        <Hero
          title="Food Delivery"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ctaLabel="CONTACT"
          illustrationSrc="/assets/illustrations/hero-food-delivery.svg"
          onCtaClick={handleContact}
        />
        <section className="cta-section" aria-label="Explore restaurants">
          <div className="cta-panel" id="explore-restaurants">
            <span role="img" aria-label="sparkles">✨</span>
            <span>
              Ready to order? <strong>Explore restaurants</strong> below.
            </span>
            <a
              href="#restaurant-list"
              style={{
                marginLeft: 'auto',
                color: '#1e3a8a',
                textDecoration: 'none',
                fontWeight: 700
              }}
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
      </div>
    </main>
  );
}
