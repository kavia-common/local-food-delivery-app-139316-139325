import React from 'react';

/**
 * Hero
 * Two-column hero with headline, body, CTA, and an illustration on the right.
 * Prioritizes extracted design tokens; keeps structure responsive.
 */
// PUBLIC_INTERFACE
export default function Hero({
  title = 'Food Delivery',
  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ctaLabel = 'CONTACT',
  illustrationSrc = '/assets/illustrations/hero-food-delivery.svg',
  onCtaClick
}) {
  /** Renders the hero section. */
  const handleClick = (e) => {
    if (onCtaClick) onCtaClick(e);
  };

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-copy">
        <h1>{title}</h1>
        <p>{text}</p>
        <button type="button" className="btn-primary" onClick={handleClick}>
          {ctaLabel}
        </button>
      </div>
      <div className="hero-illustration">
        <img
          src={illustrationSrc}
          alt="Courier on scooter and mobile app with burger and location pin"
          loading="eager"
        />
      </div>
    </section>
  );
}
