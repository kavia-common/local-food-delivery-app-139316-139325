import React, { useRef } from 'react';

/**
 * Hero
 * Two-column hero with headline, body, CTA, and an illustration on the right.
 * Prioritizes extracted design tokens; keeps structure responsive.
 *
 * Adds:
 * - Lightweight parallax tilt on pointer move.
 * - Subtle float animation for the illustration.
 * - Reveal-on-scroll classes with optional stagger.
 */
// PUBLIC_INTERFACE
export default function Hero({
  title = 'Food Delivery',
  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ctaLabel = 'CONTACT',
  illustrationSrc = '/assets/hero-home.jpg',
  onCtaClick
}) {
  /** Renders the hero section with subtle interactive and animated effects. */
  const illWrapRef = useRef(null);

  const handleClick = (e) => {
    if (onCtaClick) onCtaClick(e);
  };

  // Simple parallax tilt effect using mouse position relative to wrapper center
  const handleMouseMove = (e) => {
    const el = illWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;  // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height; // -0.5..0.5

    const maxTilt = 6; // degrees, keep subtle
    const rx = (-dy * maxTilt).toFixed(2);
    const ry = (dx * maxTilt).toFixed(2);

    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleMouseLeave = () => {
    const el = illWrapRef.current;
    if (!el) return;
    el.style.transform = 'none';
  };

  return (
    <section className="hero" aria-label="Hero">
      <div
        className="hero-copy reveal-on-scroll"
        data-animate="fade-up"
        data-animate-delay="0ms"
      >
        <h1>{title}</h1>
        <p>{text}</p>
        <button type="button" className="btn-primary" onClick={handleClick}>
          {ctaLabel}
        </button>
      </div>
      <div
        className="hero-illustration reveal-on-scroll"
        data-animate="fade-up"
        data-animate-delay="120ms"
        ref={illWrapRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-hidden
      >
        <img
          src={illustrationSrc}
          alt="Courier on scooter and mobile app with burger and location pin"
          loading="eager"
        />
      </div>
    </section>
  );
}
