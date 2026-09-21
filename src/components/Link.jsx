import React from 'react';

export default function Link({ href, className = '', children, ...props }) {
  const handleClick = (e) => {
    // Only handle standard left clicks without modifier keys
    if (
      e.button === 0 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !e.shiftKey &&
      href.startsWith('/')
    ) {
      e.preventDefault();
      if (window.location.pathname !== href) {
        window.history.pushState({}, '', href);
        // Dispatch popstate so router listeners update the route
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
