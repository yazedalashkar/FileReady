import { useEffect } from 'react';
import { SITE_URL } from '../data/seoData.js';

export default function SEO({
  title,
  description,
  canonical,
  h1,
  lang = 'en',
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Document Title
    if (title) {
      document.title = title;
    }

    // 2. Set HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', 'index, follow');

    // 4. Canonical Link
    const targetCanonical = canonical || window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', targetCanonical);

    // 5. Open Graph Tags
    setMetaTag('property', 'og:site_name', 'FileReady');
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', targetCanonical);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', `${SITE_URL}/logo.png`);

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', `${SITE_URL}/logo.png`);

    // 7. JSON-LD Structured Data (WebApplication & BreadcrumbList only)
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'FileReady',
        url: targetCanonical,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Works client-side in all modern browsers.',
        description: description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'ar' ? 'الرئيسية' : 'Home',
            item: `${SITE_URL}/`,
          },
          ...(targetCanonical !== `${SITE_URL}/`
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: h1 || title,
                  item: targetCanonical,
                },
              ]
            : []),
        ],
      },
    ];

    let scriptEl = document.getElementById('fileready-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'fileready-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
  }, [title, description, canonical, h1, lang]);

  return null;
}
