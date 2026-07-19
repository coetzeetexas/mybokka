import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://korixllc.com';
const DEFAULT_OG_IMAGE = 'https://korixllc.com/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg';
const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

interface PageMetaOptions {
  /** Overrides the default site image for og:image/twitter:image on this page. */
  image?: string;
  /** Set true for utility pages (cart, checkout, order lookup, 404) with no unique indexable content. */
  noindex?: boolean;
}

// Sets the document title, meta description, canonical URL, and Open Graph /
// Twitter tags per route (client-side "head" management). Without this,
// every route would keep whatever the previous page (or index.html's
// homepage defaults) last set — most importantly the canonical link, which
// would tell search engines every page is a duplicate of the homepage and
// suppress indexing of the rest of the site entirely.
export const usePageMeta = (title: string, description: string, options: PageMetaOptions = {}) => {
  const location = useLocation();

  useEffect(() => {
    const url = `${SITE_URL}${location.pathname}`;
    const image = options.image ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    setMetaContent('meta[name="robots"]', options.noindex ? 'noindex, follow' : DEFAULT_ROBOTS);

    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[property="og:image"]', image);

    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="twitter:url"]', url);
    setMetaContent('meta[name="twitter:image"]', image);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, location.pathname, options.image, options.noindex]);
};

// Fades content in once it scrolls into view. Uses a callback ref (not a plain
// ref object) so the observer attaches whenever the DOM node actually appears —
// not just on the component's first mount. Plain refs miss elements that render
// null on first pass (e.g. while data is still loading) and mount their real
// content later, since the observer setup effect never re-runs to notice the
// now-existing node, leaving isInView permanently false.
export const useInView = (threshold = 0.1) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return { ref, isInView };
};
