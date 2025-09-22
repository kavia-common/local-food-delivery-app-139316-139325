import React from 'react';

/**
 * TopNav
 * Right-aligned navigation inside the white card.
 * Uses red brand color for links per design notes.
 */
// PUBLIC_INTERFACE
export default function TopNav({ items = ['Home', 'Blog', 'Services', 'Location'] }) {
  /** Renders a simple top navigation list of links. */
  return (
    <header className="topnav" role="navigation" aria-label="Primary">
      <nav>
        <ul>
          {items.map((label) => (
            <li key={label}>
              <a href="#/" onClick={(e) => e.preventDefault()}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
